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
router.post("/create", (0, validate_1.validateSchema)(users_joi_1.createUserValidation), user_controller_1.createUser);
router.post("/authenticate", (0, validate_1.validateSchema)(users_joi_1.validateLoginSchema), user_controller_1.loginUser);
router.get("/me/:userId", ensureLogin_1.isAuthenticated, user_controller_1.getCurrentUser);
exports.default = router;
