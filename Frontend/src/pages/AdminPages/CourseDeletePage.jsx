import React, { useState, useEffect } from 'react';
import { axiosAuth } from '../../utils/axiosClient.js';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';

const CourseDeletePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosAuth.get('/course/getCourses');
        // console.log("cousre",response.data)
        setCourses(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [success]);

  const handleDelete = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      await axiosAuth.delete(`/course/deletecourse/${selectedCourse._id}`);
      setSuccess(true);
      setSelectedCourse(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setError(null);
  };

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
      <div className="container mx-auto pt-24 pb-12 px-6">
        <h1 className="text-3xl font-bold mb-6 text-[#121212] dark:text-[#E0E0E0]">Delete Course</h1>

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900 dark:border-green-700 dark:text-green-100">
            Course deleted successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <p className="text-[#444444] dark:text-[#B0B0B0]">No courses found.</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-lg border border-[#B0B0B0] dark:border-[#444444] overflow-hidden">
                <h2 className="bg-[#f5f5f5] dark:bg-[#2a2a2a] p-3 font-medium text-[#121212] dark:text-[#E0E0E0]">Available Courses</h2>
                <ul className="divide-y divide-[#B0B0B0] dark:divide-[#444444] max-h-[500px] overflow-y-auto">
                  {courses?.map((course) => (
                    <li 
                      key={course._id}
                      className={`p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] cursor-pointer ${
                        selectedCourse?._id === course._id ? 'bg-[#e6f7ff] dark:bg-[#1a3a4a]' : ''
                      }`}
                      onClick={() => handleSelectCourse(course)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-[#121212] dark:text-[#E0E0E0]">{course.title}</h3>
                          <p className="text-sm text-[#444444] dark:text-[#B0B0B0]">
                            {course.description.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </p>
                        </div>
                        <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full">
                          {course.videoCount} videos
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedCourse && (
                <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-lg border border-[#B0B0B0] dark:border-[#444444] overflow-hidden">
                  <h2 className="bg-[#f5f5f5] dark:bg-[#2a2a2a] p-3 font-medium text-[#121212] dark:text-[#E0E0E0]">Course Details</h2>
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-[#121212] dark:text-[#E0E0E0]">{selectedCourse.title}</h3>
                      <p className="text-[#444444] dark:text-[#B0B0B0] mt-1">{selectedCourse.description}</p>
                    </div>

                    {selectedCourse.contentList?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-[#121212] dark:text-[#E0E0E0]">Content:</h4>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-[#444444] dark:text-[#B0B0B0]">
                          {selectedCourse.contentList.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedCourse.youtubePlaylistUrl && (
                      <div>
                        <h4 className="font-medium text-[#121212] dark:text-[#E0E0E0]">YouTube Playlist:</h4>
                        <a
                          href={selectedCourse.youtubePlaylistUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          {selectedCourse.youtubePlaylistUrl}
                        </a>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className={`px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300 ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Deleting...' : 'Delete Course'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDeletePage;