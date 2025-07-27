import { getDifficultyColor } from '../helpers';

export default function DescriptionTab({ problem }) {
  return (
    <div className="p-6 text-gray-300 bg-[#1e1e1e] scrollbar-hide"> {/* Added scrollbar-hide */}
      {/* Problem header with number */}
      <div className="mb-2">
        <span className="text-sm text-gray-400">Problem {problem.problemNumber}</span>
      </div>

      {/* Title and difficulty */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty?.charAt(0)?.toUpperCase() + problem.difficulty?.slice(1)}
        </span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-sm text-gray-400">Tags:</span>
        <div className="flex flex-wrap gap-2">
          {problem.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-[#2a2a2a] rounded text-xs text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Problem description - Added scrollbar-hide to prose container */}
      <div className="prose prose-invert max-w-none mb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {problem.description}
        </div>
      </div>

      {/* Examples section - Added scrollbar-hide to container */}
      <div className="mt-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <h3 className="text-lg font-semibold mb-4 text-white">Examples</h3>
        <div className="space-y-4">
          {problem?.visibleTestCases?.map((example, index) => (
            <div key={index} className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700">
              <h4 className="font-semibold mb-2 text-orange-400">Example {index + 1}:</h4>
              <div className="space-y-3 text-sm font-mono">
                <div>
                  <strong className="text-gray-400">Input:</strong> 
                  <div className="mt-1 p-2 bg-[#1e1e1e] rounded text-gray-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {example.input}
                  </div>
                </div>
                <div>
                  <strong className="text-gray-400">Output:</strong>
                  <div className="mt-1 p-2 bg-[#1e1e1e] rounded text-gray-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {example.output}
                  </div>
                </div>
                {example.explanation && (
                  <div>
                    <strong className="text-gray-400">Explanation:</strong>
                    <div className="mt-1 p-2 bg-[#1e1e1e] rounded text-gray-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {example.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Companies section - Added scrollbar-hide */}
      {problem.companies?.length > 0 && (
        <div className="mt-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <h3 className="text-lg font-semibold mb-4 text-white">Asked By</h3>
          <div className="flex flex-wrap gap-2">
            {problem.companies?.map((company, index) => (
              <span key={index} className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm text-orange-400 border border-orange-400/30">
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Constraints section - Added scrollbar-hide */}
      {problem.constraints && (
        <div className="mt-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <h3 className="text-lg font-semibold mb-4 text-white">Constraints</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm bg-[#2a2a2a] p-4 rounded-lg border border-gray-700">
            {problem.constraints.split('\n').map((constraint, i) => (
              <li key={i} className="font-mono">{constraint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}