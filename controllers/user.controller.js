"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.updateResetPassword = exports.verifyForgetPasswordOtp = exports.forgetPassword = exports.updateUser = exports.deleteUser = exports.listUsers = exports.getCurrentUser = exports.logoutUser = exports.loginUser = exports.verifyUser = exports.ResendOtp = exports.createUser = void 0;
const users_model_1 = __importDefault(require("../model/users.model"));
const bcrypt_1 = __importStar(require("bcrypt"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_2 = require("../helpers/bcrypt");
const User_service_1 = require("../service/User.service");
const sendMail_1 = require("../helpers/sendMail");
const generateToken_1 = __importDefault(require("../helpers/generateToken"));
// @DESC:signup a user
//@METHOD:Post
//@ROUTES:localhost:3001/api/users/create
exports.createUser = ((0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const userExist = yield users_model_1.default.findOne({ email });
        const userUsernameExist = yield users_model_1.default.findOne({ username });
        if (userExist) {
            res.status(401);
            throw new Error("email already exist");
        }
        if (userUsernameExist) {
            res.status(401);
            throw new Error("username already exist");
        }
        const genUserId = `userId_${username}${email.slice(0, 5)}${Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000}${password.slice(0, 4)}${password.slice(0, 3)}`;
        const { hash } = yield (0, bcrypt_2.hashPassword)(password);
        const data = yield new users_model_1.default({
            userId: genUserId, username, email, password: hash, token: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
        }).save();
        if (data) {
            (0, sendMail_1.sendMail)(email, "emmax-shop registration", `            <html>
                <head>
                <body>
                <h1 style={font-size:24px}>Welcome to king store</h1>
                <p style={color:red, font-size:18px}>Your otp verification code is ${data === null || data === void 0 ? void 0 : data.token}</p>
                </body>
                </head>
                </html>
                `);
            res.status(201).json({
                user: { res: "ok", userId: data === null || data === void 0 ? void 0 : data.userId, username, email },
                msg: "Registration is successful. A verification OTP has been sent to your email."
            });
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
})));
//@DESC:resent otp
//@METHOD:put
//@ROUTES:localhost:3001/api/users/resendotp/userid
exports.ResendOtp = ((0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userExist = yield users_model_1.default.findOne({ userId });
        if (!userExist) {
            // return res.status(401).json({ msg: "user not found" })
            res.status(400);
            throw new Error("user not found");
        }
        if (userExist.verified === true) {
            res.status(401);
            throw new Error("Account already verified");
        }
        const updateOtp = yield users_model_1.default.findOneAndUpdate({ userId }, { $set: { token: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000 } }, { new: true });
        if (updateOtp) {
            (0, sendMail_1.sendMail)(userExist.email, "emmax-shop Verification", `
                <html>
                <head>
                <body>
                <h1 style={font-size:24px}>Welcome to king store</h1>
                <p style={color:red, font-size:18px}>Your otp verification code is ${updateOtp === null || updateOtp === void 0 ? void 0 : updateOtp.token}</p>
                </body>
                </head>
                </html>
                `);
            res.status(201).json({ user: { res: "ok" }, msg: "A verification OTP has been resent to your email." });
            // console.log(cryptoRandomString({ length: 10, type: "numeric" }));
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
})));
// @DESC:verify user
//@METHOD:PUT
//@ROUTES:localhost:3001/api/users/verify/:userid
exports.verifyUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const { userId } = req.params;
    try {
        const user = yield users_model_1.default.findOne({ userId });
        if (!user) {
            res.status(400);
            throw new Error("user not found");
        }
        else {
            if ((user === null || user === void 0 ? void 0 : user.token) === Number(token)) {
                const verifyUser = yield users_model_1.default.findOneAndUpdate({ userId: userId }, { $set: { verified: true, token: "" } }, { new: true });
                if (verifyUser) {
                    res.status(201).json({
                        user: { res: "success" },
                        msg: "user verified",
                    });
                }
            }
            else {
                res.status(401);
                throw new Error("Incorrect or expired token");
            }
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
}));
// @DESC:Authenticate user
//@METHOD:POST
//@ROUTES:localhost:3001/api/users/authenticate
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    try {
        const userExist = yield users_model_1.default.findOne({ email }).select(" -__v ");
        if ((userExist === null || userExist === void 0 ? void 0 : userExist.verified) === true) {
            const compared = yield bcrypt_1.default.compareSync(password, userExist.password);
            if (!compared) {
                res.status(400);
                throw new Error("email or password not correct");
            }
            console.log(bcrypt_1.compare);
            if (compared) {
                const { userId, email, firstname, roles, username, lastname, createdAt, verified, _id } = userExist;
                const token = yield (0, generateToken_1.default)(res, userExist._id);
                res.status(201).send({
                    user: {
                        _id, userId, email, firstname, username, lastname, roles, verified, createdAt,
                    },
                    msg: "Authentication successful"
                });
            }
        }
        else {
            res.status(400);
            throw new Error("no or unverified account");
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
}));
exports.logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('eAuth', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
}));
// @DESC:get current user
//@METHOD:GET
//@ROUTES:localhost:3001/api/users/me/:userId
exports.getCurrentUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.params;
    if (!userId) {
        throw new Error("userid is required");
    }
    // @ts-ignore
    console.log(req.user);
    try {
        const user = yield (0, User_service_1.getUser)({ userId });
        // const user = await userModel.findById(userId)
        if (!user) {
            res.status(400);
            throw new Error("user not found");
        }
        res.status(201).json({
            res: "ok",
            user,
            msg: "success"
        });
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
}));
// @DESC:get all users list
//@METHOD:GET
//@ROUTES:localhost:3001/api/users
//@ROLES:admin
exports.listUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_model_1.default.find().select("-__v -password");
        res.status(201).json({
            res: "ok",
            total: users === null || users === void 0 ? void 0 : users.length,
            users
        });
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
}));
// @DESC:delete a particular user 
//@METHOD:delete
//@ROUTES:localhost:3001/api/users/delete:userid
//@ROLES:admin
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.params;
    try {
        const user = yield users_model_1.default.findOneAndDelete({ userId });
        console.log(user);
        res.status(201).json({
            res: "ok",
            msg: "user deleted successfully",
            user
        });
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
}));
// @DESC:update a particular user 
//@METHOD:PUT
//@ROUTES:localhost:3001/api/users/update:userid
//@ROLES:user
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.params;
    const { firstname, lastname, phone } = req.body;
    try {
        const userExist = yield users_model_1.default.findOne({ userId });
        if (!userExist) {
            res.status(401);
            throw new Error("user not found");
        }
        const user = yield users_model_1.default.findOneAndUpdate({ userId }, {
            $set: {
                firstname: firstname || (userExist === null || userExist === void 0 ? void 0 : userExist.firstname),
                lastname: lastname || (userExist === null || userExist === void 0 ? void 0 : userExist.lastname),
                phone: phone || (userExist === null || userExist === void 0 ? void 0 : userExist.phone)
            },
        }, { new: true }).select("-__v -token -_id");
        if (!user) {
            res.status(401);
            throw new Error("unable to update user");
        }
        else {
            res.status(201).json({
                res: "ok",
                msg: "user updated successfully",
                user
            });
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
}));
// @DESC:forget password
//@METHOD:get
//@ROUTES:localhost:3001/api/users/forgetPassword
//@ROLES:user
exports.forgetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const userExist = yield users_model_1.default.findOne({ email });
        if ((userExist === null || userExist === void 0 ? void 0 : userExist.verified) === false) {
            res.status(400);
            throw new Error("unverify account");
        }
        if (!userExist) {
            res.status(400);
            throw new Error("account not found");
        }
        // if (!userExist) res.send({ msg: "account not found" })
        const user = yield users_model_1.default.findOneAndUpdate({ email }, { $set: { token: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000 } }, { new: true });
        if (user) {
            (0, sendMail_1.sendMail)(email, "emmax-shop Reset password", `            <html>
                <head>
                <body>
                <h1 style={font-size:24px}>Reset Password</h1>
                <p style={color:red, font-size:18px}>Your otp verification code is ${user === null || user === void 0 ? void 0 : user.token}</p>
                </body>
                </head>
                </html>
                `);
            res.status(201).json({
                res: "ok",
                msg: "verification code has been sent to " + email,
                user
            });
        }
    }
    catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
}));
exports.verifyForgetPasswordOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const { email } = req.params;
    try {
        const user = yield users_model_1.default.findOne({ email });
        if (!user) {
            res.status(400);
            throw new Error("no user found");
        }
        else {
            if ((user === null || user === void 0 ? void 0 : user.token) === Number(token)) {
                const verifyUser = yield users_model_1.default.findOneAndUpdate({ email }, { $set: { verified: true, token: "" } }, { new: true }).select("-password -__v");
                if (verifyUser) {
                    res.status(201).json({
                        res: "success",
                        msg: "user verified",
                        user: verifyUser
                    });
                }
            }
            else {
                res.status(400);
                throw new Error("Incorrect or expired token");
            }
        }
    }
    catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
}));
// @DESC:update password
//@METHOD:get
//@ROUTES:localhost:3001/api/users/updatepassword
//@ROLES:user
exports.updateResetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { password } = req.body;
    try {
        const userExist = yield users_model_1.default.findOne({ userId });
        if (!userExist) {
            res.status(400);
            throw new Error("user not found");
        }
        if ((userExist === null || userExist === void 0 ? void 0 : userExist.verified) === true) {
            const { hash } = yield (0, bcrypt_2.hashPassword)(password);
            const update = yield users_model_1.default.findOneAndUpdate({ userId }, { $set: { password: hash } }, { new: true });
            if (update) {
                res.status(201).json({
                    res: "ok",
                    msg: "password change successfully",
                    user: update
                });
            }
        }
    }
    catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
}));
