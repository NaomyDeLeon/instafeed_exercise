const fs = require('fs');
const schemaRules = require('./articleSchemaRules');
const JSONvalidator = require('./validation');

const encoding = 'utf8';
const fileLocation = './article.json';

const getStringToSave = (fileName, newContent) => {
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
};

const writeOnFile = async (fileName, content) => {
    console.info(`Writing on ${fileName}`, content);
    const line = getStringToSave(fileName, content);
    try {
        // flag a para permitir concatenar o crear el archivo en caso de no existir
        await fs.promises
            .writeFile(fileName, line, { encoding })
            .then(() => console.info('file written'));
    } catch (err) {
        console.err(err);
    }
};

const validationHandler = async (articleJSON) => {
    console.info('Starting validation with manual handler');
    const articleIsValid = await JSONvalidator.validateManually(
        articleJSON,
        schemaRules.manual
    );
    return articleIsValid;
};

const yupValidationHandler = async (articleJSON) => {
    console.info('Starting validation with yup handler');
    const articleIsValid = await JSONvalidator.validateWithYup(
        articleJSON,
        schemaRules.yup
    );
    return articleIsValid;
};

const startJSONValidation = async (jsonValidatorHandler) => {
    try {
        const fileContent = fs.readFileSync(fileLocation, encoding);
        const articleJSON = JSON.parse(fileContent);
        const articleIsValid = await jsonValidatorHandler(articleJSON);
        const fileName = articleIsValid ? 'db.json' : 'invalid.json';
        await writeOnFile(fileName, articleJSON);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

const startJSONValidationWithPromises = async (validatorHandler) => {
    return fs.promises
        .readFile(fileLocation, encoding)
        .then((fileContent) => JSON.parse(fileContent))
        .then(async (articleJSON) => {
            return {
                articleJSON,
                isValid: await validatorHandler(articleJSON),
            };
        })
        .then(async (articleData) => {
            const fileName = articleData.isValid ? 'db.json' : 'invalid.json';
            await writeOnFile(fileName, articleData.articleJSON);
        })
        .catch((err) => console.error(`Error: ${err}`));
};

const startValidations = async () => {
    await startJSONValidation(validationHandler);
    await startJSONValidation(yupValidationHandler);
    console.info('First process finished', 'Launching promises');
    startJSONValidationWithPromises(yupValidationHandler)
        .then(() => startJSONValidationWithPromises(validationHandler))
        .finally(() => console.log('Promises process finished'));
};

startValidations();
