import React, { useState, useEffect } from 'react';
import { axiosAuth } from '../../utils/axiosClient.js';

const CourseDeletePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosAuth.get('/course/getAllCourses');
        setCourses(response.data);
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
      await axiosAuth.delete(`/course/deleteCourse/${selectedCourse._id}`);
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Delete Course</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Course deleted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-gray-600">No courses found.</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg overflow-hidden">
              <h2 className="bg-gray-100 p-3 font-medium">Available Courses</h2>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {courses.map((course) => (
                  <li 
                    key={course._id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${
                      selectedCourse?._id === course._id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectCourse(course)}
                  >
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{course.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            {selectedCourse && (
              <div className="border rounded-lg overflow-hidden">
                <h2 className="bg-gray-100 p-3 font-medium">Course Details</h2>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedCourse.title}</h3>
                    <p className="text-gray-600 mt-1">{selectedCourse.description}</p>
                  </div>

                  {selectedCourse.contentList?.length > 0 && (
                    <div>
                      <h4 className="font-medium">Content:</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {selectedCourse.contentList.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCourse.youtubePlaylistUrl && (
                    <div>
                      <h4 className="font-medium">YouTube Playlist:</h4>
                      <a
                        href={selectedCourse.youtubePlaylistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {selectedCourse.youtubePlaylistUrl}
                      </a>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className={`px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
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
  );
};

export default CourseDeletePage;