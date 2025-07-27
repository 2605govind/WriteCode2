import express from 'express'
import { uploadCourse, getCourses, getCourse, deleteCourse} from '../controllers/courseController.js';
import userMiddleware from '../middlerware/userMiddleware.js';

const courseRoutes = express.Router();


courseRoutes.post('/uploadCourse', userMiddleware, uploadCourse)
courseRoutes.get('/getCourses',userMiddleware, getCourses)
courseRoutes.get('/getCourse/:id',userMiddleware, getCourse)
courseRoutes.delete('/deletecourse/:id',userMiddleware, deleteCourse)



export default courseRoutes;