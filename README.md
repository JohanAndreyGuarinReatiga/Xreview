# Backend de XReview

XReview es una plataforma integral para la comunidad geek, diseñada para que los usuarios puedan registrar, calificar y rankear sus películas, animes y series favoritas. Este proyecto se ha desarrollado como una aplicación full-stack, con un backend robusto en Node.js, Express y MongoDB que gestiona toda la lógica de negocio, la persistencia de datos y la seguridad, y un frontend en HTML, CSS y JavaScript puro que consume la API.

El objetivo principal es proporcionar una herramienta que permita a los usuarios interactuar con contenido multimedia geek de una manera dinámica y estructurada, ofreciendo funcionalidades clave como gestión de usuarios y roles (usuario/administrador), gestión de reseñas y un sistema de ranking ponderado.

## 💻 Tecnologías Utilizadas
Este proyecto backend está construido con las siguientes tecnologías clave, garantizando un rendimiento y seguridad óptimos:

- **Node.js:** Entorno de ejecución para el desarrollo del backend.

- **Express:** Framework de Node.js para la creación de la API RESTful.

- **MongoDB:** Base de datos NoSQL para la persistencia de los datos, utilizando el driver oficial para un control total sobre las operaciones.

- **JWT (JSON Web Tokens):** Para la autenticación segura de usuarios.

- **Bcrypt:** Para el hashing de contraseñas, garantizando su almacenamiento seguro.

- **Passport.js**: Middleware de autenticación, específicamente passport-jwt, para manejar la estrategia de autenticación basada en JWT.

- **Express-rate-limit:** Middleware para limitar las peticiones y proteger contra ataques de fuerza bruta o abuso de la API.

- **Express-validator:** Middleware para validar y sanear los datos de entrada en los endpoints.

- **Dotenv:** Para gestionar de forma segura las variables de entorno.

- **Swagger-ui-express:** Para la documentación interactiva de la API.

- **Semver:** Para el versionado semántico de la API.

## 🚀 Instalación y Uso
Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local.

 ### Prerrequisitos
Asegúrate de tener instalados:

- ``Node.js``: Versión 16.x o superior.

- ``npm``: El gestor de paquetes de Node.js.

- ``MongoDB``: El servidor de base de datos de MongoDB.

#### Pasos

1. **Clonar el repositorio:**

```Bash
git clone https://github.com/JohanAndreyGuarinReatiga/Xreview.git
```
2. **Instalar dependencias:**

```Bash
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo ``.env`` en la raíz del proyecto. Este archivo es crucial para la configuración. Debe contener las siguientes variables:

```Code snippet
# Variables de entorno para la aplicación
PORT=[El puerto en el que se ejecutará el servidor, por ejemplo, 5500]
DB_URI=[Tu cadena de conexión a MongoDB]
DB_NAME=[Nombre que escojas para la base de datos]
JWT_SECRET=[Una clave secreta para firmar los JWT]
JWT_EXPIRES_IN=[Tiempo de duracion de JWT]
```

4. **Iniciar el servidor:**

```Bash
npm run dev
```
El servidor se iniciará en el puerto especificado en tu archivo ``.env``.

## 🏛️ Estructura del Proyecto
El proyecto sigue una arquitectura modular y escalable, con la lógica de negocio bien separada en diferentes directorios. Esto facilita la mantenibilidad y el crecimiento. La estructura principal es la siguiente:
```
├── config/             # Archivos de configuración de la base de datos y la autenticación
├── controllers/        # Lógica de negocio de los endpoints
├── middlewares/        # Middlewares para la validación de roles y la autenticación
├── models/             # Esquemas de la base de datos para las colecciones
├── routers/            # Definición de las rutas de la API
├── services/           # Lógica de negocio reutilizable y específica
├── utils/              # Funciones de utilidad y manejo de respuestas
├── .env                # Variables de entorno
├── app.js              # Archivo principal de la aplicación
├── package.json        # Dependencias y scripts
└── server.js           # Archivo de inicio del servidor
```

## 📜 Documentación de la API
La API de XReview está completamente documentada utilizando **Swagger UI**. Puedes acceder a la documentación interactiva en tu navegador una vez que el servidor esté en ejecución. Simplemente navega a la siguiente URL:

http://localhost:[PUERTO]/api-docs

Aquí encontrarás una lista de todos los endpoints, sus parámetros, los cuerpos de las solicitudes (request bodies) y los posibles códigos de respuesta HTTP, lo que te permitirá probar la API de forma sencilla.

## 🔗 Repositorio del Frontend
El frontend de esta aplicación, desarrollado en HTML, CSS y JavaScript puro, se encuentra en un repositorio separado. Puedes acceder a él a través del siguiente enlace:

[\[Link al repositorio del frontend\]](https://github.com/JohanAndreyGuarinReatiga/XreviewFront.git)

## 📝 Documentación del Proyecto (SCRUM)
El desarrollo de este proyecto se llevó a cabo utilizando la metodología SCRUM. La planificación detallada, los roles del equipo, la definición de los sprints y las historias de usuario se encuentran documentadas en el siguiente archivo PDF, adjunto en la raíz de este repositorio:

[nombre_del_documento.pdf](/Guía_SCRUM_Xreview.docx.pdf)

## 👥 Créditos
Este proyecto fue desarrollado por el equipo:

Jose Julian Ortega Navarro - Rol asignado (ej. Scrum Master)

Johan Andrey Guarin - Rol asignado (ej. Product Owner)
