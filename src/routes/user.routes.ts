import express from "express"
import { ResendOtp, createUser, deleteUser, getCurrentUser, listUsers, loginUser, updateUser, verifyUser } from "../controllers/user.controller"
import { createUserValidation, validateLoginSchema, validateToken } from "../validations/schema/users.joi";
import { validateSchema } from '../validations/validate';
import { isAdmin, isAuthenticated } from "../middlewares/ensureLogin";
const router = express.Router()

router.get("/", isAuthenticated, isAdmin, listUsers)
router.post("/create", validateSchema(createUserValidation), createUser)
router.put("/verify/:userId", validateSchema(validateToken), verifyUser)
router.put("/resend-otp/:userId", ResendOtp)
router.post("/authenticate", validateSchema(validateLoginSchema), loginUser)
router.get("/me/:userId", isAuthenticated, getCurrentUser)
router.delete("/delete/:userId", isAuthenticated, isAdmin, deleteUser)
router.put("/update/:userId", isAuthenticated, updateUser)

export default router