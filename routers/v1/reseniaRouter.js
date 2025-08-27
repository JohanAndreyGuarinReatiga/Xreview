import { Router } from "express";
import { body, param} from "express-validator";
import {validarCampos} from "../../middlewares/validar.js";
import { crearReseniaCtrl, editarReseniaCtrl  } from "../../controllers/reseniaController.js";

const router = Router()

router.post("/post", crearReseniaCtrl)

// Editar reseña
router.put("/:id", editarReseniaCtrl);


  export default router;