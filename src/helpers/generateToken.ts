import { Response } from "express";
import Jwt from "jsonwebtoken";

const generateToken = (res: Response, userId: any) => {
    // const token = Jwt.sign({ userId }, String(process.env.JWT_PRIVATE_KEY), {
    //     expiresIn: "1d",
    //     algorithm: "HS256"
    // })
    // console.log('====================================');
    // console.log(res.cookie);
    // console.log('====================================');
    // res.cookie("auth", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV !== "development",
    //     sameSite: "strict",
    //     maxAge: 1 * 24 * 60 * 60 * 1000
    // })

    const token = Jwt.sign({ userId }, String(process.env.JWT_PRIVATE_KEY), {
        expiresIn: '1d',
    });

    res.cookie('eAuth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 1 * 24 * 60 * 60 * 1000, // 30 days
    });

}

export default generateToken