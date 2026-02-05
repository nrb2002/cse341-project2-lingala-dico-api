const swaggerAutogen = require('swagger-autogen')(); //import swagger package

//Build the documentation

const doc = {
    info: {
        title: 'English-Lingala Dictionary API Documentation',
        version: "1.0.0",
        description: 'This is a bilingual (English-Lingala) dictionary API. It provides words translations from English to Lingala and vice versa, and examples of common usage.',
    },
    host: process.env.NODE_ENV === 'production' ? 'cse341-project1-baron.onrender.com' : 'localhost:3000',
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http']

};

const outputFile = './swagger.json';
const endpointFiles = ['../server.js']; //get all endpoint files via the server to avoid routes confusion

swaggerAutogen(outputFile, endpointFiles, doc) //Generates the documentation

