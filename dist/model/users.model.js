"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const userSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        default: () => `userId_${(0, uuid_1.v4)()}`
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});
const userModel = mongoose_1.default.model("users", userSchema);
exports.default = userModel;
