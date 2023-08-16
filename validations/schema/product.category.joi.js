"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReviewProduct = exports.validateProduct = exports.validateProductSlider = exports.validateCategory = void 0;
const joi_1 = __importDefault(require("joi"));
exports.validateCategory = joi_1.default.object({
    name: joi_1.default.string().required(),
});
exports.validateProductSlider = joi_1.default.object({
    title: joi_1.default.string().required(),
    category: joi_1.default.required(),
    postedBy: joi_1.default.required(),
    img: joi_1.default.string().required()
});
exports.validateProduct = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    brand: joi_1.default.string(),
    category: joi_1.default.required(),
    userId: joi_1.default.required(),
    productImgs: joi_1.default.required(),
    price: joi_1.default.number().required(),
    quantity: joi_1.default.number().required(),
    size: joi_1.default.array().required(),
    colors: joi_1.default.array().required()
});
exports.validateReviewProduct = joi_1.default.object({
    comment: joi_1.default.string().required(),
    review: joi_1.default.number().required(),
    userId: joi_1.default.required(),
    reviewDate: joi_1.default.date()
});
