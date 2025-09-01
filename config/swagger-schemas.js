export const swaggerComponents = {
  components: {
    schemas: {
      UsuarioRegistro: {
        type: "object",
        required: ["email", "password", "apodo", "rol"],
        properties: {
          email: { type: "string", format: "email", example: "usuario@mail.com" },
          password: { type: "string", example: "123456" },
          apodo: { type: "string", minLength: 3, maxLength: 20, example: "OtakuLover" },
          rol: { type: "string", enum: ["usuario", "administrador"], example: "usuario" },
        },
      },
      UsuarioLogin: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "usuario@mail.com" },
          password: { type: "string", example: "123456" },
        },
      },
      UsuarioEditar: {
        type: "object",
        properties: {
          apodo: { type: "string", example: "NuevoNick" },
          rol: { type: "string", enum: ["usuario", "administrador"] },
        },
      },
      TituloCrear: {
        type: "object",
        required: ["titulo", "tipo", "descripcion", "categoria", "anio"],
        properties: {
          titulo: { type: "string", example: "Naruto Shippuden" },
          tipo: { type: "string", enum: ["pelicula", "serie", "anime"] },
          descripcion: { type: "string", example: "Un ninja busca convertirse en Hokage." },
          categoria: { type: "string", enum: ["Accion", "Drama", "Comedia", "Ciencia", "Ficcion", "Terror", "Fantasia"] },
          anio: { type: "integer", minimum: 1800, example: 2007 },
          aprobado: { type: "boolean", example: false },
          creadoPor: { type: "string", format: "objectId", example: "64a3c56a9a1f5e22d5eaa111" },
          estadisticas: {
            type: "object",
            properties: {
              promedioCalificacion: { type: "number", example: 8.7 },
              sumaCalificaciones: { type: "integer", example: 560 },
              meGusta: { type: "integer", example: 320 },
              noMeGusta: { type: "integer", example: 45 },
              totalResenas: { type: "integer", example: 100 },
              ranking: { type: "number", example: 9.2 },
            },
          },
        },
      },
      ReseniaCrear: {
        type: "object",
        required: ["tituloId", "usuarioId", "encabezado", "comentario", "calificacion"],
        properties: {
          tituloId: { type: "string", format: "objectId", example: "64a3c56a9a1f5e22d5eaa222" },
          usuarioId: { type: "string", format: "objectId", example: "64a3c56a9a1f5e22d5eaa333" },
          encabezado: { type: "string", maxLength: 100, example: "¡Increíble anime!" },
          comentario: { type: "string", maxLength: 1000, example: "Me encantó el desarrollo de personajes." },
          calificacion: { type: "integer", minimum: 1, maximum: 10, example: 9 },
          meGusta: { type: "array", items: { type: "string", format: "objectId" }, example: ["64a3c56a9a1f5e22d5eaa444"] },
          noMeGusta: { type: "array", items: { type: "string", format: "objectId" }, example: [] },
        },
      },
    },
  },
};
