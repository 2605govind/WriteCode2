import axios from 'axios'

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


        // API call karuni hai
        axios.post('http://localhost:3001/api/v1/service/checkuser', {
            token: token
        })
            .then((response) => {
                // console.log(response);
                req.result = response.data.result;
                //  console.log("userdetail", response.data.result)
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
        console.log("error at userMiddleware");
        return res.status(400).json({
            success: false,
            message: "Internal Server Error ", error
        })
    }

}


export default userMiddleware;