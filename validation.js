const yup = async (object, rules) => {
    const yupConfig = { abortEarly: false };
    const result = await rules.validate(object, yupConfig).catch((err) => err);
    if (result.errors) return result.errors;
    return undefined;
};

const manually = async (object, rules) => {
    const result = await new Promise((resolve) => {
        const errors = [];
        Object.keys(rules).forEach((jsonKey) => {
            const { rule } = rules[jsonKey];
            const { dependencyRule } = rules[jsonKey];
            const value = object[jsonKey];
            if (rule) {
                const validationResult = rule(value);
                if (validationResult !== null) errors.push(validationResult);
            }
            if (dependencyRule) {
                const { dependencyField } = rules[jsonKey];
                const validationResult = dependencyRule(
                    value,
                    object[dependencyField]
                );
                if (validationResult !== null) errors.push(validationResult);
            }
        });
        resolve(errors);
    });
    return result;
};

const evaluateResult = (errors) => {
    if (errors && errors.length > 0) {
        console.error('Validation failed', errors);
        return false;
    }
    console.info('Validation passed');
    return true;
};

const validate = async (object, rules, validator) => {
    try {
        const errors = await validator(object, rules);
        const result = evaluateResult(errors);
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
