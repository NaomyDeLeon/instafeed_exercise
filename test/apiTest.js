const assert = require('assert');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const request = require('supertest');
const config = require('../configs/default');
const passwordManager = require('../util/passwordManager');
const apiLogger = require('../api/middlewares/apiLogger');

const corsOptions = config.corsConfig;
const { tokenValidator } = require('../api/middlewares/security')(
    config.tokenSign
);
const db = require('../util/mongo')(config.defaultMongoURI);

const authorRouter = require('../api/authors/infrastucture/authorRouter')({
    router: express.Router(),
    logger: apiLogger.responseLogger,
    db,
});

const sessionRouter = require('../api/sessions/infrastucture/sessionRouter')({
    router: express.Router(),
    logger: apiLogger.responseLogger,
    db,
    passwordManager,
});

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(tokenValidator);
app.use(config.authorsPath, authorRouter);
app.use(config.sessionsPath, sessionRouter);

const user = { username: 'naomi.deleon', password: 'welcome1' };
const newAuthor = { name: 'testing' };
const newModifiredNewAuthor = { name: 'testing change' };
let token;
let newAuthorId;
/* eslint-disable no-undef */
const loginUser = () => {
    return (done) => {
        request(app)
            .post('/sessions')
            .send(user)
            .end((err, response) => {
                token = response.body.data;
                return done();
            });
    };
};

before(loginUser());

describe('apiValidator', () => {
    describe('author api validator', () => {
        it('should return the authors list', (done) => {
            request(app)
                .get('/authors')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    assert.equal(Array.isArray(res.body), true);
                    done();
                });
        });
        it('should return a succesfull status on author creation', (done) => {
            request(app)
                .post('/authors')
                .set('Accept', 'application/json')
                .set('Authorization', token)
                .send(newAuthor)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) throw err;
                    newAuthorId = res.body.id;
                    assert.equal(res.body.success, true);
                    done();
                });
        });
        it('should return a author data for specified id', (done) => {
            request(app)
                .get(`/authors/${newAuthorId}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    assert.equal(Array.isArray(res.body), true);
                    done();
                });
        });
        it('should return a succesfull status on author update', (done) => {
            request(app)
                .put(`/authors/${newAuthorId}`)
                .set('Accept', 'application/json')
                .set('Authorization', token)
                .send(newModifiredNewAuthor)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    assert.equal(res.body.success, true);
                    done();
                });
        });
        it('should return a succesfull status on author deletion', (done) => {
            request(app)
                .delete(`/authors/${newAuthorId}`)
                .set('Accept', 'application/json')
                .set('Authorization', token)
                .expect(204)
                .end(done);
        });
    });
});
