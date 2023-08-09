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
exports.deleteProductSlide = exports.updateCategory = exports.getSingleSlider = exports.getSliderList = exports.createSlider = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const slider_model_1 = __importDefault(require("../../model/products/slider.model"));
const createSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, category, img, postedBy } = req.body;
    try {
        const sliderExist = yield slider_model_1.default.findOne({ title });
        if (sliderExist) {
            return res.json({ msg: `${title} already exist` });
        }
        const createSlider = yield new slider_model_1.default({
            title, category, img, postedBy
        }).save();
        if (createSlider) {
            res.status(201).json({
                res: "ok",
                msg: "product slider created successfully",
                createSlider
            });
        }
        else {
            res.send("unable to create category");
        }
    }
    catch (error) {
        res.status(403);
        throw new Error(error.message);
    }
});
exports.createSlider = createSlider;
// @DESC:list all categorys
//@METHOD:get
//@ROUTES:localhost:3001/api/categories
exports.getSliderList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield slider_model_1.default.find().populate("postedBy category", "-_id -password -__v -token").select("-__v");
        res.status(201).json({
            res: "ok",
            total: products === null || products === void 0 ? void 0 : products.length,
            products
        });
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
// @DESC:get single product
//@METHOD:GET
//@ROUTES:localhost:3001/api/products/slider/:productId
exports.getSingleSlider = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { productId } = req.params;
        if (!productId) {
            throw new Error("productId is required");
        }
        const product = yield slider_model_1.default.findOne({ productId }).populate("postedBy category", "-_id -password -__v -token").select("-__v");
        if (!product) {
            res.status(403).json({
                res: "fail",
                status: "no product found",
            });
        }
        res.status(201).json({
            res: "ok",
            product
        });
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
// @DESC: update product slider
//@METHOD:Put
//@ROUTES:localhost:3001/api/category/:productId
exports.updateCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { productId } = req.params;
    const { category, img, title, postedBy } = req.body;
    try {
        const product = yield slider_model_1.default.findOne({ productId });
        if (!product) {
            res.status(401).json({
                res: "fail",
                msg: "user not found"
            });
        }
        const updateProduct = yield slider_model_1.default.findOneAndUpdate({ productId }, {
            $set: {
                title: title || (product === null || product === void 0 ? void 0 : product.title),
                img: img || (product === null || product === void 0 ? void 0 : product.img),
                category: category || (product === null || product === void 0 ? void 0 : product.category),
                postedBy: postedBy || (product === null || product === void 0 ? void 0 : product.postedBy),
            },
        }, { new: true });
        if (!updateProduct) {
            res.status(401).json({
                res: "fail",
                msg: "unable to update product"
            });
        }
        else {
            res.status(201).json({
                res: "ok",
                msg: "product updated successfully",
                product: updateProduct
            });
        }
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
// @DESC:delete a particular slider 
//@METHOD:delete
//@ROUTES:localhost:3001/api/product/slider/delete/:userid
//@ROLES:admin
exports.deleteProductSlide = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { productId } = req.params;
    try {
        const product = yield slider_model_1.default.findOneAndDelete({ productId });
        res.status(201).json({
            res: "ok",
            msg: "product deleted successfully",
            product
        });
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
