export default function ResultTab({ submitResult }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto text-gray-900 dark:text-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-orange-400">Submission Result</h3>
      
      {submitResult ? (
        <div className={`rounded-lg p-4 mb-4 ${
          submitResult.accepted 
            ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700'
            : 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700'
        }`}>
          <div className="space-y-3">
            {submitResult.accepted ? (
              <>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-bold text-lg">Accepted</h4>
                </div>
                <div className="ml-8 space-y-1 text-sm">
                  <p className="flex justify-between max-w-xs">
                    <span className="text-gray-600 dark:text-gray-300">Test Cases:</span>
                    <span className="font-medium">
                      {submitResult.passedTestCases}/{submitResult.totalTestCases} passed
                    </span>
                  </p>
                  <p className="flex justify-between max-w-xs">
                    <span className="text-gray-600 dark:text-gray-300">Runtime:</span>
                    <span className="font-medium">{submitResult.runtime} ms</span>
                  </p>
                  <p className="flex justify-between max-w-xs">
                    <span className="text-gray-600 dark:text-gray-300">Memory:</span>
                    <span className="font-medium">{submitResult.memory} MB</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-bold text-lg">{submitResult.error || 'Submission Failed'}</h4>
                </div>
                <div className="ml-8 space-y-1 text-sm">
                  <p className="flex justify-between max-w-xs">
                    <span className="text-gray-600 dark:text-gray-300">Test Cases:</span>
                    <span className="font-medium">
                      {submitResult.passedTestCases}/{submitResult.totalTestCases} passed
                    </span>
                  </p>
                  {submitResult.runtime && (
                    <p className="flex justify-between max-w-xs">
                      <span className="text-gray-600 dark:text-gray-300">Runtime:</span>
                      <span className="font-medium">{submitResult.runtime} ms</span>
                    </p>
                  )}
                  {submitResult.memory && (
                    <p className="flex justify-between max-w-xs">
                      <span className="text-gray-600 dark:text-gray-300">Memory:</span>
                      <span className="font-medium">{submitResult.memory} MB</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2">Submit your solution to view results</p>
        </div>
      )}

      {/* Additional details section */}
      {submitResult?.details && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Details</h4>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono whitespace-pre-wrap">
            {submitResult.details}
          </div>
        </div>
      )}
    </div>
  );
}