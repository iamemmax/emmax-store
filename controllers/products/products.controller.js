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
exports.reviewProduct = exports.updateProduct = exports.deleteProduct = exports.getTopSellingProduct = exports.getProductByCategory = exports.getRelatedProduct = exports.getSingleProduct = exports.getProductList = exports.createProduct = void 0;
const products_model_1 = __importDefault(require("../../model/products/products.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// @DESC:create products
//@METHOD:post
//@ROUTES:localhost:3001/api/products/craete
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brand, title, category, description, price, productImgs, quantity, userId, size, colors } = req.body;
    try {
        const productExit = yield products_model_1.default.findOne({ title });
        if (productExit) {
            return res.status(401).json({ msg: `product already exist` });
        }
        const product = yield new products_model_1.default({
            title, category, description, price, size, colors, productImgs, brand, quantity, userId
        }).save();
        if (product) {
            return res.status(201).json({
                res: "ok",
                msg: "product created successfully",
                product
            });
        }
        else {
            return res.status(401).json({
                res: "fail",
                msg: "unable to created product",
            });
        }
    }
    catch (error) {
        res.status(501).json({
            res: "fail",
            msg: error.message
        });
    }
});
exports.createProduct = createProduct;
// @DESC:list all products
//@METHOD:get
//@ROUTES:localhost:3001/api/products
exports.getProductList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_model_1.default.find().populate("userId category", " -password -__v -token -updatedAt -createdAt").select("-__v").sort({ "createdAt": -1 });
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
//@ROUTES:localhost:3001/api/products/:slug
exports.getSingleProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { slug } = req.params;
        if (!slug) {
            res.status(400);
            throw new Error("product slug is required");
        }
        const product = yield products_model_1.default.findOne({ slug }).populate("userId category", "-password -__v -token").select("-__v -password").populate({ path: "productReviews.userId", select: "-password -token -verified -roles -__v" });
        if (!product) {
            res.status(400);
            throw new Error("no product found");
        }
        res.status(201).json({
            res: "ok",
            product
        });
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}));
// @DESC:list all related products
//@METHOD:get
//@ROUTES:localhost:3001/api/products/:slug
exports.getRelatedProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug, category } = req.params;
    try {
        const products = yield products_model_1.default.find({
            category: { $eq: category },
            slug: { $ne: slug }
        }).populate("userId category", "-_id -password -__v -token -updatedAt -createdAt").select("-__v");
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
// @DESC:list all  products by category
//@METHOD:get
//@ROUTES:localhost:3001/api/products/category
exports.getProductByCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        const products = yield products_model_1.default.find({
            category,
        }).populate("userId category", "-_id -password -__v -token -updatedAt -createdAt").select("-__v").sort("asc");
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
// @DESC: top selling products
//@METHOD:get
//@ROUTES:localhost:3001/api/products/topselling
exports.getTopSellingProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_model_1.default.find({
            sold: { $gt: 0 },
        }).populate("userId category", "-_id -password -__v -token -updatedAt -createdAt").select("-__v").sort("asc");
        if (!products) {
            res.status(401).json({ res: "fail", msg: "products not found" });
        }
        res.status(201).json({
            res: "ok",
            total: products === null || products === void 0 ? void 0 : products.length,
            products
        });
    }
    catch (error) {
        res.status(501).json({ msg: error.message });
    }
}));
// @DESC: delete product
//@METHOD:delete
//@ROUTES:localhost:3001/api/products/:productId
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        const product = yield products_model_1.default.findOneAndDelete({ productId });
        if (!product) {
            res.status(401).json({ res: "fail", msg: "product not found" });
        }
        res.status(201).json({
            res: "ok",
            msg: "product deleted successfully"
        });
    }
    catch (error) {
        res.status(501).json({ msg: error.message });
    }
}));
// @DESC: update product
//@METHOD:PUT
//@ROUTES:localhost:3001/api/products/update/:productId
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { productId } = req.params;
    const { category, title, brand, description, price, productImgs, quantity, size, colors, userId, sold } = req.body;
    try {
        const product = yield products_model_1.default.findOne({ productId });
        if (!product) {
            res.status(401).json({
                res: "fail",
                msg: "user not found"
            });
        }
        const updateProduct = yield products_model_1.default.findOneAndUpdate({ productId }, {
            $set: {
                title: title || (product === null || product === void 0 ? void 0 : product.title),
                productImgs: productImgs || (product === null || product === void 0 ? void 0 : product.productImgs),
                category: category || (product === null || product === void 0 ? void 0 : product.category),
                userId: userId || (product === null || product === void 0 ? void 0 : product.userId),
                size: size || (product === null || product === void 0 ? void 0 : product.size),
                colors: colors || (product === null || product === void 0 ? void 0 : product.colors),
                brand: brand || (product === null || product === void 0 ? void 0 : product.brand),
                description: description || (product === null || product === void 0 ? void 0 : product.description),
                price: price || (product === null || product === void 0 ? void 0 : product.price),
                quantity: quantity || (product === null || product === void 0 ? void 0 : product.quantity),
                sold: sold || (product === null || product === void 0 ? void 0 : product.sold),
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
// @DESC: review product
//@METHOD:PUT
//@ROUTES:localhost:3001/api/products/update/:productId
exports.reviewProduct = ((0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let { productId } = req.params;
    const { userId, comment, review } = req.body;
    const reviewItem = { userId, comment, review, reviewDate: new Date(Date.now()) };
    try {
        const products = yield products_model_1.default.findOne({ productId });
        if (products) {
            const alreadyReviewed = products.productReviews.find((product) => product.userId.toString() === userId.toString());
            if (alreadyReviewed) {
                res.status(401);
                throw new Error("Product already reviewed");
            }
            const data = yield products.productReviews.reduce((acc, item) => item.review + acc, 0);
            const length = ((_a = products === null || products === void 0 ? void 0 : products.productReviews) === null || _a === void 0 ? void 0 : _a.length) + 1;
            const result = data / length;
            products.productReviews.push(reviewItem);
            products.numReview = (_b = products === null || products === void 0 ? void 0 : products.productReviews) === null || _b === void 0 ? void 0 : _b.length;
            products.rating = result;
            const savedProduct = yield products.save();
            //      
            if (savedProduct) {
                const { productReviews } = savedProduct;
                const review = productReviews.filter((x) => (x === null || x === void 0 ? void 0 : x.userId.toString()) === userId.toString());
                res.status(200).json({
                    res: "ok",
                    msg: "product review successfully",
                    review
                });
                // }
            }
            else {
                res.status(401);
                throw new Error("unable to review product");
            }
        }
    }
    catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
})));
