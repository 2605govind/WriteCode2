export default function TestCaseTab({ runResult }) {
  console.log("runResult", runResult)
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Test Results</h3>
      
      {runResult ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className={`p-4 rounded-lg ${runResult.success ? 
            'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' : 
            'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}
          >
            <div className="flex items-start gap-3">
              {runResult.success ? (
                <div className="text-green-500 dark:text-green-400 text-2xl mt-1">✓</div>
              ) : (
                <div className="text-red-500 dark:text-red-400 text-2xl mt-1">✗</div>
              )}
              <div>
                <h4 className={`font-bold ${runResult.success ? 
                  'text-green-800 dark:text-green-200' : 
                  'text-red-800 dark:text-red-200'}`}
                >
                  {runResult.message || (runResult.success ? 'All Test Cases Passed!' : 'Test Cases Failed')}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                  <span className={`${runResult.success ? 
                    'text-green-600 dark:text-green-300' : 
                    'text-red-600 dark:text-red-300'}`}
                  >
                    Average Runtime: {runResult.averageRuntime || '0'} sec
                  </span>
                  <span className={`${runResult.success ? 
                    'text-green-600 dark:text-green-300' : 
                    'text-red-600 dark:text-red-300'}`}
                  >
                    Max Memory: {runResult.maxMemory || '0'} KB
                  </span>
                  <span className={`${runResult.success ? 
                    'text-green-600 dark:text-green-300' : 
                    'text-red-600 dark:text-red-300'}`}
                  >
                    Passed: {runResult.testCasesPassed}/{runResult.totalTestCases}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases List */}
          <div className="space-y-4">
            {runResult.detailedResults?.map((testCase, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${testCase.status === 'Accepted' ? 
                  'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10' : 
                  'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Test Case #{testCase.testCaseNumber}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${testCase.status === 'Accepted' ? 
                    'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'}`}
                  >
                    {testCase.status || (testCase.error ? 'Failed' : 'Unknown')}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300">Input</h5>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono whitespace-pre-wrap break-all text-sm">
                      {testCase.input || <span className="text-gray-400 dark:text-gray-500">No input</span>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300">Expected Output</h5>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono whitespace-pre-wrap break-all text-sm">
                      {testCase.expectedOutput || <span className="text-gray-400 dark:text-gray-500">No expected output</span>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300">Your Output</h5>
                    <div className={`p-3 rounded font-mono whitespace-pre-wrap break-all text-sm ${testCase.status === 'Accepted' ? 
                      'bg-green-100 dark:bg-green-800/20' : 
                      'bg-red-100 dark:bg-red-800/20'}`}
                    >
                      {testCase.actualOutput || <span className="text-gray-400 dark:text-gray-500">No output</span>}
                    </div>
                  </div>
                  
                  {testCase.error && (
                    <div className="space-y-2 col-span-full">
                      <h5 className="font-semibold text-gray-700 dark:text-gray-300">Error</h5>
                      <div className="p-3 bg-red-100 dark:bg-red-800/20 rounded font-mono text-red-800 dark:text-red-200 whitespace-pre-wrap break-all text-sm">
                        {testCase.error}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Runtime: {testCase.time || '0'} sec</span>
                    <span>Memory: {testCase.memory || '0'} KB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">No Test Results Yet</p>
          <p className="text-sm mt-1 text-center max-w-md">
            Click "Run Code" to execute your solution against the test cases
          </p>
        </div>
      )}
    </div>
  );
}