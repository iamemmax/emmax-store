import express from "express"
import { validateSchema } from "../../validations/validate"
import { validateCategory } from "../../validations/schema/product.category.joi";
import { createProductCategory, deleteCategory, getCategoryList, getSingleCategory, updateCategory } from "../../controllers/category/category.controller";
import { isAdmin, isAuthenticated } from "../../middlewares/ensureLogin";


const router = express.Router()
router.get("/", isAuthenticated, getCategoryList)
router.post("/create", isAuthenticated, isAdmin, validateSchema(validateCategory), createProductCategory)
router.get("/:categoryId", isAuthenticated, getSingleCategory)
router.put("/update/:categoryId", isAuthenticated, isAdmin, updateCategory)
router.delete("/delete/:categoryId", isAuthenticated, isAdmin, deleteCategory)


export default router