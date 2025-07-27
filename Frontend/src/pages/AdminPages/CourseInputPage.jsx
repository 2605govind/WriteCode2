import React, { useState } from 'react';
import { axiosAuth } from '../../utils/axiosClient.js';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';

const CourseInputPage = () => {
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    contentList: '',
    youtubePlaylistUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Format contentList into an array
      const contentArray = courseData.contentList
        .split('\n')
        .filter(item => item.trim() !== '');

      // Prepare the data for API
      const payload = {
        courseName: courseData.name,
        courseDescription: courseData.description,
        contentList: contentArray,
        youtubePlaylistUrl: courseData.youtubePlaylistUrl
      };

      // Make API call
      const response = await axiosAuth.post('/course/uploadCourse', payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });


      setSuccess(true);
      
      setCourseData({
        name: '',
        description: '',
        contentList: '',
        youtubePlaylistUrl: ''
      });

    } catch (err) {
      console.error('Error submitting course:', err);
      setError(err.response?.data?.message || 'Failed to submit course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-lg shadow-lg border border-[#B0B0B0] dark:border-[#444444]">
          <h1 className="text-2xl font-bold mb-6 text-[#121212] dark:text-[#E0E0E0]">Create New Course</h1>
          
          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100 rounded">
              Course created successfully!
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-[#444444] dark:text-[#B0B0B0] mb-1">
                Course Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={courseData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#121212] dark:text-[#E0E0E0]"
                placeholder="Enter course name"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-[#444444] dark:text-[#B0B0B0] mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#121212] dark:text-[#E0E0E0]"
                placeholder="Enter course description"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="contentList" className="block text-sm font-medium text-[#444444] dark:text-[#B0B0B0] mb-1">
                Content List (one item per line)*
              </label>
              <textarea
                id="contentList"
                name="contentList"
                value={courseData.contentList}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#121212] dark:text-[#E0E0E0]"
                placeholder="Enter course content, one item per line"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="youtubePlaylistUrl" className="block text-sm font-medium text-[#444444] dark:text-[#B0B0B0] mb-1">
                YouTube Playlist URL*
              </label>
              <input
                type="url"
                id="youtubePlaylistUrl"
                name="youtubePlaylistUrl"
                value={courseData.youtubePlaylistUrl}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#121212] dark:text-[#E0E0E0]"
                placeholder="https://www.youtube.com/playlist?list=..."
              />
              <p className="mt-1 text-xs text-[#444444] dark:text-[#B0B0B0]">
                Paste the full URL of your YouTube playlist (e.g., https://www.youtube.com/playlist?list=PL...)
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Create Course'}
              </button>
            </div>
          </form>
          
          {/* Preview Section */}
          {courseData.name && (
            <div className="mt-8 p-4 border border-[#B0B0B0] dark:border-[#444444] rounded-lg bg-[#f5f5f5] dark:bg-[#2a2a2a]">
              <h2 className="text-lg font-semibold mb-2 text-[#121212] dark:text-[#E0E0E0]">Course Preview</h2>
              <h3 className="text-xl font-medium text-[#121212] dark:text-[#E0E0E0]">{courseData.name}</h3>
              <p className="text-[#444444] dark:text-[#B0B0B0] mt-1">{courseData.description}</p>
              
              {courseData.contentList && (
                <div className="mt-3">
                  <h4 className="font-medium text-[#121212] dark:text-[#E0E0E0]">Course Content:</h4>
                  <ul className="list-disc pl-5 mt-1 text-[#444444] dark:text-[#B0B0B0]">
                    {courseData.contentList.split('\n').map((item, index) => (
                      item.trim() && <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {courseData.youtubePlaylistUrl && (
                <div className="mt-3">
                  <h4 className="font-medium text-[#121212] dark:text-[#E0E0E0]">YouTube Playlist:</h4>
                  <a 
                    href={courseData.youtubePlaylistUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {courseData.youtubePlaylistUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseInputPage;