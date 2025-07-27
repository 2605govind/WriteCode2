import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import redisClient from '../config/redis.js';

const userMiddleware = async (req, res, next) => {
    try {

        const { token } = req.cookies;

        if (!token) {
            console.log("Token is not persent");
            return res.status(400).json({
                success: false,
                message: "Token is not persent"
            })
        }


        // Redis ke blockList mein persent toh nahi hai
        const IsBlocked = await redisClient.exists(`token:${token}`);

        if (IsBlocked) {
            console.log("Invalid Token");
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
        }


        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const { _id } = payload;

        if (!_id) {
            console.log("Invalid token");
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            })
        }


        const result = await User.findById(_id);

        if (!result) {
            console.log("User Doesn't Exist");
            return res.status(400).json({
                success: false,
                message: "User Doesn't Exist"
            })
        }

        req.result = result;

        next();
    }
    catch (error) {
        console.log("Error at userMiddleware " + error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error
        })
    }

}


export default userMiddleware;
