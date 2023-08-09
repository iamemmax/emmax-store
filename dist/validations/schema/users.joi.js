"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateForgetPaswword = exports.validateResetPassword = exports.validateToken = exports.validateLoginSchema = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().alphanum().required().label("First name"),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password2: joi_1.default.ref('password')
});
exports.validateLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.validateToken = joi_1.default.object({
    token: joi_1.default.number().required(),
});
exports.validateResetPassword = joi_1.default.object({
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password2: joi_1.default.ref('password')
});
exports.validateForgetPaswword = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
