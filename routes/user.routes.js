"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const users_joi_1 = require("../validations/schema/users.joi");
const validate_1 = require("../validations/validate");
const ensureLogin_1 = require("../middlewares/ensureLogin");
const router = express_1.default.Router();
router.get("/", ensureLogin_1.isAuthenticated, (0, ensureLogin_1.isAdmin)(["admin"]), user_controller_1.listUsers);
router.post("/create", (0, validate_1.validateSchema)(users_joi_1.createUserValidation), user_controller_1.createUser);
router.put("/verify/:userId", (0, validate_1.validateSchema)(users_joi_1.validateToken), user_controller_1.verifyUser);
router.put("/resend-otp/:userId", user_controller_1.ResendOtp);
router.post("/authenticate", (0, validate_1.validateSchema)(users_joi_1.validateLoginSchema), user_controller_1.loginUser);
router.get("/me/:userId", ensureLogin_1.isAuthenticated, user_controller_1.getCurrentUser);
router.delete("/delete/:userId", ensureLogin_1.isAuthenticated, (0, ensureLogin_1.isAdmin)(["admin"]), user_controller_1.deleteUser);
router.put("/update/:userId", ensureLogin_1.isAuthenticated, (0, ensureLogin_1.isAdmin)(["admin"]), user_controller_1.updateUser);
router.get("/forgetpassword/:email", (0, validate_1.validateSchema)(users_joi_1.validateForgetPaswword), user_controller_1.forgetPassword);
router.put("/verify/reset/:email", (0, validate_1.validateSchema)(users_joi_1.validateToken), user_controller_1.verifyForgetPasswordOtp);
router.put("/reset/update/:userId", (0, validate_1.validateSchema)(users_joi_1.validateResetPassword), user_controller_1.updateResetPassword);
exports.default = router;
