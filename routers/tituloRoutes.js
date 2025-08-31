import { Router } from "express";
import passport from "passport";
import {
  crearTitulo,
  listarTitulos,
  editarTitulo,
  eliminarTitulo,
  obtenerTitulo,
  aprobarTitulo,
  listarConFiltros,
  listarTituloPaginado,
  busquedaTexto,
  topRanking,
  masMeGustas,
  listaDeUsuario,
  darMeGusta,
  darNoMeGusta,
  calificarTitulo,
  deshacerlike,
  deshacerDislike,
} from "../controllers/tituloController.js";
import { upload } from "../middlewares/upload.js";
import { esAdmin } from "../middlewares/roles.js";

const router = Router();


//rutas protegidas(necesita estar logueado)
router.get("/buscar/:titulo",passport.authenticate("jwt", { session: false }), obtenerTitulo); // buscar por nombre exacto (si) ✅
router.get("/listar",passport.authenticate("jwt", { session: false }), listarTitulos); // listar títulos (solo aprobados si es usuario normal) (si) 
router.get("/filtros",passport.authenticate("jwt", { session: false }),listarConFiltros); // filtros dinámicos (si) ✅
router.get("/paginado",passport.authenticate("jwt", { session: false }),listarTituloPaginado ); // paginado
router.get("/buscarTexto",passport.authenticate("jwt", { session: false }), busquedaTexto); // búsqueda por texto (no sirve)
router.get("/top",passport.authenticate("jwt", { session: false }),topRanking); // top ranking 
router.get("/masGustados",passport.authenticate("jwt", { session: false }),masMeGustas); // más gustados
router.get("/personalList/:usuarioId",passport.authenticate("jwt", { session: false }),listaDeUsuario) // títulos de un usuario
router.post("/crear",passport.authenticate("jwt", { session: false }), upload.single("imagen"),crearTitulo); // crear un nuevo titulo
router.post("/:id/calificar",passport.authenticate("jwt", { session: false }),calificarTitulo) // calificar titulo
router.post("/:id/like",passport.authenticate("jwt", { session: false }),darMeGusta) // dar me gusta
router.delete("/:id/quitarlike",passport.authenticate("jwt", { session: false }),deshacerlike)
router.post("/:id/dislike",passport.authenticate("jwt", { session: false }),darNoMeGusta) //dar no me gusta 
router.delete("/:id/quitardislike",passport.authenticate("jwt", { session: false }),deshacerDislike)

//Rutas de solo admin
router.put("/editar/:id",passport.authenticate("jwt", { session: false }),esAdmin,editarTitulo); //editar titulo(solo admin)
router.delete("/delete/:id",passport.authenticate("jwt", { session: false }),esAdmin,eliminarTitulo);// borrar titulo (solo admin)
router.patch("/aprobar/:id",passport.authenticate("jwt", { session: false }),esAdmin,aprobarTitulo);// aprobar un nuevo titulo (solo admin)


export default router;