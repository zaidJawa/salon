import swaggerJSDoc from 'swagger-jsdoc';


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 */

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Reservation System",
        version: "1.0.0",
        description: "API docs",
    },
    servers: [
        {
            url: `/api`,
            description: "Development server",
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: [
        "./src/routes/*.js",
        "./src/controller/*.js",
        "./src/routes/*.ts",
        "./src/controller/*.ts",
    ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec
