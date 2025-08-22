import axios from 'axios'
const adminMiddleware = async (req, res, next) => {


    const SERVER_URL = process.env.FRONTEND_URL;
    try {

        const { token } = req.cookies;

        if (!token) {
            console.log("Token is not persent");
            return res.status(400).json({
                success: false,
                message: "Token is not persent"
            })
        }


        // API call karuni hai

        axios.post(`${SERVER_URL}/backend1/api/v1/service/checkadmin`, {
            token: token
        })
            .then((response) => {
                // console.log(response);
                req.result = response.data.result;
                next();
            })
            .catch((error) => {

                console.log("service is not responding");
                return res.status(400).json({
                    success: false,
                    message: "service is not responding and Error ", error
                })
            });
    }
    catch (error) {
        console.log("error at adminMiddleware");
        return res.status(400).json({
            success: false,
            message: "Internal Server Error ", error
        })
    }

}


export default adminMiddleware;