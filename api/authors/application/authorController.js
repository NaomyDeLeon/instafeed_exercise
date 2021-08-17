let logger;
let repository;
let validator;
const getAuthors = async (req, res) => {
    const authors = await repository.getAuthors();
    res.send(authors);
    logger(req, res, authors);
    res.end();
};

const findAuthor = async (req, res) => {
    const authorId = req.params.id;
    const search = await repository.findAuthor(authorId);
    if (search.success) res.send(search.data);
    else {
        res.status(404);
        res.send(search);
    }
    logger(req, res, search);
    res.end();
};

const createAuthor = async (req, res) => {
    const validation = await validator(req.body);
    if (validation.isValid) {
        const creation = await repository.createAuthor(req.body);
        if (creation.success) res.status(201);
        else res.status(400);
        res.send(creation);
        logger(req, res, creation);
    } else {
        res.status(400);
        res.send(validation.errors);
        logger(req, res, validation);
    }
    res.end();
};

const deleteAuthor = async (req, res) => {
    const authorId = req.params.id;
    const deletion = await repository.deleteAuthor(authorId);
    if (deletion.success) res.status(204);
    else {
        res.status(404);
        res.send(deletion);
    }
    logger(req, res, deletion);
    res.end();
};

const updateAuthor = async (req, res) => {
    const authorId = req.params.id;
    const validation = await validator(req.body);
    if (validation.isValid) {
        const update = await repository.updateAuthor(authorId, req.body);
        if (update.success) res.status(200);
        else res.status(404);
        res.send(update);
        logger(req, res, update);
    } else {
        res.status(400);
        res.send(validation.errors);
        logger(req, res, validation);
    }
    res.end();
};

module.exports = (config) => {
    validator = config.validator;
    repository = config.repository;
    logger = config.logger;
    return {
        getAuthors,
        findAuthor,
        createAuthor,
        deleteAuthor,
        updateAuthor,
    };
};
