import express from "express"
import { ResendOtp, createUser, deleteUser, forgetPassword, getCurrentUser, listUsers, loginUser, logoutUser, updateResetPassword, updateUser, verifyForgetPasswordOtp, verifyUser } from "../controllers/user.controller"
import { createUserValidation, validateForgetPaswword, validateLoginSchema, validateResetPassword, validateToken } from "../validations/schema/users.joi";
import { validateSchema } from '../validations/validate';
import { isAdmin, isAuthenticated } from "../middlewares/ensureLogin";
const router = express.Router()

router.get("/", isAuthenticated, isAdmin(["admin"]), listUsers)
router.post("/create", validateSchema(createUserValidation), createUser)
router.get("/logout", isAuthenticated, logoutUser)
router.put("/verify/:userId", validateSchema(validateToken), verifyUser)
router.put("/resend-otp/:userId", ResendOtp)
router.post("/authenticate", validateSchema(validateLoginSchema), loginUser)
router.get("/me/:userId", isAuthenticated, getCurrentUser)
router.delete("/delete/:userId", isAuthenticated, isAdmin(["admin"]), deleteUser)
router.put("/update/:userId", isAuthenticated, isAdmin(["admin"]), updateUser)
router.get("/forgetpassword/:email", forgetPassword)
router.put("/verify/reset/:email", validateSchema(validateToken), verifyForgetPasswordOtp)
router.put("/reset/update/:userId", validateSchema(validateResetPassword), updateResetPassword)


export default router