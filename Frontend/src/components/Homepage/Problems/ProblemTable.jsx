import { NavLink } from 'react-router';

export default function ProblemTable({ problems, solvedProblems, getDifficultyBadgeColor }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#2a2a2a]">
      <table className="min-w-full divide-y divide-[#2a2a2a]">
        <thead className="bg-[#1e1e1e]">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Difficulty
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#121212] divide-y divide-[#2a2a2a]">
          {problems.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                No problems found
              </td>
            </tr>
          ) : (
            problems.map((problem) => (
              <tr key={problem._id} className="hover:bg-[#1e1e1e]">
                <td className="px-6 py-4 whitespace-nowrap">
                  {solvedProblems.some((sp) => sp._id === problem._id) ? (
                    <span className="text-green-500">✔</span>
                  ) : (
                    <span className="text-gray-500">◯</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {problem.problemNumber}. {problem.title}
                  </NavLink>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${getDifficultyBadgeColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}