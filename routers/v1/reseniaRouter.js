import { Router } from "express";
import { body, param} from "express-validator";
import {validarCampos} from "../../middlewares/validar.js";
import { crearReseniaCtrl } from "../../controllers/reseniaController.js";

const router = Router()

router.post("/", [
    body("tituloId").isMongoId().withMessage("El campo 'tituloId' debe ser un ObjectId válido"),
    body("encabezado")
      .isString()
      .isLength({ min: 1, max: 100 })
      .withMessage("El encabezado es obligatorio (máx. 100 caracteres)"),
    body("comentario")
      .isString()
      .isLength({ min: 1, max: 1000 })
      .withMessage("El comentario es obligatorio (máx. 1000 caracteres)"),
    body("calificacion")
      .isInt({ min: 1, max: 10 })
      .withMessage("La calificación debe ser un número entero entre 1 y 10"),
    validarCampos,
  ],
  crearReseniaCtrl)

  export default router;