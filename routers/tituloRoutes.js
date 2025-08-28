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
  estadisticasActualizadas,
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
import { esAdmin } from "../middlewares/roles.js";

const router = Router();

// rutas publicas
router.get("/listar", listarTitulos); // listar títulos (solo aprobados si es usuario normal)
router.get("/buscar/:titulo", obtenerTitulo); // buscar por nombre exacto

//rutas protegidas(necesita estar logueado)
router.get("/filtros",passport.authenticate("jwt", { session: false }),listarConFiltros); // filtros dinámicos
router.get("/paginado",passport.authenticate("jwt", { session: false }),listarTituloPaginado ); // paginado
router.get("/buscarTexto",passport.authenticate("jwt", { session: false }), busquedaTexto); // búsqueda por texto
router.get("/top",passport.authenticate("jwt", { session: false }),topRanking); // top ranking
router.get("/masGustados",passport.authenticate("jwt", { session: false }),masMeGustas); // más gustados
router.get("/personalList/:usuarioId",passport.authenticate("jwt", { session: false }),listaDeUsuario) // títulos de un usuario
router.post("/crear",passport.authenticate("jwt", { session: false }),crearTitulo); // crear un nuevo titulo
router.post("/:id/like",passport.authenticate("jwt", { session: false }),darMeGusta) // dar me gusta
router.post("/:id/dislike",passport.authenticate("jwt", { session: false }),darNoMeGusta) //dar no me gusta 
router.post("/:id/calificar",passport.authenticate("jwt", { session: false }),calificarTitulo) // calificar titulo
router.delete("/:id/quitarlike",passport.authenticate("jwt", { session: false }),deshacerlike)
router.delete("/:id/quitardislike",passport.authenticate("jwt", { session: false }),deshacerDislike)

//Rutas de solo admin
router.put("/editar/:id",passport.authenticate("jwt", { session: false }),esAdmin,editarTitulo); //editar titulo(solo admin)
router.delete("/delete/:id",passport.authenticate("jwt", { session: false }),esAdmin,eliminarTitulo);// borrar titulo (solo admin)
router.patch("/aprobar/:id",passport.authenticate("jwt", { session: false }),esAdmin,aprobarTitulo);// aprobar un nuevo titulo (solo admin)


export default router;
