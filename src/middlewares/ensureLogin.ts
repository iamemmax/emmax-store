const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
import { NextFunction, Request, Response } from "express";
import { JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import userModel, { UserProps, rolesProps } from "../model/users.model";


export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
            const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            req.user = await userModel.findById<UserProps>(decoded.userId).select("-password")

            if (req.user?.verified === false) {
                return res.status(403).json({
                    res: "failed",
                    message: "Your account is not verified, Check your email for verification link.",
                })
            }
            next()

            // console.log(req.user, "user");

        } catch (error) {
            if (error) {
                res.status(401)
                throw new Error('Not authorized, invalid token')

            }
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, no token')

    }
    // if (!rawToken) {
    //     res.status(401)
    //     throw new Error('Not authorized, no token')

    // }
})

export const isAdmin = (roles: any) => asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.user?.userId

    try {
        const users = await userModel.findOne<UserProps>({ userId })

        if (!users?.roles.includes(roles)) {
            return res.status(403).json({
                res: "fail",
                msg: "Access Denied"
            })
        }
        next()
    } catch (error: any) {
        return res.status(504).json({
            res: "fail",
            msg: error.message
        })


    }

})