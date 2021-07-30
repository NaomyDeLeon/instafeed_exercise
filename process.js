const fs = require('fs');
const schemaRules = require('./articleSchemaRules');
const JSONvalidator = require('./validation');

const enconding = 'utf8';
const fileLocation = './article.json';

function validationHandler(article) {
    console.info('Starting validation with manual handler');
    const articleIsValid = JSONvalidator.validate(article, schemaRules.manual);
    console.log(articleIsValid);
}

function yupValidationHandler(articleJSON) {
    console.info('Starting validation with yup handler');
    JSONvalidator.validateWithYup(articleJSON, schemaRules.yup).then(
        (articleIsValid) => console.log(articleIsValid)
    );
}

function startJSONValidation(jsonValidatorHandler) {
    fs.readFile(fileLocation, enconding, (err, jsonString) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }
        try {
            const article = JSON.parse(jsonString);
            jsonValidatorHandler(article);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    });
}

startJSONValidation(yupValidationHandler);
startJSONValidation(validationHandler);
