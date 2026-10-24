import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { autenticar } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/upload.middleware.js";  

const router = Router();

router.post("/cadastro", upload.single("foto"), asyncHandler(authController.cadastrar));
router.post("/login", asyncHandler(authController.login));
router.get("/me", autenticar, asyncHandler(authController.me));

export default router;