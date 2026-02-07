const swaggerAutogen = require('swagger-autogen')(); // import swagger package

const doc = {
  info: {
    title: 'Lingala Dico API',
    version: '1.0.0',
    description: 'Bilingual dictionary API: English ↔ Lingala translations with usage examples.',
  },
  host:
    process.env.NODE_ENV === 'production'
      ? 'cse341-project2-lingala-dico-api.onrender.com'
      : 'localhost:3000',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],

  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description:
        'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"',
    },
  },

};

const outputFile = './swagger.json';
const endpointFiles = ['../server.js']; // include your server/routes files

swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
  console.log('Swagger documentation generated.');
});
