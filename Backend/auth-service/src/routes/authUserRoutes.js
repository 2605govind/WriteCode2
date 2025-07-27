import express from 'express'
import {registerWithEmail, varifyEmailOTP, loginWithEmail, authGoogle, authGithub, forgotPassword, resetPassword , logout } from '../controllers/authUserController.js'
import userMiddleware from '../middlerware/userMiddleware.js'
const authRoutes = express.Router();

// register
// 1. using email + varification OTP
authRoutes.post('/register/email', registerWithEmail)
authRoutes.post('/register/email/otp-verification', varifyEmailOTP)
authRoutes.post('/email/login', loginWithEmail)

// {fullname, email, password} generate otp , 10 minites valid 


// 2. google varification
authRoutes.post('/google', authGoogle);

// 3. github varification
authRoutes.post('/github', authGithub)


authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/reset-password', resetPassword)


authRoutes.post('/logout', userMiddleware, logout)



export default authRoutes;