async function validateWithYup(jsonObject, jsonRules) {
    try {
        const result = await jsonRules
            .validate(jsonObject, { abortEarly: false })
            .catch((err) => err);
        if (result.errors) {
            console.info('Validation failed');
            console.error(result.errors);
            return false;
        }
        console.info('Validation passed');
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function validate(jsonObject, jsonRules) {
    const result = await new Promise((resolve) => {
        try {
            const errors = [];
            let jsonIsValid = true;
            Object.keys(jsonRules).forEach((jsonKey) => {
                let validationResult;
                const { rule } = jsonRules[jsonKey];
                const { dependencyRule } = jsonRules[jsonKey];
                const value = jsonObject[jsonKey];
                if (rule) {
                    validationResult = rule(value);
                    if (validationResult !== null) {
                        jsonIsValid = false;
                        errors.push(validationResult);
                    }
                }
                if (dependencyRule) {
                    const { dependencyField } = jsonRules[jsonKey];
                    validationResult = dependencyRule(
                        value,
                        jsonObject[dependencyField]
                    );
                    if (validationResult !== null) {
                        jsonIsValid = false;
                        errors.push(validationResult);
                    }
                }
            });
            if (!jsonIsValid) {
                console.info('Validation failed');
                console.error(errors);
                resolve(false);
                return;
            }
            console.info('Validation passed');
            resolve(true);
            return;
        } catch (err) {
            console.error(err);
            resolve(false);
        }
    });
    return result;
}

const JSONvalidator = {
    validate,
    validateWithYup,
};

module.exports = JSONvalidator;
