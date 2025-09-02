import { Router } from "express";
import { registrar, login } from "../controllers/usuarioController.js";
import {
  validarLogin,
  validarRegistro,
  validarCampos,
} from "../middlewares/validar.js";

const router = Router();

router.post(
  "/register",
  /*  
    #swagger.tags = ["Auth"]
    #swagger.summary = "Registrar usuario"
    #swagger.description = "Permite crear un nuevo usuario en la aplicación."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UsuarioRegistro"
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "Usuario creado exitosamente"
    }
  */
  validarRegistro,
  validarCampos,
  registrar
);
router.post(
  "/login",
  /*  
    #swagger.tags = ["Auth"]
    #swagger.summary = "Iniciar sesión"
    #swagger.description = "Permite autenticar un usuario y obtener un token JWT."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UsuarioLogin"
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Inicio de sesión exitoso, devuelve token JWT"
    }
  */
  validarLogin,
  validarCampos,
  login
);

export default router;
