import { useEffect, useState } from 'react';
import { axiosProblem } from '../../utils/axiosClient.js';
import { useNavigate, NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosProblem.get('/problem/getproblems');
      setProblems(data.data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosProblem.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#E0E0E0] dark:bg-[#121212] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E0E0E0] dark:bg-[#121212] min-h-screen flex justify-center items-center">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded max-w-md">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#E0E0E0] dark:bg-[#121212] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="bg-[#1e1e1e] py-4 px-6 flex justify-between items-center shadow-sm fixed w-full z-50">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-xl font-semibold text-orange-400">
            CodeClone
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-xs text-white">
                {user.fullName?.charAt(0)}
              </div>
              <span className="text-sm text-white">{user.firstName}</span>
            </div>
          )}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="text-sm px-3 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white mr-6"
            >
              Admin
            </NavLink>
          )}
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-24 pb-12 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-[#E0E0E0]">Delete Problems</h1>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#B0B0B0] dark:border-[#444444] shadow-lg">
          <table className="table w-full">
            <thead className="bg-[#f5f5f5] dark:bg-[#2a2a2a]">
              <tr>
                <th className="w-12 text-center py-4 text-[#444444] dark:text-[#B0B0B0] font-medium">#</th>
                <th className="py-4 text-[#444444] dark:text-[#B0B0B0] font-medium">Problem Title</th>
                <th className="w-32 text-center py-4 text-[#444444] dark:text-[#B0B0B0] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B0B0B0] dark:divide-[#444444]">
              {problems.map((problem, index) => (
                <tr 
                  key={problem._id} 
                  className="bg-white dark:bg-[#1e1e1e] hover:bg-[#f9f9f9] dark:hover:bg-[#2a2a2a] transition-colors duration-150"
                >
                  <td className="text-center py-4 font-medium dark:text-[#E0E0E0]">
                    {index + 1}
                  </td>
                  <td className="py-4 px-2 sm:px-4">
                    <div className="flex flex-col">
                      <span className="font-medium dark:text-[#E0E0E0]">
                        {problem.problemNumber}. {problem.title}
                      </span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          problem.difficulty === 'Easy' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : problem.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {problem.difficulty}
                        </span>
                        {problem.tags && problem.tags.length > 0 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {problem.tags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4">
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="px-3 py-1 rounded-md font-medium transition-colors duration-200
                        bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700
                        border border-transparent hover:border-red-800 dark:hover:border-red-500
                        text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;