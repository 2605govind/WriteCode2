import express from 'express'
import { checkAdmin, checkuser, updateUserInfo } from '../controllers/serviceController.js';

const serviceRoutes = express.Router();


serviceRoutes.post('/checkadmin', checkAdmin)
serviceRoutes.post('/checkuser', checkuser)
serviceRoutes.post('/updateuserinfo', updateUserInfo)


export default serviceRoutes;

