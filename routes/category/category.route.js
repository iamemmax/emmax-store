"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../validations/validate");
const product_category_joi_1 = require("../../validations/schema/product.category.joi");
const category_controller_1 = require("../../controllers/category/category.controller");
const ensureLogin_1 = require("../../middlewares/ensureLogin");
const router = express_1.default.Router();
router.get("/", ensureLogin_1.isAuthenticated, category_controller_1.getCategoryList);
router.post("/create", ensureLogin_1.isAuthenticated, ensureLogin_1.isAdmin, (0, validate_1.validateSchema)(product_category_joi_1.validateCategory), category_controller_1.createProductCategory);
router.get("/:categoryId", ensureLogin_1.isAuthenticated, category_controller_1.getSingleCategory);
router.put("/update/:categoryId", ensureLogin_1.isAuthenticated, ensureLogin_1.isAdmin, category_controller_1.updateCategory);
router.delete("/delete/:categoryId", ensureLogin_1.isAuthenticated, ensureLogin_1.isAdmin, category_controller_1.deleteCategory);
exports.default = router;
