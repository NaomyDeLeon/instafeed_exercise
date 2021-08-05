const yup = async (jsonObject, jsonRules) => {
    const yupConfig = { abortEarly: false };
    const result = await jsonRules
        .validate(jsonObject, yupConfig)
        .catch((err) => err);
    if (result.errors) return result.errors;
    return undefined;
};

const manually = async (jsonObject, jsonRules) => {
    const result = await new Promise((resolve) => {
        const errors = [];
        Object.keys(jsonRules).forEach((jsonKey) => {
            let validationResult;
            const { rule } = jsonRules[jsonKey];
            const { dependencyRule } = jsonRules[jsonKey];
            const value = jsonObject[jsonKey];
            if (rule) {
                validationResult = rule(value);
                if (validationResult !== null) errors.push(validationResult);
            }
            if (dependencyRule) {
                const { dependencyField } = jsonRules[jsonKey];
                validationResult = dependencyRule(
                    value,
                    jsonObject[dependencyField]
                );
                if (validationResult !== null) errors.push(validationResult);
            }
        });
        resolve(errors);
    });
    return result;
};

const evaluateResult = (result) => {
    if (result && result.length > 0) {
        console.error('Validation failed', result);
        return false;
    }
    console.info('Validation passed');
    return true;
};
const validate = async (jsonObject, jsonRules, validator) => {
    try {
        const validationResult = await validator(jsonObject, jsonRules);
        const result = evaluateResult(validationResult);
        return result;
    } catch (err) {
        console.error(err);
        return false;
    }
};

const JSONvalidator = {
    validateManually: (object, rules) => validate(object, rules, manually),
    validateWithYup: (object, rules) => validate(object, rules, yup),
};

module.exports = JSONvalidator;
