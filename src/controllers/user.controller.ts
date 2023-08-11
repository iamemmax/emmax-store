import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import userModel, { UserProps } from "../model/users.model";
import { authenticateUserTypes, createuserTypes } from '../validations/interface/userTypes';
import bcrypt from "bcrypt"
import AsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../helpers/bcrypt";
import { getUser } from "../service/User.service";
import { v4 as uuidv4 } from "uuid"
import { sendMail } from "../helpers/sendMail";



// @DESC:signup a user
//@METHOD:Post
//@ROUTES:localhost:3001/api/users/create

export const createUser = async (req: Request<{}, {}, createuserTypes>, res: Response) => {
    const { username, email, password } = req.body
    try {
        const userExist = await userModel.findOne({ email })
        const userUsernameExist = await userModel.findOne({ username })
        if (userExist) {
            return res.status(401).json({ res: "fail", msg: "email already exist" })
        }
        if (userUsernameExist) {
            return res.status(404).json({ res: "fail", msg: "username already exist" })
        }
        const genUserId = `userId_${username}${email.slice(0, 5)}${Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000}${password.slice(0, 4)}${password.slice(0, 3)}`
        const { hash } = await hashPassword(password)
        const data: HydratedDocument<UserProps> = await new userModel({
            userId: genUserId, username, email, password: hash, token: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
        }).save()
        if (data) {
            sendMail(
                email,
                "emmax-shop registration",
                `            <html>
                <head>
                <body>
                <h1 style={font-size:24px}>Welcome to king store</h1>
                <p style={color:red, font-size:18px}>Your otp verification code is ${data?.token}</p>
                </body>
                </head>
                </html>
                `
            );
            res.status(201).json({ user: { res: "ok", userId: data?.userId, username, email, msg: "Registration is successful. A verification OTP has been sent to your email." } })
        }
    } catch (error: any) {
        res.status(401);
        throw new Error(error.message);
    }

}

//@DESC:resent otp
//@METHOD:put
//@ROUTES:localhost:3001/api/users/resendotp/userid

export const ResendOtp = async (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params
    try {
        const userExist = await userModel.findOne<UserProps>({ userId })

        if (!userExist) {
            return res.status(401).json({ msg: "user not found" })
        }

        if (userExist.verified === true) {
            return res.status(401).json({ msg: "Account already verified" })
        }

        const updateOtp = await userModel.findOneAndUpdate({ userId }, { $set: { token: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000 } }, { new: true })


        if (updateOtp) {
            sendMail(
                userExist.email,
                "emmax-shop Verification",
                `
                <html>
                <head>
                <body>
                <h1 style={font-size:24px}>Welcome to king store</h1>
                <p style={color:red, font-size:18px}>Your otp verification code is ${updateOtp?.token}</p>
                </body>
                </head>
                </html>
                `
            );
            res.status(201).json({ res: "ok", msg: "A verification OTP has been resent to your email." })
            // console.log(cryptoRandomString({ length: 10, type: "numeric" }));

        }

    } catch (error: any) {
        res.status(401);
        throw new Error(error.message);
    }

}




// @DESC:verify user
//@METHOD:PUT
//@ROUTES:localhost:3001/api/users/verify/:userid
export const verifyUser = AsyncHandler(async (req: Request<{ userId: string }, {}, Pick<createuserTypes, "token">>, res: Response) => {
    const { token } = req.body
    const { userId } = req.params
    try {
        const user = await userModel.findOne<UserProps>({ userId })
        if (!user) {
            res.status(401).json({
                res: "fail",
                msg: "no user found",
            })
        } else {
            if (user?.token === Number(token)) {
                const verifyUser = await userModel.findOneAndUpdate({ userId: userId }, { $set: { verified: true, token: "" } },
                    { new: true })
                if (verifyUser) {
                    res.status(201).json({
                        res: "success",
                        msg: "user verified",
                    })
                }
            } else {
                res.status(402).json({
                    res: "fail",
                    msg: "Incorrect or expired token",
                })
            }
        }
    } catch (error: any) {
        res.status(500);
        throw new Error(error.message);
    }
})



// @DESC:Authenticate user
//@METHOD:POST
//@ROUTES:localhost:3001/api/users/authenticate

export const loginUser = AsyncHandler(async (req: Request<{}, {}, authenticateUserTypes>, res: Response) => {
    let { email, password } = req.body
    try {
        const userExist = await userModel.findOne<UserProps>({ email }).select("-_id -__v ")

        if (userExist?.verified === true) {
            const compared = await bcrypt.compareSync(password, userExist.password)
            if (!compared) { res.send({ res: "fail", msg: "email or password not correct" }) }
            if (compared) {
                const { userId, email, firstname, roles, lastname, createdAt, verified } = userExist
                const token = jwt.sign({ userId, email, firstname, lastname, roles, verified }, String(process.env.JWT_PRIVATE_KEY), { algorithm: "HS256", expiresIn: "5hr" })
                res.status(201).send({
                    user: {
                        userId, email, firstname, lastname, roles, token, verified, createdAt,
                    },
                    msg: "Authentication successful"
                })
            }
        } else {
            res.send({ res: "fail", msg: "email or password not correct" })
        }
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }

})

// @DESC:get current user
//@METHOD:GET
//@ROUTES:localhost:3001/api/users/me/:userId

export const getCurrentUser = AsyncHandler(async (req: Request, res: Response) => {
    let { userId } = req.params
    if (!userId) {
        throw new Error("userid is required")
    }
    // @ts-ignore
    console.log(req.user);

    const user = await getUser({ userId })
    // const user = await userModel.findById(userId)
    if (!user) {
        res.status(403).json({
            res: "fail",
            status: "no user found",
        })
    }
    res.status(201).json({
        res: "ok",
        user
    })
})


// @DESC:get all users list
//@METHOD:GET
//@ROUTES:localhost:3001/api/users
//@ROLES:admin

export const listUsers = AsyncHandler(async (req: Request, res: Response) => {
    try {
        const users = await userModel.find().select("-__v -password")
        res.status(201).json({
            res: "ok",
            total: users?.length,
            users
        })
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})

// @DESC:delete a particular user 
//@METHOD:delete
//@ROUTES:localhost:3001/api/users/delete:userid
//@ROLES:admin

export const deleteUser = AsyncHandler(async (req: Request, res: Response) => {
    let { userId } = req.params
    try {
        const user = await userModel.findOneAndDelete<UserProps>({ userId })
        console.log(user);

        res.status(201).json({
            res: "ok",
            msg: "user deleted successfully",
            user
        })
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})


// @DESC:update a particular user 
//@METHOD:PUT
//@ROUTES:localhost:3001/api/users/update:userid
//@ROLES:user

export const updateUser = AsyncHandler(async (req: Request<{ userId: string }, {}, Partial<createuserTypes>>, res: Response) => {
    let { userId } = req.params
    const { firstname, lastname, phone } = req.body
    try {
        const userExist = await userModel.findOne<UserProps>({ userId })
        if (!userExist) {
            res.status(401).json({
                res: "fail",
                msg: "user not found"
            })
        }
        const user = await userModel.findOneAndUpdate({ userId }, {
            $set: {
                firstname: firstname || userExist?.firstname,
                lastname: lastname || userExist?.lastname,
                phone: phone || userExist?.phone
            },

        }, { new: true }).select("-__v -token -_id")
        if (!user) {
            res.status(401).json({
                res: "fail",
                msg: "unable to update user"
            })
        } else {
            res.status(201).json({
                res: "ok",
                msg: "user updated successfully",
                user
            })
        }
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})


// @DESC:forget password
//@METHOD:get
//@ROUTES:localhost:3001/api/users/forgetPassword
//@ROLES:user

export const forgetPassword = AsyncHandler(async (req: Request<{}, {}, Pick<createuserTypes, "email" | "verified">>, res: Response) => {
    const { email } = req.body
    try {
        const userExist = await userModel.findOne({ email })
        if (userExist?.verified === false) res.send({ msg: "unverify account" })
        // if (!userExist) res.send({ msg: "account not found" })
        const user = await userModel.findOneAndUpdate<createuserTypes>({ email }, { $set: { token: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000 } }, { new: true })
        if (user) {
            sendMail(
                email,
                "emmax-shop Reset password",
                `            <html>
                <head>
                <body>
                <h1 style={font-size:24px}>Reset Password</h1>
                <p style={color:red, font-size:18px}>Your otp verification code is ${user?.token}</p>
                </body>
                </head>
                </html>
                `
            );
            res.status(201).json({
                res: "ok",
                msg: "verification code has been sent to " + email,
                user
            })
        }

    } catch (error: any) {
        res.status(500);
        throw new Error(error.message);
    }
})

export const verifyForgetPasswordOtp = AsyncHandler(async (req: Request<Pick<createuserTypes, "email">, {}, Pick<createuserTypes, "token">>, res: Response) => {

    const { token } = req.body
    const { email } = req.params
    try {
        const user = await userModel.findOne<UserProps>({ email })
        if (!user) {
            res.status(403).json({
                res: "fail",
                status: "no user found",
            })
        } else {
            if (user?.token === Number(token)) {
                const verifyUser = await userModel.findOneAndUpdate({ email }, { $set: { verified: true, token: "" } },
                    { new: true })
                if (verifyUser) {
                    res.status(201).json({
                        res: "success",
                        status: "user verified",
                    })
                }
            } else {
                res.status(403).json({
                    res: "fail",
                    status: "Incorrect or expired token",
                })
            }
        }
    } catch (error: any) {
        res.status(500);
        throw new Error(error.message);
    }
})


// @DESC:update password
//@METHOD:get
//@ROUTES:localhost:3001/api/users/updatepassword
//@ROLES:user
export const updateResetPassword = AsyncHandler(async (req: Request<Pick<createuserTypes, "userId">, {}, Pick<createuserTypes, "password">>, res: Response) => {
    const { userId } = req.params
    const { password } = req.body
    try {
        const userExist = await userModel.findOne<createuserTypes>({ userId })
        if (!userExist) {
            res.status(403).json({
                res: "fail",
                status: "no user found",
            })
        }
        if (userExist?.verified === true) {
            const { hash } = await hashPassword(password)
            console.log('====================================');
            console.log(password, hash);
            console.log('====================================');
            const update = await userModel.findOneAndUpdate({ userId }, { $set: { password: hash } }, { new: true })
            if (update) {
                res.status(201).json({
                    res: "ok",
                    status: "password change successfully",
                    update
                })
            }
        }
    } catch (error: any) {
        res.status(500);
        throw new Error(error.message);
    }

})