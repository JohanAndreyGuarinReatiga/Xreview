import { Router } from "express";
import { exportarResenasCtrl } from "../controllers/exportacionController";
const router = Router();
router.post("/", exportarResenasCtrl)

export default router;