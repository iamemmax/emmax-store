"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (res, userId) => {
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
    const token = jsonwebtoken_1.default.sign({ userId }, String(process.env.JWT_PRIVATE_KEY), {
        expiresIn: '1d',
    });
    res.cookie('eAuth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000, // 30 days
    });
};
exports.default = generateToken;
