const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger/swagger.json');

//Swagger route
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;