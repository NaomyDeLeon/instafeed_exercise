const fs = require('fs');
const async = require('async');
const schemaRules = require('./articleSchemaRules');
const JSONvalidator = require('./validation');

const encoding = 'utf8';
const folderPath = './articles';

const getStringToSave = (fileName, newContent) => {
    let parsedString = JSON.stringify(newContent);
    if (!Array.isArray(newContent))
        parsedString = `${JSON.stringify(parsedString)}`;
    try {
        const fileContent = fs.readFileSync(fileName, { encoding });
        let jsonDB = JSON.parse(fileContent);
        if (jsonDB.length === 0) return parsedString;
        if (Array.isArray(newContent)) jsonDB = jsonDB.concat(newContent);
        else jsonDB.push(newContent);
        return JSON.stringify(jsonDB);
    } catch (err) {
        return parsedString;
    }
};

const writeOnFile = async (fileName, content, validatorName) => {
    console.info(`${validatorName} - Writing on ${fileName}`);
    const line = getStringToSave(fileName, content);
    // flag a para permitir concatenar o crear el archivo en caso de no existir
    await fs.promises
        .writeFile(fileName, line, { encoding })
        .then(() => {
            const msg = `${validatorName} - file ${fileName} written`;
            console.info(msg);
        })
        .catch((err) => console.err(err));
};

const articleValidationHandler = async (articleJSON, filename) => {
    console.info(`Starting validation with manual handler - file ${filename}`);
    const result = await JSONvalidator.validateManually(
        articleJSON,
        schemaRules.manual
    );
    return result;
};

const articleYupValidationHandler = async (articleJSON, filename) => {
    console.info(`Starting validation with yup handler - file ${filename}`);
    const result = await JSONvalidator.validateWithYup(
        articleJSON,
        schemaRules.yup
    );
    return result;
};

const configureParallel = (files, validator) => {
    const executions = [];
    files.forEach((file) => {
        console.log(`reading file ${file}`);
        const parallelExecution = (callback) => {
            fs.promises
                .readFile(`${folderPath}/${file}`)
                .then(async (fileContent) => {
                    const articleJson = JSON.parse(fileContent);
                    const result = await validator(articleJson, file);
                    callback(null, { isValid: result.isValid, articleJson });
                })
                .catch((err) => console.log(err));
        };
        executions.push(parallelExecution);
    });
    return executions;
};

const executeParallel = async (executions, validatorName) => {
    async.parallel(executions, async (err, results) => {
        const valids = results
            .filter((result) => result.isValid)
            .map((result) => result.articleJson);
        const invalids = results
            .filter((result) => !result.isValid)
            .map((result) => result.articleJson);
        await writeOnFile('db.json', valids, validatorName);
        await writeOnFile('invalid.json', invalids, validatorName);
        if (err) console.log(err);
        console.log(`${validatorName} finished`);
    });
};

const validateAll = (validator) => {
    return fs.promises
        .readdir(folderPath)
        .then((files) => configureParallel(files, validator))
        .then((config) => executeParallel(config, validator.name))
        .catch((err) => console.log(err))
        .finally(() => console.log('async process launched'));
};

module.exports = {
    articleYupValidationHandler,
    articleValidationHandler,
    validateAll,
};
