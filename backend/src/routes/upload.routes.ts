import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { autenticar } from "../middlewares/auth.middleware.js";   
import { asyncHandler } from "../middlewares/error.middleware.js";
import { uploadController } from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/perfil",
  autenticar,                      
  upload.single("foto"),
  asyncHandler(uploadController.uploadPerfil)
);

router.get("/foto-privada", asyncHandler(uploadController.signedUrl));

export default router;