import  express  from "express";
import { setupAdmin,loginAdmin,changePassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/setup',setupAdmin);
router.post('/login',loginAdmin);
router.post('/change-password',changePassword)

export default router