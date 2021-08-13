let validationsRules;

// no implementado aún
const validateSchema = async (req, res, next) => {
    const { method } = req;
    if (method !== 'GET' && method !== 'DELETE') {
        const { path } = req;
        const rulesToApply = validationsRules[path];
        const validation = await rulesToApply.validator(req.body, 'web');
        if (validation.isValid) next();
        else {
            res.status(400);
            res.send(validation.errors);
        }
    }
};

module.exports = (rules) => {
    validationsRules = rules;
    return { validateSchema };
};
