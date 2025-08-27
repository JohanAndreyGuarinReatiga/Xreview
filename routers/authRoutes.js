import { Router } from "express";
import { registrar, login } from "../controllers/usuarioController.js";
import {
  validarLogin,
  validarRegistro,
  validarCampos,
} from "../middlewares/validar.js";

const router = Router();

router.post("/register", validarRegistro, validarCampos, registrar);
router.post("/login", validarLogin, validarCampos, login);

export default router;
