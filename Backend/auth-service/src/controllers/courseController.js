import Course from '../models/course.model.js';
import youtube from '../config/youtubeConfig.js'

const extractPlaylistId = (url) => {
  const regex = /[&?]list=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const fetchYouTubePlaylistItems = async (playlistId) => {
  try {
    let allItems = [];
    let nextPageToken = null;

    do {
      const response = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken || undefined
      });

      allItems = [...allItems, ...response.data.items];
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allItems;
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    throw new Error('Failed to fetch YouTube playlist');
  }
};

export const uploadCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, contentList, youtubePlaylistUrl } = req.body;

    // Validate input
    if (!courseName || !youtubePlaylistUrl) {
      return res.status(400).json({
        success: false,
        message: 'Course name and YouTube playlist URL are required'
      });
    }

    const playlistId = extractPlaylistId(youtubePlaylistUrl);
    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube playlist URL'
      });
    }

    const playlistItems = await fetchYouTubePlaylistItems(playlistId);

    const materials = playlistItems.map(item => ({
      title: item.snippet.title,
      videoLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    }));

    // Create new course
    const newCourse = new Course({
      title: courseName,
      description: courseDescription || '',
      contentList: Array.isArray(contentList) ? contentList : [],
      materials: materials
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        courseId: savedCourse._id,
        title: savedCourse.title,
        videoCount: savedCourse.materials.length
      }
    });

  } catch (error) {
    console.error('Error in uploadCourse:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create course',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    const reply = courses.map((course) => {
        return {
            _id: course._id,
            title: course.title,
            description: course.description,
            videoCount: course.materials.length,
        }
    })
    
    return res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: reply,
      count: courses.length
    });

  } catch (error) {
    console.error('Error in getCourses:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch courses',
    });
  }
};

// Get single course
export const getCourse = async (req, res) => {
  try {

    // console.log("req.params.id", req.params.id);
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course,
      videoCount: course.materials.length
    });

  } catch (error) {
    console.error('Error in getCourse:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch course',
    });
  }
};


// Delete course
export const deleteCourse = async (req, res) => {
  try {
    // console.log("req.params.id", req.params.id);
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        courseId: course._id,
        title: course.title
      }
    });

  } catch (error) {
    console.error('Error in deleteCourse:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete course',
    });
  }
};