import { getLanguageById, submitBatch, submitToken } from "../utils/problemUtility.js";
import Problem from "../models/problem.model.js"
import Submission from "../models/submission.js";


export const createProblem = async (req, res) => {
  const {
    problemNumber,
    title,
    description,
    difficulty,
    tags,
    companies,
    videosUrl,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
  } = req.body;

  try {
    // Validate required fields
    if (!problemNumber || !title || !description || !difficulty || !referenceSolution) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if problem already exists
    const existingProblem = await Problem.findOne({ problemNumber });
    if (existingProblem) {
      return res.status(400).json({
        success: false,
        message: "Problem with this ID already exists",
      });
    }

    // Validate test cases
    if (!Array.isArray(visibleTestCases) || !Array.isArray(hiddenTestCases)) {
      return res.status(400).json({
        success: false,
        message: "Test cases must be arrays",
      });
    }

    // Process each reference solution
    for (const solution of referenceSolution) {
      const { language, completeCode } = solution;
      const languageId = getLanguageById(language);
      
      if (!languageId) {
        return res.status(400).json({
          success: false,
          message: `Invalid language: ${language}`,
        });
      }

      // Prepare submissions for all test cases
      const submissions = [
        ...visibleTestCases.map(testCase => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.output,
        })),
        ...hiddenTestCases.map(testCase => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testCase.input,
          expected_output: testCase.output,
        })),
      ];

      // Submit and verify test cases
      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map(result => result.token);
      const testResults = await submitToken(resultTokens);

      // console.log(testResults);

      // Check test results
      for (const test of testResults) {
        if (test.status_id !== 3) { // 3 typically means "Accepted"
          return res.status(400).json({
            success: false,
            message: "Test case failed",
            data: {
              input: test.stdin,
              expected: test.expected_output,
              output: test.stdout,
              error: test.message || test.status.description,
            },
          });
        }
      }
    }

    

    // Create the problem
    const newProblem = await Problem.create({
      problemNumber,
      title,
      description,
      difficulty,
      tags,
      companies,
      videosUrl,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.result._id,
    });

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: {
        problemId: newProblem._id,
      },
    });

  } catch (err) {
    console.error("Error creating problem:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    companies,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing ID field",
      });
    }

    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem ID not found in the database",
      });
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map((item) => item.token);
      const testResult = await submitToken(resultTokens);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).json({
            success: false,
            message: "Code failed on one or more visible test cases",
            testResult,
          });
        }
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is missing"
      });
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Problem deletion error: " + err
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is missing",
      });
    }

    const getProblem = await Problem.findById(id).select(
      '_id problemNumber title description difficulty tags visibleTestCases companies startCode referenceSolution videosUrl'
    );

    if (!getProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // you can return video link here

    const problemData = {
      ...getProblem._doc
    };

    // console.log("problemData", problemData)

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      data: problemData,
    });



  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Problem fetch error: " + err,
    });
  }
};


// /api/problems?page=1&limit=10&difficulty=medium&tags=array,math
export const getAllProblem = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const { difficulty, tags, companies, search } = req.query;
    const filter = {};

    // Difficulty filter (skip if 'all')
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      // console.log("tags:", tags);
      const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
      filter.tags = { $all: tagsArray };
    }

    // Companies filter
    if (companies && companies.length > 0) {
      // console.log("companies:", companies);
      const companiesArray = typeof companies === 'string' ? companies.split(',').map(company => company.trim()) : companies;
      filter.companies = { $all: companiesArray.map(company => new RegExp(company, 'i')) };
    }

    // Search filter
    if (search && search.length > 0) {
      // console.log("search:", search);
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problemNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Count with filter
    const totalProblems = await Problem.countDocuments(filter);

    // Fetch with filter, pagination
    const problems = await Problem.find(filter)
      .select('_id problemNumber title difficulty tags companies')
      .skip(skip)
      .limit(limit);

    if (problems.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No problems found with the given filters",
        data: []
      });
    }

    // console.log("Filtered problems:", problems);
    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      data: problems,
      pagination: {
        total: totalProblems,
        page,
        limit,
        totalPages: Math.ceil(totalProblems / limit),
        hasNextPage: skip + problems.length < totalProblems,
        hasPrevPage: page > 1,
      },
    });

  } catch (err) {
    console.error("Error in getAllProblem:", err);
    return res.status(500).json({
      success: false,
      message: "Problem fetch error: " + err.message,
    });
  }
};

export const getAllTagsWithCount = async (req, res) => {
  try {
    const tagCounts = await Problem.aggregate([
      { $unwind: "$tags" }, // First unwind the tags array
      { 
        $project: {
          // Split comma-separated tags into array and trim whitespace
          splitTags: { 
            $map: {
              input: { $split: ["$tags", ","] },
              in: { $trim: { input: "$$this" } }
            }
          }
        } 
      },
      { $unwind: "$splitTags" }, // Unwind the split tags
      { 
        $group: {
          _id: { 
            $toLower: "$splitTags" // Case-insensitive grouping
          },
          count: { $sum: 1 },
          originalName: { $first: "$splitTags" } // Preserve original casing
        }
      },
      { 
        $project: {
          _id: 0,
          name: "$originalName",
          count: 1
        }
      },
      { $sort: { count: -1, name: 1 } } // Sort by count then name
    ]);

    return res.status(200).json({
      success: true,
      message: "Tags with count fetched successfully",
      data: tagCounts,
      totalUniqueTags: tagCounts.length,
      totalTaggedProblems: tagCounts.reduce((sum, tag) => sum + tag.count, 0)
    });

  } catch (err) {
    console.error("Tag count fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tag counts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


export const solvedAllProblembyUser = async (req, res) => {
  try {
    const problemIds = req.result.problemSolved; // array of ObjectIds

    if (!problemIds || problemIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No problems solved yet",
        data: [],
      });
    }

    const problems = await Problem.find({
      _id: { $in: problemIds },
    }).select("_id title difficulty tags");

    res.status(200).json({
      success: true,
      message: "Fetched all solved problems",
      data: problems,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching solved problems",
      error: err.message,
    });
  }
};


export const companyProblems = async (req, res) => {
  try {
    // First get all unique company names from all problems
    const allCompanies = await Problem.aggregate([
      { $unwind: "$companies" }, // Split company arrays into separate documents
      { $group: { _id: "$companies" } }, // Group by company name
      { $sort: { _id: 1 } } // Sort alphabetically
    ]);

    // Then count problems for each company
    const companyCounts = await Problem.aggregate([
      { $unwind: "$companies" }, // Split company arrays
      {
        $group: {
          _id: "$companies", // Group by company name
          problemCount: { $sum: 1 } // Count problems
        }
      },
      {
        $project: {
          _id: 0,
          company: "$_id", // Rename _id to company
          problemCount: 1
        }
      },
      { $sort: { problemCount: -1 } } // Sort by count descending
    ]);

    return res.status(200).json({
      success: true,
      message: "DSA problem counts for all companies fetched",
      data: companyCounts,
      totalUniqueCompanies: companyCounts.length
    });

  } catch (err) {
    console.error("Company count fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company counts",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};





export const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId });

    if (ans.length == 0) {
      return res.status(200).json({
        success: true,
        data: "No Submission is persent",
      });
    }

    return res.status(200).json({
      success: true,
      message: "fetch submmission successfully",
      data: ans
    });

  }catch (err) {
    return res.status(500).json({
      success: false,
      message: "companies count fetch error: " + err,
    });
  }
}


/*


{
  source_code: 'import java.util.*;\n' +
    'public clss Main {\n' +
    '    public static int add(int a, int b) {\n' +
    '        return a + b;\n' +
    '    }\n' +
    '    public static void main(String[] args) {\n' +
    '        if (add(2, 3) != 5) {\n' +
    '    System.out.println("0");\n' +
    '}\n' +
    '        if (add(100, 200) != 300) {\n' +
    '    System.out.println("1");\n' +
    '}\n' +
    '    }\n' +
    '}\n',
  language_id: 62,
  stdin: '',
  expected_output: null,
  stdout: null,
  status_id: 6,
  created_at: '2025-07-17T07:48:10.220Z',
  finished_at: '2025-07-17T07:48:10.817Z',
  time: null,
  memory: null,
  stderr: null,
  token: 'c8e5b92c-e548-4047-819d-bae77b0ac3e6',
  number_of_runs: 1,
  cpu_time_limit: '5.0',
  cpu_extra_time: '1.0',
  wall_time_limit: '10.0',
  memory_limit: 256000,
  stack_limit: 64000,
  max_processes_and_or_threads: 128,
  enable_per_process_and_thread_time_limit: false,
  enable_per_process_and_thread_memory_limit: false,
  max_file_size: 5120,
  compile_output: 'Main.java:2: error: class, interface, or enum expected\n' +
    'public clss Main {\n' +
    '       ^\n' +
    'Main.java:3: error: class, interface, or enum expected\n' +
    '    public static int add(int a, int b) {\n' +
    '                  ^\n' +
    'Main.java:5: error: class, interface, or enum expected\n' +
    '    }\n' +
    '    ^\n' +
    'Main.java:6: error: class, interface, or enum expected\n' +
    '    public static void main(String[] args) {\n' +
    '                  ^\n' +
    'Main.java:9: error: class, interface, or enum expected\n' +
    '}\n' +
    '^\n' +
    'Main.java:12: error: class, interface, or enum expected\n' +
    '}\n' +
    '^\n' +
    '6 errors\n',
  exit_code: null,
  exit_signal: null,
  message: null,
  wall_time: null,
  compiler_options: null,
  command_line_arguments: null,
  redirect_stderr_to_stdout: false,
  callback_url: null,
  additional_files: null,
  enable_network: false,
  post_execution_filesystem: null,
  status: { id: 6, description: 'Compilation Error' },
  language: { id: 62, name: 'Java (OpenJDK 13.0.1)' }
}
*/
