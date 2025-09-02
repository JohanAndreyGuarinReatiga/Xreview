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
} from "../controllers/tituloController.js";
import { esAdmin } from "../middlewares/roles.js";

const router = Router();

//rutas protegidas(necesita estar logueado)
router.get(
  "/buscar/:titulo",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Buscar título por nombre"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['titulo'] = { description: "Nombre del título" }
  */
  passport.authenticate("jwt", { session: false }),
  obtenerTitulo
); // buscar por nombre exacto ✅

router.get(
  "/listar",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Listar títulos"
    #swagger.description = "Devuelve todos los títulos (solo aprobados si es usuario normal)."
    #swagger.security = [{ "bearerAuth": [] }]
  */
  passport.authenticate("jwt", { session: false }),
  listarTitulos
); // listar títulos (solo aprobados si es usuario normal) (si)

router.get(
  "/filtros",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Listar títulos con filtros"
    #swagger.security = [{ "bearerAuth": [] }]
  */
  passport.authenticate("jwt", { session: false }),
  listarConFiltros
); // filtros dinámicos  ✅

router.get(
  "/paginado",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Listar títulos paginados"
    #swagger.security = [{ "bearerAuth": [] }]
  */
  passport.authenticate("jwt", { session: false }),
  listarTituloPaginado
); // paginado

router.get(
  "/buscarTexto",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Búsqueda por texto"
    #swagger.security = [{ "bearerAuth": [] }]
  */
  passport.authenticate("jwt", { session: false }),
  busquedaTexto
); // búsqueda por texto (no sirve)

router.get(
  "/top",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Top ranking"
    #swagger.security = [{ "bearerAuth": [] }]
  */
  passport.authenticate("jwt", { session: false }),
  topRanking
); // top ranking

router.get(
  "/masGustados",
   /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Más gustados"
    #swagger.security = [{ "bearerAuth": [] }]
  */
  passport.authenticate("jwt", { session: false }),
  masMeGustas
); // más gustados

router.get(
  "/personalList/:usuarioId",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Lista personal de títulos"
    #swagger.parameters['usuarioId'] = { description: "ID del usuario" }
    #swagger.security = [{ "bearerAuth": [] }]
  */
  passport.authenticate("jwt", { session: false }),
  listaDeUsuario
); // títulos de un usuario

router.post(
  "/crear",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Crear nuevo título"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/TituloCrear" }
        }
      }
    }
  */
  passport.authenticate("jwt", { session: false }),
  crearTitulo
); // crear un nuevo titulo

//Rutas de solo admin
router.put(
  "/editar/:id",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Editar título"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID del título a editar" }
  */
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  editarTitulo
); //editar titulo(solo admin)

router.delete(
  "/delete/:id",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Eliminar título"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID del título a eliminar" }
  */
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  eliminarTitulo
); // borrar titulo (solo admin)

router.patch(
  "/aprobar/:id",
  /*  
    #swagger.tags = ["Títulos"]
    #swagger.summary = "Aprobar título"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = { description: "ID del título a aprobar" }
  */
  passport.authenticate("jwt", { session: false }),
  esAdmin,
  aprobarTitulo
); // aprobar un nuevo titulo (solo admin)

export default router;
