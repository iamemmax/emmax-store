import express from "express"
import { createSlider, deleteProductSlide, getSingleSlider, getSliderList, updateCategory } from "../../controllers/products/sliders.controller"
import { isAdmin, isAuthenticated } from "../../middlewares/ensureLogin"
import { validateSchema } from "../../validations/validate"
import { validateProductSlider } from "../../validations/schema/product.category.joi"

const router = express.Router()
router.post("/slider/create", isAuthenticated, validateSchema(validateProductSlider), createSlider)
router.get("/slider/list", isAuthenticated, getSliderList)
router.get("/slider/:productId", isAuthenticated, getSingleSlider)
router.put("/slider/update/:productId", isAuthenticated, isAdmin, updateCategory)
router.delete("/slider/delete/:productId", isAuthenticated, isAdmin, deleteProductSlide)
export default router