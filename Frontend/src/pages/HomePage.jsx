import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { axiosAuth, axiosProblem } from '../utils/axiosClient.js';
import { logoutUser } from '../slice/authSlice.js';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [companyProblems, setCompanyProblems] = useState([]);
  const [courses, setCourses] = useState([
    { id: 1, title: "Data Structures", progress: 75 },
    { id: 2, title: "Algorithms", progress: 50 },
    { id: 3, title: "System Design", progress: 20 },
    { id: 4, title: "Database Design", progress: 10 },
    { id: 5, title: "OOP Concepts", progress: 90 },
  ]);

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tags: [],
    status: 'all',
    search: '',
    companies: []
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchDebounce, setSearchDebounce] = useState('');
  const [tagsData, setTagsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProblems, setTotalProblems] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchCompanyProblems();
    fetchAlltagswithcount();
    fetchCourses();
    fetchProblems(1, true);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch problems when filters change
  useEffect(() => {
    fetchProblems(1, true);
    setPage(1);
  }, [filters.difficulty, filters.tags, filters.status, filters.companies, searchDebounce]);

  const fetchCourses = async () => {
    try {
      const { data } = await axiosAuth.get('/course/getCourses');
      // console.log("data", data);
      setCourses(data.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([
        { id: 1, title: "Data Structures", progress: 75 },
        { id: 2, title: "Algorithms", progress: 50 },
        { id: 3, title: "System Design", progress: 20 },
        { id: 4, title: "Database Design", progress: 10 },
        { id: 5, title: "OOP Concepts", progress: 90 },
      ]);
    }
  };

  const fetchAlltagswithcount = async () => {
    try {
      const { data } = await axiosProblem.get('/problem/getalltagswithcount');
      // console.log("setTagsData data", data);
      setTagsData(data.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setTagsData([
        { name: "Array", count: 1960 },
        { name: "String", count: 1200 },
        { name: "Hash Table", count: 900 },
      ]);
    }
  };

  const fetchCompanyProblems = async () => {
    try {
      const { data } = await axiosProblem.get('/problem/companyproblems');
      setCompanyProblems(data.data);
    } catch (err) {
      console.error('Error fetching company problems:', err);
    }
  };

  const fetchProblems = async (pageNumber = 1, reset = false) => {
    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      let query = `/problem/getproblems?page=${pageNumber}`;

      if (filters.difficulty !== 'all') {
        query += `&difficulty=${filters.difficulty}`;
      }
      if (filters.tags.length > 0) {
        query += `&tags=${filters.tags.join(',')}`;
      }
      if (filters.companies.length > 0) {
        query += `&company=${filters.companies.join(',')}`;
      }
      if (searchDebounce.length > 0) {
        query += `&search=${searchDebounce}`;
      }

      const { data } = await axiosProblem.get(query);

      if (reset) {
        setProblems(data.data || []);
        setTotalProblems(data?.pagination?.total);
      } else {
        setProblems(prev => [...prev, ...data.data]);
      }

      setHasMore(data.pagination.hasNextPage);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      if (reset) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  const handleTagClick = (tagName) => {
    setFilters(prev => {
      if (prev.tags.includes(tagName)) {
        return {
          ...prev,
          tags: prev.tags.filter(tag => tag !== tagName)
        };
      } else {
        return {
          ...prev,
          tags: [...prev.tags, tagName]
        };
      }
    });
  };

  const handleCompanyClick = (companyName) => {
    setFilters(prev => {
      if (prev.companies.includes(companyName)) {
        return {
          ...prev,
          companies: prev.companies.filter(company => company !== companyName)
        };
      } else {
        return {
          ...prev,
          companies: [...prev.companies, companyName]
        };
      }
    });
  };

  const resetTags = () => {
    setFilters(prev => ({
      ...prev,
      tags: []
    }));
  };

  const resetCompanies = () => {
    setFilters(prev => ({
      ...prev,
      companies: []
    }));
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const clearSearch = () => {
    setFilters({ ...filters, search: '' });
    setSearchDebounce('');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const filteredProblems = problems.filter((problem) => {
    if (filters.status === 'solved') {
      return solvedProblems.some((sp) => sp._id === problem._id);
    }
    return true;
  });

  const filterButtonClass = (active) =>
    `text-xs px-3 py-1 rounded-lg transition-all duration-150 ${
      active
        ? 'bg-orange-500 text-white'
        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
    }`;

  const tagButtonClass = (active) =>
    `px-3 py-1 text-xs rounded transition-all duration-150 border ${
      active
        ? 'border-orange-500 bg-[#2a2a2a] text-white'
        : 'border-transparent bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
    }`;

  const companyButtonClass = (active) =>
    `p-2 flex justify-between items-center rounded text-sm w-full text-left border ${
      active
        ? 'border-orange-500 bg-[#2a2a2a] text-white'
        : 'border-transparent bg-[#1e1e1e] text-gray-300 hover:bg-[#2a2a2a]'
    }`;

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100">
      {/* Custom Scrollbar Styling */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        ::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 2px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #4a4a4a;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #3a3a3a #1e1e1e;
        }
      `}</style>

      {/* Navbar */}
      <div className="bg-[#1e1e1e] py-3 px-6 flex justify-between items-center shadow-sm fixed w-full z-50">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-xl font-semibold text-orange-400">
            WriteCode
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-xs text-white">
                {user.fullName.charAt(0)}
              </div>
              <span className="text-sm">{user.firstName}</span>
            </div>
          )}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="text-sm px-3 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a]"
            >
              Admin
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 p-6">
        {/* Courses Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Courses</h2>
          <div className="relative">
            <div className="flex space-x-4 pb-2 overflow-x-auto">
              {courses?.map((course) => (
                <NavLink
                  to={`/coursedetails/${course._id}`}
                  key={course._id}
                >
                  <div
                    className="flex-shrink-0 w-64 h-64 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] p-4 flex flex-col justify-between hover:border-orange-400 transition-colors duration-200"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-3">{course.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{course.videoCount} videos</span>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#121212] to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Combined Tags and Companies Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Tags Section (80% width) */}
          <div className="bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] p-4 md:w-4/5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-300">Tags</h3>
              {filters.tags.length > 0 && (
                <button
                  onClick={resetTags}
                  className="text-xs px-2 py-1 rounded bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {tagsData.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className={tagButtonClass(filters.tags.includes(tag.name))}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          </div>

          {/* Companies Section (20% width) */}
          <div className="bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] p-4 md:w-1/5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-300">Companies</h3>
              {filters.companies.length > 0 && (
                <button
                  onClick={resetCompanies}
                  className="text-xs px-2 py-1 rounded bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {companyProblems?.map((company) => (
                <button
                  key={company.company}
                  onClick={() => handleCompanyClick(company.company)}
                  className={companyButtonClass(filters.companies.includes(company.company))}
                >
                  <span className="truncate">{company.company}</span>
                  <span className="text-xs bg-[#2a2a2a] px-2 py-1 rounded text-gray-300 ml-2">
                    {company.problemCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems Section */}
        <div className="bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] p-6">
          {/* Problems Header with Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Problems</h1>
              <span className="text-sm text-gray-400">({totalProblems})</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="w-full px-4 py-2 rounded-md bg-[#2a2a2a] border border-[#2a2a2a] text-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
                {filters.search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {/* {['all', 'solved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilters({ ...filters, status })}
                    className={filterButtonClass(filters.status === status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))} */}
              </div>
              <div className="flex gap-2">
                {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setFilters({ ...filters, difficulty })}
                    className={filterButtonClass(filters.difficulty === difficulty)}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Problems Table */}
          <div className="overflow-x-auto rounded-lg border border-[#2a2a2a]">
            <table className="min-w-full divide-y divide-[#2a2a2a]">
              <thead className="bg-[#1e1e1e]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    #
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
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      {filters.search || filters.difficulty !== 'all' || filters.tags.length > 0 || filters.status !== 'all' || filters.companies.length > 0
                        ? "No problems match your search criteria"
                        : "No problems found"}
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((problem, index) => (
                    <tr key={problem._id} className="hover:bg-[#2a2a2a]">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {index + 1}
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

          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchProblems(nextPage);
                }}
                className="px-4 py-2 rounded-md bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] transition-colors"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-500"></div>
                    Loading...
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;