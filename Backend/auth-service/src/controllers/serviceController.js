import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import redisClient from '../config/redis.js';


export const checkAdmin = async (req, res) => {
    try {
        const { token } = req.body;

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
            console.log("Admin Doesn't Exist");
            return res.status(400).json({
                success: false,
                message: "Admin Doesn't Exist"
            })
        }


        if(result.role != 'admin') {
            console.log("Not Admin");
            return res.status(401).json({
                success: false,
                message: "Not Admin"
            })
        }
            

        return res.status(200).json({
            success: true,
            message: "successfull verify",
            result: result
        })
    }
    catch (error) {
        console.log("Error at checkAdmin " + error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error
        })
    }

}


export const checkuser = async (req, res) => {
    try {
        const { token } = req.body;

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

        return res.status(200).json({
            success: true,
            message: "successfull verify",
            result: result
        })
    }
    catch (error) {
        console.log("Error at checkuser " + error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error
        })
    }

}

export const updateUserInfo = async (req, res) => {
    try {
        const { _id, ...rest } = req.body;

        // console.log(_id, rest);

        if (!_id) {
            console.log("_id is not present");
            return res.status(400).json({
                success: false,
                message: "_id is not present"
            });
        }

        const result = await User.findById(_id);

        if (!result) {
            console.log("User Doesn't Exist");
            return res.status(400).json({
                success: false,
                message: "User Doesn't Exist"
            });
        }

        Object.assign(result, rest);
        await result.save();

        return res.status(200).json({
            success: true,
            message: "Successfully updated",
            result: result
        });

    } catch (error) {
        console.log("Error at updateUserInfo: " + error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error.message
        });
    }
}
