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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const slugify_1 = __importDefault(require("slugify"));
const productSchema = new mongoose_1.default.Schema({
    productId: {
        type: String,
        default: () => `productId_${(0, uuid_1.v4)().slice(0, 8)}`
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        require: true,
    },
    productImgs: [],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "categories",
        required: true,
        trim: true,
    },
    size: {
        type: [],
        required: true
    },
    colors: {
        type: [],
        required: true
    },
    brand: {
        type: String,
        // required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    productReviews: [{
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "users",
            },
            review: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true,
            },
            reviewDate: { type: Date, required: true },
        }],
    numReview: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
}, { timestamps: true });
productSchema.pre("validate", function (next) {
    this.slug = (0, slugify_1.default)(this.title, {
        lower: true,
        // strict:true
    });
    next();
});
const productModel = mongoose_1.default.model("products", productSchema);
exports.default = productModel;
