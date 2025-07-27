import express from 'express'
import {getRegisteredUser} from '../controllers/registeredAccountController.js'
import userMiddleware from '../middlerware/userMiddleware.js';

const registeredAccountRoutes = express.Router();


registeredAccountRoutes.get('/check', userMiddleware ,getRegisteredUser)


export default registeredAccountRoutes;