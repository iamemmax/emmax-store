import express from "express"
import { createSlider, deleteProductSlide, getSingleSlider, getSliderList, updateCategory } from "../../controllers/products/sliders.controller"
import { isAdmin, isAuthenticated } from "../../middlewares/ensureLogin"
import { validateSchema } from "../../validations/validate"
import { validateProduct, validateProductSlider, validateReviewProduct } from "../../validations/schema/product.category.joi"
import { createProduct, deleteProduct, getProductByCategory, getProductList, getRelatedProduct, getSingleProduct, getTopSellingProduct, reviewProduct, updateProduct } from "../../controllers/products/products.controller"

const router = express.Router()
router.post("/slider/create", isAuthenticated, validateSchema(validateProductSlider), createSlider)
router.get("/slider/list", isAuthenticated, getSliderList)
router.get("/slider/:productId", isAuthenticated, getSingleSlider)
router.put("/slider/update/:productId", isAuthenticated, isAdmin, updateCategory)
router.delete("/slider/delete/:productId", isAuthenticated, isAdmin, deleteProductSlide)

// products
router.get("/", isAuthenticated, getProductList)
router.post("/create", isAuthenticated, validateSchema(validateProduct), createProduct)
router.get("/topselling", isAuthenticated, getTopSellingProduct)
router.get("/:slug", isAuthenticated, getSingleProduct)
router.get("/:category", isAuthenticated, getProductByCategory)
router.delete("/:productId", isAuthenticated, deleteProduct)
router.put("/update/:productId", isAuthenticated, updateProduct)
router.put("/review/:productId", isAuthenticated, validateSchema(validateReviewProduct), reviewProduct)
router.get("/:slug/:category", isAuthenticated, getRelatedProduct)




export default router