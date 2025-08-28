import { Router } from "express";
import passport from "passport";
import { crearReseniaCtrl, editarReseniaCtrl  } from "../controllers/reseniaController.js";

const router = Router()

router.post("/post", passport.authenticate("jwt", { session: false }), crearReseniaCtrl)

// Editar reseña solo el que la hizo`
router.put("/editar/:id", passport.authenticate("jwt", { session: false }), editarReseniaCtrl);


export default router;