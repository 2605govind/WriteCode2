import User from '../models/user.model.js'
import { generateJWTToken, generateMiliSecondExpireTime, generateOTP } from '../utils/methods.js';
import Notvarifyuser from '../models/notvarifieduser.model.js'
import bcrypt from 'bcrypt'
import googleclient from '../config/googleClient.js'
import axios from 'axios';
import crypto from 'crypto';
import { sendPasswordResetLink, sendEmailOTP } from '../utils/emailSender.js';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';


export const authGoogle = async (req, res) => {
    // console cloud google
    try {
        const { code } = req.body;

        // Exchange code for tokens
        const { tokens } = await googleclient.getToken(code);

        // Now verify the ID token
        const ticket = await googleclient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const parts = payload.email.split("@");
        const userinfo = {
            userName: parts[0],
            fullName: payload.name,
            email: payload.email,
            password: '',
            isVerified: true,
            profileImage: payload.picture,
        }


        let user = await User.findOne({ email: payload.email });

        // Now create user if not in database
        if (!user) {
            user = await User.create(userinfo);
        }



        // generate JWT Token and Store
        const token = generateJWTToken({ _id: user._id });
        res.cookie("token", token, {
            httpOnly: true,          // JS can't access cookie
            secure: true,            // Only sent over HTTPS
            maxAge: process.env.JWT_EXP_HOURS * 1000 * 60 * 60,  // In hour
            sameSite: "strict"       // Prevent CSRF
        });


        const reply = {
            userName: user.userName,
            fullName: user.fullName,
            profileImage: user.profileImage,
            email: user.email,
            role: user.role,
        }


        return res.status(200).json({
            success: true,
            message: "Successfully google login",
            user: reply
        })

    } catch (error) {
        console.log("Error at authGoogle ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error " + error
        })
    }
}

export const authGithub = async (req, res) => {
    try {
        const { code } = req.body;

        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: process.env.GITHUB_REDIRECT_URI
            },
            {
                headers: { Accept: 'application/json' }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Get user info
        const [userResponse, emailResponse] = await Promise.all([
            axios.get('https://api.github.com/user', {
                headers: { Authorization: `token ${accessToken}` }
            }),
            axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `token ${accessToken}` }
            })
        ]);

        const primaryEmail = emailResponse.data.find(email => email.primary)?.email;

        if (!userResponse.data || !primaryEmail) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const userinfo = {
            userName: userResponse.data.login,
            fullName: userResponse.data.name || userResponse.data.login,
            email: primaryEmail,
            password: '',
            isVerified: true,
            profileImage: userResponse.data.avatar_url,
        };

        let user = await User.findOne({ email: primaryEmail });

        // Create user if not in database
        if (!user) {
            user = await User.create(userinfo);
        }

        // Generate JWT Token and Store
        const token = generateJWTToken({ _id: user._id });
        res.cookie("token", token, {
            httpOnly: true,          // JS can't access cookie
            secure: true,            // Only sent over HTTPS
            maxAge: process.env.JWT_EXP_HOURS * 1000 * 60 * 60,  // In hour
            sameSite: "strict"       // Prevent CSRF
        });


        const reply = {
            userName: user.userName,
            fullName: user.fullName,
            profileImage: user.profileImage,
            email: user.email,
            role: user.role,
        }

        return res.status(200).json({
            success: true,
            message: "Successfully logged in with GitHub",
            user: reply
        });

    } catch (error) {
        console.log("Error at githubAuth ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error " + error.message
        });
    }
};

export const registerWithEmail = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }


        // check already is present or not
        const existUser = await User.findOne({ email });


        if (existUser) {
            // console.log("user");
            return res.status(400).json({
                success: false,
                message: "Email is already userd."
            })
        }


        const notVerifyUserAllEntries = await Notvarifyuser.find({ email }).sort({ createdAt: -1 });

        const tenMinutesInMs = 1000 * 60 * 10;

        if (notVerifyUserAllEntries.length > 3) {
            // console.log(Date.now() - notVerifyUserAllEntries[0].createdAt, tenMinutesInMs)
    
            if(notVerifyUserAllEntries[0].createdAt + tenMinutesInMs > Date.now()) {
                // console.log("yess i am ")
                return res.status(429).json({
                    success: false,
                    message: "Too many registration attempts: Please try again after 10 minutes."
                })
            }

            // delete
            // delete all Not verify user
            await Notvarifyuser.deleteMany({ email });
        }

        // generate OTP

        const user = {
            fullName,
            email,
            password: await bcrypt.hash(password, 10),
            otp: generateOTP(),
            optExpires: generateMiliSecondExpireTime(process.env.OTPEXPIRESTIME),
        }

        sendEmailOTP(user.otp, email);

        // create tempuser with OTP
        await Notvarifyuser.create(user);

        // console.log(user);

        return res.status(200).json({
            success: true,
            user: { email },
            message: "Successfully registered with email. Now verify using the OTP sent to your inbox"
        })


    } catch (error) {
        console.log("Error at registerWithEmail ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error " + error
        })

    }
}

export const varifyEmailOTP = async (req, res) => {
    try {

        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        // check already is present or not
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already userd."
            })
        }

        const notVerifyUserAllEntries = await Notvarifyuser.find({ email }).select("+password").sort({ createdAt: -1 });

        if (notVerifyUserAllEntries.length == 0) {
            return res.status(400).json({
                success: false,
                message: "No unverified user found with this email address."
            })
        }

        const currentTime = Date.now();
        const optExpiresTime = new Date(notVerifyUserAllEntries[0]?.optExpires).getTime();


        if (currentTime > optExpiresTime) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            })
        }

        if (otp !== notVerifyUserAllEntries[0].otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is wrong"
            })
        }

        const parts = email.split("@")
        const user = {
            userName: parts[0],
            fullName: notVerifyUserAllEntries[0].fullName,
            email: email,
            password: notVerifyUserAllEntries[0].password,
            isVerified: true
        }

        const verifyedUser = await User.create(user);


        // delete all Not verify user
        await Notvarifyuser.deleteMany({ email });

        // generate JWT Token and Store
        const token = generateJWTToken({ _id: verifyedUser._id });

        res.cookie("token", token, {
            httpOnly: true,          // JS can't access cookie
            secure: true,            // Only sent over HTTPS
            maxAge: process.env.JWT_EXP_HOURS * 1000 * 60 * 60,  // In hour
            sameSite: "strict"       // Prevent CSRF
        });

        const reply = {
            userName: verifyedUser.userName,
            fullName: verifyedUser.fullName,
            profileImage: verifyedUser.profileImage,
            email: verifyedUser.email,
            role: verifyedUser.role,

        }

        return res.status(200).json({
            success: true,
            message: "Successfully Verifyed Email",
            user: reply
        })

    } catch (error) {
        console.log("Error at varifyEmailOTP ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error " + error
        })
    }
}

export const loginWithEmail = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || (!req.body?.email && !req.body?.userName)) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        let user;
        if (req.body?.email) {
            user = await User.findOne({ email: req.body?.email }).select('+password');

        } else {
            user = await User.findOne({ userName: req.body?.userName }).select('+password');
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not present."
            })
        }

        // verify password
        const isPawwordCorrect = await bcrypt.compare(password, user.password);

        if (!isPawwordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credential"
            });
        }

        const token = generateJWTToken({ _id: user._id });

        res.cookie("token", token, {
            httpOnly: true,          // JS can't access cookie
            secure: true,            // Only sent over HTTPS
            maxAge: process.env.JWT_EXP_HOURS * 1000 * 60 * 60,  // In hour
            sameSite: "strict"       // Prevent CSRF
        });


        const reply = {
            userName: user.userName,
            fullName: user.fullName,
            profileImage: user.profileImage,
            email: user.email,
            role: user.role,

        }


        res.status(200).json({
            success: true,
            message: "Successfully login",
            user: reply,
        })

    } catch (error) {
        console.log("Error at loginWithEmail ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error " + error
        })
    }
}


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "If this email exists, a reset link has been sent"
            });
        }

        // 2. Generate reset token and set expiry (1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // 3. Save token to user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // 4. Create reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

        // 5. Send email
        await sendPasswordResetLink(resetLink, email);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.log("Error at forgotPassword ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error " + error.message
        });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, userId, newPassword } = req.body;

        // 1. Find user by ID
        const user = await User.findOne({
            _id: userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });


        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // 2. Update password and clear token
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.log("Error at resetPassword ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error.message
        });
    }
}


export const logout = async (req, res) => {

    try {
        console.log("logdout")

        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, { expires: new Date(Date.now()) });

        return res.status(200).json({
            success: true,
            message: "Logged Out Succesfully"
        });
    }
    catch (err) {
        return res.status(503).json({
            success: false,
            message: "login faild: error " + err,
        });
    }
}