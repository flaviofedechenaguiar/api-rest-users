const app = require('../src/index.js');
const supertest = require('supertest');
const request = supertest(app);

    test('Deve retornar o status 200', () => {
        return request.get('/users').then(res => {
            expect(res.statusCode).toEqual(200);
        }).catch(err => {
            fail(err);
        });
    })



