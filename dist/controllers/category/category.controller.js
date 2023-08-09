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
exports.deleteCategory = exports.updateCategory = exports.getSingleCategory = exports.getCategoryList = exports.createProductCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const category_model_1 = __importDefault(require("../../model/category.model"));
// @DESC:create a product category
//@METHOD:Post
//@ROUTES:localhost:3001/api/category/create
const createProductCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const categoryExist = yield category_model_1.default.findOne({ name });
        if (categoryExist) {
            return res.json({ msg: `category ${name} already exist` });
        }
        const category = yield new category_model_1.default({ name }).save();
        if (category) {
            return res.status(201).json({
                res: "ok",
                status: "success",
                msg: "Category created successfully",
                category
            });
        }
        else {
            res.status(401).send("unable to create category");
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
});
exports.createProductCategory = createProductCategory;
// @DESC:list all categorys
//@METHOD:get
//@ROUTES:localhost:3001/api/categories
exports.getCategoryList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find().select("-__v ");
        res.status(201).json({
            res: "ok",
            total: categories === null || categories === void 0 ? void 0 : categories.length,
            categories
        });
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
// @DESC:get single category
//@METHOD:GET
//@ROUTES:localhost:3001/api/category/:userId
exports.getSingleCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { categoryId } = req.params;
        if (!categoryId) {
            throw new Error("categoryId is required");
        }
        const category = yield category_model_1.default.findOne({ categoryId });
        if (!category) {
            res.status(403).json({
                res: "fail",
                status: "no category found",
            });
        }
        res.status(201).json({
            res: "ok",
            category
        });
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
// @DESC: update category
//@METHOD:Put
//@ROUTES:localhost:3001/api/category/:userId
exports.updateCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryId } = req.params;
    const { name } = req.body;
    try {
        const categoryExist = yield category_model_1.default.findOne({ categoryId });
        if (!categoryExist) {
            res.status(401).json({
                res: "fail",
                msg: "user not found"
            });
        }
        const category = yield category_model_1.default.findOneAndUpdate({ categoryId }, {
            $set: {
                name: name || (categoryExist === null || categoryExist === void 0 ? void 0 : categoryExist.name)
            },
        }, { new: true });
        if (!category) {
            res.status(401).json({
                res: "fail",
                msg: "unable to update category"
            });
        }
        else {
            res.status(201).json({
                res: "ok",
                msg: "category updated successfully",
                category
            });
        }
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
// @DESC:delete a particular category 
//@METHOD:delete
//@ROUTES:localhost:3001/api/category/delete/:userid
//@ROLES:admin
exports.deleteCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { categoryId } = req.params;
    try {
        const category = yield category_model_1.default.findOneAndDelete({ categoryId });
        res.status(201).json({
            res: "ok",
            msg: "category deleted successfully",
            category
        });
    }
    catch (error) {
        res.status(405).json({ msg: error.message });
    }
}));
