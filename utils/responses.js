export function exitosoResponse(res, data, message = "Operación exitosa") {
    return res.status(200).json({ message, data });
  }
  
  export function errorResponse(res, error, statusCode = 500) {
    return res.status(statusCode).json({
      message: error.message || "Error interno del servidor",
    });
  }