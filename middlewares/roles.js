// validar que el rol del usuario es admin para permitir solo admin en ciertos endpoints
export function esAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.user.rol !== "administrador") {
    return res.status(403).json({ error: "Solo administradores pueden acceder" });
  }
  next();
}
