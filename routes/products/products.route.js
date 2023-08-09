"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sliders_controller_1 = require("../../controllers/products/sliders.controller");
const ensureLogin_1 = require("../../middlewares/ensureLogin");
const validate_1 = require("../../validations/validate");
const product_category_joi_1 = require("../../validations/schema/product.category.joi");
const products_controller_1 = require("../../controllers/products/products.controller");
const router = express_1.default.Router();
router.post("/slider/create", ensureLogin_1.isAuthenticated, (0, validate_1.validateSchema)(product_category_joi_1.validateProductSlider), sliders_controller_1.createSlider);
router.get("/slider/list", ensureLogin_1.isAuthenticated, sliders_controller_1.getSliderList);
router.get("/slider/:productId", ensureLogin_1.isAuthenticated, sliders_controller_1.getSingleSlider);
router.put("/slider/update/:productId", ensureLogin_1.isAuthenticated, ensureLogin_1.isAdmin, sliders_controller_1.updateCategory);
router.delete("/slider/delete/:productId", ensureLogin_1.isAuthenticated, ensureLogin_1.isAdmin, sliders_controller_1.deleteProductSlide);
// products
router.get("/", ensureLogin_1.isAuthenticated, products_controller_1.getProductList);
router.post("/create", ensureLogin_1.isAuthenticated, (0, validate_1.validateSchema)(product_category_joi_1.validateProduct), products_controller_1.createProduct);
router.get("/topselling", ensureLogin_1.isAuthenticated, products_controller_1.getTopSellingProduct);
router.get("/:category", ensureLogin_1.isAuthenticated, products_controller_1.getProductByCategory);
router.get("/:slug", ensureLogin_1.isAuthenticated, products_controller_1.getSingleProduct);
router.get("/:slug/:category", ensureLogin_1.isAuthenticated, products_controller_1.getRelatedProduct);
router.delete("/:productId", ensureLogin_1.isAuthenticated, products_controller_1.deleteProduct);
router.put("/update/:productId", ensureLogin_1.isAuthenticated, products_controller_1.updateProduct);
router.put("/review/:productId", ensureLogin_1.isAuthenticated, (0, validate_1.validateSchema)(product_category_joi_1.validateReviewProduct), products_controller_1.reviewProduct);
exports.default = router;
