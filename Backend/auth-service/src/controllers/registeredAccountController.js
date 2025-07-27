

export const getRegisteredUser = async (req, res) => {
    const reply = {
        userName: req.result.userName,
        fullName: req.result.fullName,
        profileImage: req.result.profileImage,
        email: req.result.email,
        role: req.result.role,
    }

    return res.status(200).json({
        success: true,
        message: "Valid User",
        user: reply
    })
}