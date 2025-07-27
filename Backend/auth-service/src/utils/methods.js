import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const generateOTP = (length = 4) => {
    const digits = "0123456789";
    let otp = '';
    const bytes = crypto.randomBytes(length);

    for(let i = 0; i < length; i++) {
        otp += digits[bytes[i] % digits.length];
    }

    return otp;
}

export const generateMiliSecondExpireTime = (time = 5) => {
    return Date.now() + time * 60 * 1000;
} 

export const generateJWTToken = (playload) => {
  return jwt.sign(playload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXP_HOURS}h` 
  })
}



