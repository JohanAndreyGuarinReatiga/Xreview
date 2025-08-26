import { ServicioResenias } from "../services/reseniaServ.js";
import { exitosoResponse, errorResponse } from "../utils/responses.js";

export const crearReseniaCtrl = async (req, res) => {
  try {
    const reseña = await ServicioResenias.crearResenia({
      ...req.body,
      usuarioId: req.user._id, // tomado del JWT
    });
    return exitosoResponse(res, reseña, "Reseña creada correctamente");
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};