"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const users_model_1 = __importDefault(require("../model/users.model"));
exports.isAuthenticated = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const { authorization } = req.headers;
    let token;
    // const rawToken = authorization?.split(" ");
    // jwt.verify(rawToken && rawToken[1], process.env.JWT_PRIVATE_KEY, (error: JsonWebTokenError, data: UserProps) => {
    //     if (error) {
    //         res.status(400)
    //         throw new Error("Invalid token")
    //     }
    //     if (data?.verified === false) {
    //         return res.status(403).json({
    //             res: "failed",
    //             message: "Your account is not verified, Check your email for verification link.",
    //         })
    //     }
    //     //@ts-ignore
    //     req.user = data
    //     return next();
    // });
    //@ts-ignore
    token = req.cookies.eAuth;
    if (token) {
        try {
            const decoded = yield jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            req.user = yield users_model_1.default.findById(decoded.userId).select("-password");
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.verified) === false) {
                return res.status(403).json({
                    res: "failed",
                    message: "Your account is not verified, Check your email for verification link.",
                });
            }
            next();
            // console.log(req.user, "user");
        }
        catch (error) {
            if (error) {
                res.status(401);
                throw new Error('Not authorized, invalid token');
            }
        }
    }
    else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
    // if (!rawToken) {
    //     res.status(401)
    //     throw new Error('Not authorized, no token')
    // }
}));
const isAdmin = (roles) => asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId;
    try {
        const users = yield users_model_1.default.findOne({ userId });
        if (!(users === null || users === void 0 ? void 0 : users.roles.includes(roles))) {
            return res.status(403).json({
                res: "fail",
                msg: "Access Denied"
            });
        }
        next();
    }
    catch (error) {
        return res.status(504).json({
            res: "fail",
            msg: error.message
        });
    }
}));
exports.isAdmin = isAdmin;
