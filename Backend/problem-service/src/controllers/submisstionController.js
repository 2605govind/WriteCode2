import axios from "axios";
import Problem from "../models/problem.model.js";
import Submission from "../models/submission.js";
import { getLanguageById, submitBatch, submitToken } from "../utils/problemUtility.js";
// import { getLanguageById, generateFullCodeWithTestcases, submitSingle, submitOneToken } from "../utils/problemUtility.js";


export const submitCode = async (req, res) => {
  
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({
        success: false,
        message: "Some required fields are missing"
      });
    }

    // Fetch the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    // Create a new submission with status "pending"
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length + problem.visibleTestCases.length
    });

    // Prepare Judge0 submission using both visible and hidden test cases
    const languageId = getLanguageById(language);
    
    const allTestCases = [...problem.visibleTestCases, ...problem.hiddenTestCases];
    const submissions = allTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    // Process the results
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;
    let accepted = false;

    for (const test of testResult) {
      if (test.status_id === 3) { // Accepted
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id === 4 || test.status_id === 5) { // Wrong Answer or Time Limit Exceeded
          status = 'wrong';
        } else { // Compilation Error, Runtime Error etc.
          status = 'error';
        }
        errorMessage = test.stderr || test.compile_output || 'Unknown error';
        break; // Stop at first failure
      }
    }

    // Update the submission with results
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    // Add problem to user's solved list if accepted
    if (status === 'accepted' && !req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      
      try {
        const response = await axios.post('http://localhost:3001/api/v1/service/updateuserinfo', {
          _id: req.result._id,
          problemSolved: req.result.problemSolved,
        });
        
        if (!response.data.success) {
          console.log("Service responded with error");
        }
      } catch (error) {
        console.log("Service is not responding", error);
        // Continue despite service error - this shouldn't fail the submission
      }
    }

    return res.status(201).json({
      success: true,
      message: status === 'accepted' ? "Code accepted" : "Code submitted with errors",
      accepted: (status == 'accepted'),
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });

  } catch (err) {
    console.error("submitCode error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + err.message
    });
  }
};



export const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language, TestCases } = req.body;

    // Validate required fields
    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, code, problemId, or language"
      });
    }

    // Find the problem with test cases
    const problem = await Problem.findById(problemId).select('visibleTestCases');
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    // Get language ID and validate
    const languageId = getLanguageById(language);
    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language"
      });
    }


    // console.log("code", code)
    // Prepare submissions for all test cases
    const submissions = TestCases.map(testcase => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output.trim() // Trim expected output for consistency
    }));

    // Submit all test cases in batch
    const submitResult = await submitBatch(submissions);
    const resultTokens = submitResult.map(value => value.token);

    // Get results for all submissions
    const testResults = await submitToken(resultTokens);

    // Process results
    let testCasesPassed = 0;
    let totalRuntime = 0;
    let maxMemory = 0;
    let isSuccess = true;
    let errorMessages = [];
    let detailedResults = [];

    // console.log("testResults", testResults)

    testResults.forEach((test, index) => {
      const testCaseResult = {
        testCaseNumber: index + 1,
        input: problem.visibleTestCases[index].input,
        expectedOutput: problem.visibleTestCases[index].output,
        actualOutput: test.stdout || null,
        status: test.status.description,
        time: test.time,
        memory: test.memory,
        error: test.stderr || test.compile_output || null
      };

      detailedResults.push(testCaseResult);

      if (test.status.id === 3) { // Accepted
        testCasesPassed++;
        totalRuntime += parseFloat(test.time) || 0;
        maxMemory = Math.max(maxMemory, test.memory || 0);
      } else {
        isSuccess = false;
        if (test.stderr) {
          errorMessages.push(`Test Case ${index + 1}: ${test.stderr}`);
        } else if (test.compile_output) {
          errorMessages.push(`Test Case ${index + 1}: Compilation Error - ${test.compile_output}`);
        } else {
          errorMessages.push(`Test Case ${index + 1}: ${test.status.description}`);
        }
      }
    });

    // Calculate average runtime
    const averageRuntime = testCasesPassed > 0 
      ? (totalRuntime / testCasesPassed).toFixed(3) 
      : 0;

    // Prepare response
    const response = {
      success: isSuccess,
      message: isSuccess 
        ? `Code executed successfully (${testCasesPassed}/${problem.visibleTestCases.length} test cases passed)` 
        : `Code execution failed (${testCasesPassed}/${problem.visibleTestCases.length} test cases passed)`,
      testCasesPassed: testCasesPassed,
      totalTestCases: problem.visibleTestCases.length,
      averageRuntime,
      maxMemory,
      detailedResults
    };

    if (!isSuccess && errorMessages.length > 0) {
      response.error = errorMessages.join('\n');
    }


    return res.status(200).json({
      success: true,
      data: response,
    });

  } catch (err) {
    console.error("Error in runCode:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

