import { Router } from "express";
import passport from "passport";
import { crearReseniaCtrl, editarReseniaCtrl, eliminarReseniaCtrl  } from "../controllers/reseniaController.js";

const router = Router()

router.post("/post", passport.authenticate("jwt", { session: false }), crearReseniaCtrl)

// Editar reseña solo el que la hizo`
router.put("/editar/:id", passport.authenticate("jwt", { session: false }), editarReseniaCtrl);

router.delete("/eliminar/:id", passport.authenticate("jwt", { session: false }), eliminarReseniaCtrl)

export default router;