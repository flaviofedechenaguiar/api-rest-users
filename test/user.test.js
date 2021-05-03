const app = require('../src/index.js');
const supertest = require('supertest');
const request = supertest(app);

let mainUser = {
    name: 'hernesto',
    lastName: 'santos camargo',
    nickname: 'hernesto32',
    address: 'Rua dos Testers, n.3322, Umuarama-PR',
    bio: 'Eu sou um usuário para testes'
}

let genToken;

beforeAll(() => {
    return request.post('/users').send({ ...mainUser, nickname: new Date })
        .then(res => {
            mainUser = res.body.user_data;
        }).catch(err => {
            fail(err);
        })
});

beforeAll(() => {
    return request.post('/auth').send({ nickname: mainUser.nickname })
        .then(res => {
            genToken = res.body.token;
        })
        .catch(err => {
            fail(err);
        });
});

afterAll(() => {
    return request.delete(`/users/${mainUser.id}`)
        .set('Authorization', `Bearer ${genToken}`)
        .then((res) => { })
        .catch(err => {
            fail(err);
        });
});


describe('Post - JSONWebToken Authorization', () => {
    test('Deve retornar o status 200 e o Token', () => {
        return request.post('/auth').send({ nickname: mainUser.nickname })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined();
                genToken = res.body.token;
            })
            .catch(err => {
                fail(err);
            });
    });

    test('Deve retornar o status 403 quando não gerado o token', () => {
        return request.post('/auth').send({ nickname: new Date })
            .then(res => {
                expect(res.statusCode).toEqual(401);
                expect(res.body.error).toBeDefined();
            })
            .catch(err => {
                fail(err);
            })
    })

    test('Deve retornar o status 403 quando não gerado o token e nickname vazio', () => {
        return request.post('/auth').send({ nickname: '' })
            .then(res => {
                expect(res.statusCode).toEqual(401);
                expect(res.body.error).toBeDefined();
            })
            .catch(err => {
                fail(err);
            })
    })

});


describe('Post - Cadastro de usuário retorno de erros', () => {

    let localUser = {
        name: 'preenchido',
        lastName: 'preenchido',
        nickname: 'preenchido',
        address: 'preenchido',
        bio: 'preechido'
    }

    test('Deve retornar 400 para nome vazio', () => {
        let user = { ...localUser, name: '' };
        return request.post('/users')
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do nome');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para sobrenome vazio', () => {
        let user = { ...localUser, lastName: '' };
        return request.post('/users').send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do sobrenome');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para nickname vazio', () => {
        let user = { ...localUser, nickname: '' };
        return request.post('/users').send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do nickname');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para endereço vazio', () => {
        let user = { ...localUser, address: '' };
        return request.post('/users').send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do endereço');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para nickname presente na base de dados', () => {
        let user = { ...localUser, nickname: mainUser.nickname };
        return request.post('/users').send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('nickname já presente');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para nickname maior de 30 caracteres', () => {
        let user = { ...localUser, nickname: 'ce85b99cc46752fffee35cab9a7b0278abb4c2d2' };
        return request.post('/users').send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Máximo permitido são 30 caracteres para o nickname');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para bio maior de 100 caracteres', () => {
        let user = {
            ...localUser, bio:
                'SiJttmWyytNb7jNnr4DYqUrFv#!Alo&L@AfQo3bQ9NQp3bLTg7kDER7Vpp!oRGhsmGsWfc#Bf7xqm$0FF5hISVTwLLO@LfLKq$*Jj'
        }
        return request.post('/users').send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Máximo permitido são 100 caracteres para a bio');
            })
            .catch(err => {
                fail(err);
            })
    })

});


describe('Get - Retorno de dados', () => {

    test('Deve retornar status 200 com todos os usuários', () => {
        return request.get('/users')
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
            })
    });

    test('Deve retornar status 200 de acordo com a pesquisa por nome ou sobrenome', () => {
        return request.get(`/users?dataUser${mainUser.name}`)
            .set('Authorization', `Bearer ${genToken}`)
            .then((res) => {
                expect(res.statusCode).toEqual(200);
            })
            .catch(err => {
                fail(err);
            });
    });

    test('Deve retornar status 200 caso entrontrado o nickname', () => {
        return request.get(`/users/${mainUser.nickname}`)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
            })
            .catch(err => {
                fail(err);
            });
    })

    test('Deve retornar status 202 caso não encontrado o nickname', () => {
        return request.get(`/users/${new Date}`)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(202);
            })
            .catch(err => {
                fail(err);
            });
    })

});


describe('Post - Criação de usuário', () => {
    test('Deve retornar status 201 com os dados criados', () => {
        let newUser = {
            name: 'roberto',
            lastName: 'angelo costa',
            nickname: new Date(),
            address: 'Rua das Margaridas, n.2298, Maringá - PR',
            bio: 'testando a bio'
        }
        return request.post('/users').send(newUser).then(res => {
            expect(res.statusCode).toEqual(201);
        }).catch(err => {
            fail(err);
        });
    });
})

describe('Post - Update de usuário retorno de erros', () => {

    let localUser = {
        name: 'preenchido',
        lastName: 'preenchido',
        nickname: 'preenchido',
        address: 'preenchido',
        bio: 'preechido'
    }

    test('Deve retornar 400 para nome vazio', () => {
        let user = { ...localUser, name: '' };
        return request.post(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do nome');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para sobrenome vazio', () => {
        let user = { ...localUser, lastName: '' };
        return request.post(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do sobrenome');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para nickname vazio', () => {
        let user = { ...localUser, nickname: '' };
        return request.post(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do nickname');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para endereço vazio', () => {
        let user = { ...localUser, address: '' };
        return request.post(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do endereço');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para nickname presente na base de dados', () => {
        let userNickname = new Date;

        return request.post(`/users`).send({ ...mainUser, nickname: userNickname }).then(res => {
            let user = { ...localUser, nickname: userNickname };
            return request.post(`/users/${mainUser.id}`).send(user)
                .set('Authorization', `Bearer ${genToken}`)
                .then(res => {
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.error).toEqual('Nickname presente no sistema');
                })
                .catch(err => {
                    fail(err);
                })
        }).catch(err => {
            fail(err);
        });

    });

    test('Deve retornar 400 para nickname maior de 30 caracteres', () => {
        let user = { ...localUser, nickname: 'ce85b99cc46752fffee35cab9a7b0278abb4c2d2' };
        return request.post(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Máximo permitido são 30 caracteres para o nickname');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para bio maior de 100 caracteres', () => {
        let user = {
            ...localUser, bio:
                'SiJttmWyytNb7jNnr4DYqUrFv#!Alo&L@AfQo3bQ9NQp3bLTg7kDER7Vpp!oRGhsmGsWfc#Bf7xqm$0FF5hISVTwLLO@LfLKq$*Jj'
        }
        return request.post(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Máximo permitido são 100 caracteres para a bio');
            })
            .catch(err => {
                fail(err);
            })
    })

});



describe('Post - Update de usuário', () => {
    test('Update de usuário', () => {
        return request.post(`/users/${mainUser.id}`)
            .set('Authorization', `Bearer ${genToken}`)
            .send({
                ...mainUser,
                lastName: 'Guimarães Aguiar',
                address: 'Rua dos Carteiros,n.5632, Guarulhos-SP'
            })
            .then(res => {
                expect(res.statusCode).toEqual(200);
            })
            .catch(err => {
                fail(err);
            });
    })

    test('Update de usuário, mas não encontrado', () => {
        return request.post(`/users/${0}`)
            .set('Authorization', `Bearer ${genToken}`)
            .send({ ...mainUser, nickname: new Date })
            .then(res => {
                expect(res.statusCode).toEqual(202);
            })
            .catch(err => {
                fail(err);
            });
    })

});

//

describe('Patch - Update parcialmente de usuário para retorno de erros', () => {

    let localUser = {
        name: 'preenchido',
        lastName: 'preenchido',
        nickname: 'preenchido',
        address: 'preenchido',
        bio: 'preechido'
    }

    test('Deve retornar 400 para nome vazio', () => {
        let user = { ...localUser, name: '' };
        return request.patch(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do nome');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para sobrenome vazio', () => {
        let user = { ...localUser, lastName: '' };
        return request.patch(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do sobrenome');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para nickname vazio', () => {
        let user = { ...localUser, nickname: '' };
        return request.patch(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do nickname');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para endereço vazio', () => {
        let user = { ...localUser, address: '' };
        return request.patch(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Necessário o preenchimento do endereço');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para nickname presente na base de dados', () => {
        let userNickname = new Date;
        return request.post(`/users`).send({ ...mainUser, nickname: userNickname }).then(res => {
            let user = { ...localUser, nickname: userNickname };
            return request.patch(`/users/${mainUser.id}`).send(user)
                .set('Authorization', `Bearer ${genToken}`)
                .then(res => {
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.error).toEqual('Nickname presente no sistema');
                })
                .catch(err => {
                    fail(err);
                })
        }).catch(err => {
            fail(err);
        });

    });

    test('Deve retornar 400 para nickname maior de 30 caracteres', () => {
        let user = { ...localUser, nickname: 'ce85b99cc46752fffee35cab9a7b0278abb4c2d2' };
        return request.patch(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Máximo permitido são 30 caracteres para o nickname');
            })
            .catch(err => {
                fail(err);
            })
    });

    test('Deve retornar 400 para bio maior de 100 caracteres', () => {
        let user = {
            ...localUser, bio:
                'SiJttmWyytNb7jNnr4DYqUrFv#!Alo&L@AfQo3bQ9NQp3bLTg7kDER7Vpp!oRGhsmGsWfc#Bf7xqm$0FF5hISVTwLLO@LfLKq$*Jj'
        }
        return request.patch(`/users/${mainUser.id}`).send(user)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(400)
                expect(res.body.error).toEqual('Máximo permitido são 100 caracteres para a bio');
            })
            .catch(err => {
                fail(err);
            })
    })

});

describe('Patch - Update de usuário', () => {
    test('Update parcial de usuário', () => {
        return request.patch(`/users/${mainUser.id}`).send({
            lastName: 'Guimarães Aguiar Miranda',
            address: 'Rua dos Carteiros,n.5632, Guarulhos-SP'
        })
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
            })
            .catch(err => {
                fail(err);
            });
    })

    test('Update parcial de usuário, mas não encontrado', () => {
        return request.patch(`/users/${0}`)
            .send({ ...mainUser, nickname: new Date })
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(202);
            })
            .catch(err => {
                fail(err);
            });
    })

});

describe('Delete - usuário', () => {
    test('Deve retornar status 200 para sucesso ao deletar', () => {
        return request.post('/users').send({ ...mainUser, nickname: new Date })
            .then((res) => {
                return request.delete(`/users/${res.body.user_data.id}`)
                    .set('Authorization', `Bearer ${genToken}`)
                    .then(res => {
                        expect(res.statusCode).toEqual(200);
                    }).catch(err => {
                        fail(err);
                    });
            }).catch(err => {
                fail(err);
            });
    });

    test('Deve roternar status 202 para não encontrado para deletar', () => {
        return request.delete(`/users/${0}`)
            .set('Authorization', `Bearer ${genToken}`)
            .then(res => {
                expect(res.statusCode).toEqual(202);
            }).catch(err => {
                fail(err);
            });
    })

});