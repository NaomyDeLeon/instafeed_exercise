async function validateWithYup(jsonObject, jsonRules) {
    try {
        const result = await jsonRules
            .validate(jsonObject, { abortEarly: false })
            .catch((err) => err);
        if (result.errors) {
            console.log(result.errors);
            return false;
        }
        console.log('Validation passed');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

function validate(jsonObject, jsonRules) {
    const errors = [];
    let jsonIsValid = true;
    try {
        Object.keys(jsonRules).forEach((jsonKey) => {
            const { rule } = jsonRules[jsonKey];
            const { dependencyRule } = jsonRules[jsonKey];
            const value = jsonObject[jsonKey];
            let validationResult;
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
            console.log(errors);
            return false;
        }
        console.log('Validation passed');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const JSONvalidator = {
    validate,
    validateWithYup,
};

module.exports = JSONvalidator;
