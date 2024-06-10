// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Basic for Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Stripe Payment API',
            version: '1.0.0',
            description: 'API documentation for the Stripe Payment API'
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1'
            }
        ]
    },
    apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
