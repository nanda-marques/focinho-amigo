import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import { uploadController } from '../controllers/uploadController.js';

const router = Router();

router.post('/upload', upload.single('foto'), uploadController.uploadFoto);
router.get('/foto-privada', uploadController.signedUrl);

export default router;