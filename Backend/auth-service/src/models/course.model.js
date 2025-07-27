import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoLink: {
    type: String,
    required: true
  }
}, { _id: true });



const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  contentList: {
    type: [String],
    default: []
  },
  materials: {
    type: [materialSchema],
    default: []
  },
}, { timestamps: true });



const Course = mongoose.model('Course', courseSchema);

export default Course;