export default {
  usuarios: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "email",
        "contraseña",
        "apodo",
        "rol",
      ],
      properties: {
        email: {
          bsonType: "string",
          description: "Correo electrónico del usuario",
          pattern: "^\\S+@\\S+\\.\\S+$",
        },
        contraseña: {
          bsonType: "string",
          description: "Contraseña encriptada con bcrypt",
        },
        apodo: {
          bsonType: "string",
          description: "Nombre público o nickname",
          minLength: 3,
          maxLength: 20,
        },
        rol: {
          enum: ["usuario", "administrador"],
          description: "Define permisos (usuario normal o administrador)",
        },
      },
    },
  },

  titulos: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "titulo",
        "tipo",
        "descripcion",
        "categoria",
        "anio",
        "aprobado",
        "creadoPor",
        "creadoEn",
      ],
      properties: {
        titulo: {
          bsonType: "string",
          description: "Nombre del título (único por categoría)",
          minLength: 1,
          maxLength: 150,
        },
        tipo: {
          enum: ["pelicula", "serie", "anime"],
          description: "Clasificación del título",
        },
        descripcion: {
          bsonType: "string",
          description: "Resumen de la obra",
          minLength: 10,
        },
        categoria: {
          enum: [
            "Acción",
            "Drama",
            "Comedia",
            "Ciencia",
            "Ficción",
            "Terror",
            "Fantasía",
          ],
          description: "Categoria del titulo",
        },
        anio: {
          bsonType: "int",
          minimum: 1800,
          description: "Año de estreno",
        },
        imagenUrl: {
          bsonType: ["string", "null"],
          description: "URL de la portada almacenada en Cloudinary",
          pattern: "^https://res\\.cloudinary\\.com/.+",
        },
        aprobado: {
          bsonType: "bool",
          description: "Indica si un administrador aprobó la obra",
        },
        estadisticas: {
          bsonType: "object",
          properties: {
            promedioCalificacion: { bsonType: "double" },
            meGusta: { bsonType: "int", minimum: 0 },
            noMeGusta: { bsonType: "int", minimum: 0 },
            totalResenas: { bsonType: "int", minimum: 0 },
            ranking: { bsonType: "double" },
          },
        },
      },
    },
  },

  resenia: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "tituloId",
        "usuarioId",
        "encabezado",
        "comentario",
        "calificacion",
      ],
      properties: {
        tituloId: {
          bsonType: "objectId",
          description: "Referencia al título reseñado",
        },
        usuarioId: {
          bsonType: "objectId",
          description: "ID del usuario que hizo la reseña",
        },
        encabezado: {
          bsonType: "string",
          description: "Título breve de la reseña",
          maxLength: 100,
        },
        comentario: {
          bsonType: "string",
          description: "Texto completo de la reseña",
          maxLength: 1000,
        },
        calificacion: {
          bsonType: "int",
          minimum: 1,
          maximum: 10,
          description: "Puntuación del 1 al 10",
        },
        meGusta: {
          bsonType: "array",
          description: "IDs de usuarios que dieron like",
          items: {
            bsonType: "objectId",
          },
          uniqueItems: true,
        },
        noMeGusta: {
          bsonType: "array",
          description: "IDs de usuarios que dieron dislike",
          items: {
            bsonType: "objectId",
          },
          uniqueItems: true,
        },
      },
    },
  },
};