import { Router } from "express";
import passport from "passport";
import { crearReseniaCtrl, editarReseniaCtrl, eliminarReseniaCtrl, likeReseniaCtrl, dislikeReseniaCtrl, listarReseniasCtrl  } from "../controllers/reseniaController.js";

const router = Router()

router.post("/post", passport.authenticate("jwt", { session: false }), crearReseniaCtrl)

// Editar reseña solo el que la hizo`
router.put("/editar/:id", passport.authenticate("jwt", { session: false }), editarReseniaCtrl);

router.delete("/eliminar/:id", passport.authenticate("jwt", { session: false }), eliminarReseniaCtrl)

router.post("/like/:id", passport.authenticate("jwt", { session: false }), likeReseniaCtrl);
  
router.post("/dislike/:id", passport.authenticate("jwt", { session: false }), dislikeReseniaCtrl);

router.get("/", passport.authenticate("jwt", { session: false }), listarReseniasCtrl);
  
export default router;