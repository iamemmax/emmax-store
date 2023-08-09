"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    categoryId: {
        type: String,
        unique: true,
        default: () => `categoryId_${(0, uuid_1.v4)().slice(0, 8)}`
    }
}, { timestamps: true });
const categoryModel = mongoose_1.default.model("categories", categorySchema);
exports.default = categoryModel;
