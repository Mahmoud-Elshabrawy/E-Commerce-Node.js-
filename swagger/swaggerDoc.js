const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const swaggerPath = path.join(__dirname, 'swagger.yml'); 
let swaggerDocument;

try {
  const file = fs.readFileSync(swaggerPath, 'utf8');
  swaggerDocument = yaml.load(file);
} catch (err) {
  console.error('Failed to load swagger.yml:', err);
  swaggerDocument = {}; // safety fallback
}

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
