"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        // default: () => `userId_${uuidv4()}`
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
    },
    roles: {
        type: [],
        default: ["user"]
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
    },
    token: {
        type: Number,
        expires: "30min"
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const userModel = mongoose_1.default.model("users", userSchema);
exports.default = userModel;
