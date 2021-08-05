const fs = require('fs');

const schemaRules = require('./articleSchemaRules');
const JSONvalidator = require('./validation');

const encoding = 'utf8';
const fileLocation = './article.json';

function getStringToSave(fileName, newContent) {
    try {
        const fileContent = fs.readFileSync(fileName, { encoding });
        const jsonDB = JSON.parse(fileContent);
        if (jsonDB.length === 0) {
            return `[${JSON.stringify(newContent)}]`;
        }
        jsonDB.push(newContent);
        return JSON.stringify(jsonDB);
    } catch (err) {
        return `[${JSON.stringify(newContent)}]`;
    }
}

function writeOnFile(fileName, content) {
    console.info(`Writing on ${fileName}`, content);
    const line = getStringToSave(fileName, content);
    try {
        // flag a para permitir concatenar o crear el archivo en caso de no existir
        fs.writeFileSync(fileName, line, { encoding });
        console.info('file written');
    } catch (err) {
        console.err(err);
    }
}

async function validationHandler(articleJSON) {
    console.info('Starting validation with manual handler');
    const articleIsValid = await JSONvalidator.validateManually(
        articleJSON,
        schemaRules.manual
    );
    return articleIsValid;
}

async function yupValidationHandler(articleJSON) {
    console.info('Starting validation with yup handler');
    const articleIsValid = await JSONvalidator.validateWithYup(
        articleJSON,
        schemaRules.yup
    );
    return articleIsValid;
}

async function startJSONValidation(jsonValidatorHandler) {
    try {
        const fileContent = fs.readFileSync(fileLocation, encoding);
        const articleJSON = JSON.parse(fileContent);
        const articleIsValid = await jsonValidatorHandler(articleJSON);
        const fileName = articleIsValid ? 'db.json' : 'invalid.json';
        writeOnFile(fileName, articleJSON);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function startJSONValidationWithPromises(jsonValidatorHandler) {
    return fs.promises
        .readFile(fileLocation, encoding)
        .then((fileContent) => JSON.parse(fileContent))
        .then(async (articleJSON) => {
            return {
                articleJSON,
                isValid: await jsonValidatorHandler(articleJSON),
            };
        })
        .then((articleData) => {
            const fileName = articleData.isValid ? 'db.json' : 'invalid.json';
            writeOnFile(fileName, articleData.articleJSON);
        })
        .catch((err) => console.error(`Error: ${err}`));
}

async function startValidations() {
    await startJSONValidation(validationHandler);
    await startJSONValidation(yupValidationHandler);
    console.info('First process finished', 'Launching promises');
    startJSONValidationWithPromises(yupValidationHandler)
        .then(() => startJSONValidationWithPromises(validationHandler))
        .finally(() => console.log('Promises process finished'));
}

startValidations();
