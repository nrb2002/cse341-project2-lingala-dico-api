const swaggerAutogen = require('swagger-autogen')(); //import swagger package

//Build the documentation

const doc = {
    info: {
        title: 'Lingala Dico API',
        version: "1.0.0",
        description: 'This is a bilingual dictionary API. It provides words translations from English to Lingala and vice versa, and examples of common usage.',
    },
    host: process.env.NODE_ENV === 'production' ? 'https://cse341-project2-lingala-dico-api.onrender.com' : 'localhost:3000',
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],    
    securityDefinitions: {
      roleAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-role',
        description: 'Role-based access: admin or moderator'
      }
    }

};

const outputFile = './swagger.json';
const endpointFiles = ['../server.js']; //get all endpoint files via the server to avoid routes confusion

swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
    console.log("Swagger documentation generated.");
}) //Generates the documentation

