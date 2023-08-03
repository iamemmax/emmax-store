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
exports.getCurrentUser = exports.loginUser = exports.createUser = void 0;
const users_model_1 = __importDefault(require("../model/users.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("../helpers/bcrypt");
const User_service_1 = require("../service/User.service");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password } = req.body;
    try {
        const userExist = yield users_model_1.default.findOne({ email });
        if (userExist) {
            return res.send({ msg: "email already exist" });
        }
        const { hash } = yield (0, bcrypt_1.hashPassword)(password);
        const data = yield new users_model_1.default({
            firstname, lastname, email, password: hash
        }).save();
        if (data) {
            res.send({ user: { userId: data === null || data === void 0 ? void 0 : data.userId, firstname, lastname, email } });
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
});
exports.createUser = createUser;
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    try {
        const userExist = yield users_model_1.default.findOne({ email }).select("-_id -__v ");
        if (userExist) {
            const compared = yield (0, bcrypt_1.verifyPassword)(password, userExist.password);
            if (!compared)
                res.send({ msg: "something went wrong" });
            if (compared) {
                const { userId, email, firstname, lastname, createdAt, updatedAt } = userExist;
                const token = jsonwebtoken_1.default.sign({ userId, email, firstname, lastname }, String(process.env.JWT_PRIVATE_KEY), { algorithm: "HS256", expiresIn: "1hr" });
                res.status(201).send({
                    user: {
                        userId, email, firstname, lastname, token, createdAt, updatedAt,
                    }
                });
            }
        }
        else {
            res.send({ msg: "email or password not correct" });
        }
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
exports.getCurrentUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.params;
    if (!userId) {
        throw new Error("userid is required");
    }
    //@ts-ignore
    console.log(req.user);
    const user = yield (0, User_service_1.getUser)({ userId: userId });
    // const user = await userModel.findById(userId)
    if (!user) {
        res.status(403).json({
            res: "fail",
            status: "no user found",
        });
    }
    res.status(201).json({
        res: "ok",
        user
    });
}));
