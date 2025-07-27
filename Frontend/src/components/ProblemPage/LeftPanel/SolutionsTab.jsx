export default function SolutionsTab({ problem }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white text-gray-800">Solutions</h2>
      <div className="space-y-6">
        {problem.referenceSolution?.length > 0 ? (
          problem.referenceSolution.map((solution, index) => (
            <div 
              key={index} 
              className="border dark:border-gray-700 border-gray-200 rounded-lg shadow-sm dark:shadow-none"
            >
              <div className="dark:bg-[#2a2a2a] bg-gray-100 px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold dark:text-orange-400 text-orange-500">
                  {solution.language} Solution
                </h3>
              </div>
              <div className="p-4">
                <pre className="dark:bg-[#1e1e1e] bg-gray-50 p-4 rounded text-sm overflow-x-auto">
                  <code className="dark:text-gray-300 text-gray-800 font-mono">
                    {solution.completeCode}
                  </code>
                </pre>
              </div>
            </div>
          ))
        ) : (
          <p className="dark:text-gray-400 text-gray-500">
            Solutions will be available after you solve the problem.
          </p>
        )}
      </div>
    </div>
  );
}