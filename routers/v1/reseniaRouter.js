import { Router } from "express";
import { crearReseniaCtrl, editarReseniaCtrl  } from "../../controllers/reseniaController.js";

const router = Router()

router.post("/post", crearReseniaCtrl)

// Editar reseña solo el que la hizo`
router.put("/editar/:id", editarReseniaCtrl);


  export default router;