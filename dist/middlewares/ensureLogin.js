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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
exports.isAuthenticated = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    const rawToken = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ");
    try {
        jwt.verify(rawToken && rawToken[1], process.env.JWT_PRIVATE_KEY, (error, data) => {
            if (error) {
                res.status(400);
                throw new Error("Invalid token");
            }
            req.user = data;
            // console.log(data.user);
            return next();
        });
        // if (req.user.verified === false) {
        //     return res.status(200).json({
        //         res: "failed",
        //         message: "Your account is not verified, Check your email for verification link.",
        //     })
        // }
    }
    catch (error) {
        if (error) {
            res.status(401);
            throw new Error('Not authorized');
        }
    }
    if (!rawToken) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
}));
