const app = require('../src/index.js');
const supertest = require('supertest');
const request = supertest(app);

describe('Teste do servidor para ver se está rodando', () => {
    test('Deve retornar o status 403', () => {
        return request.post('/auth').then(res => {
            expect(res.statusCode).toEqual(401);
        }).catch(err => {
            fail(err);
        });
    })
});




