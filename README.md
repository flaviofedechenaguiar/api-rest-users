# Como iniciar o projeto

# API Documentation
Esta API é utilizada para gerenciamento dos usuários
## Endpoints
### GET /users
Endpoint responsável por retornar todos os usuário presentes no sistema.
#### Parâmetros
Nenhum.

#### Responstas
##### OK! 200
Caso ocorra esta resposta, ira ser retornado uma listagem com todos os usuários.

Exemplo de resposta:
```
{    
    "code": 200,
    "users": [
        {
            "id": 1,
            "name": "ricardo",
            "lastName": "camargo belo",
            "nickname": "belo30",
            "address": "Rua Noite de Dezembro, N.2312, Campo Mourão-PR",
            "bio": "Estou cursando Sistemas na Utfpr ",
            "createdAt": "2021-05-01T00:30:50.000Z",
            "updatedAt": "2021-05-01T00:30:50.000Z",
            "_links": [
                {
                    "href": "http://localhost:3030/users?dataUser=ricardo",
                    "method": "GET",
                    "rel": "get_users_name"
                },
                {
                    "href": "http://localhost:3030/users?dataUser=camargo belo",
                    "method": "GET",
                    "rel": "get_users_last_name"
                },
                {
                    "href": "http://localhost:3030/users/belo30",
                    "method": "GET",
                    "rel": "get_user_nickname"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "POST",
                    "rel": "update_user"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "PATCH",
                    "rel": "update_user_partial"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "DELETE",
                    "rel": "delete_user"
                }
            ]
        },
        ...
    ]
}
```
##### Erro no servidor! 500
Caso ocorra esta resposta, significa que houve algum problema da base de dados. Motivos: Indeterminado.

Exemplo:
```
{
    "code": 500,
    "error": "Erro ao consultar a base de dados"
}
```

### GET /users?dataUser={nomeousobrenome}
Endpoint responsável por retornar todos os usuário que possuem o nome ou sobrenome respectivo.
#### Parâmetros de consulta: *dataUser*

Exemplo de requisição:
```
http://localhost:3030/users?dataUser=nomeousobrenome
```
#### Responstas
##### OK! 200
Caso ocorra esta resposta, ira ser retornado uma listagem com todos os usuários que satisfazem esta consulta.

Exemplo de resposta caso encontre correspondente ao solicitado:
``` 
{
    "code": 200,
    "users": [
        {
            "id": 1,
            "name": "ricardo",
            "lastName": "camargo belo",
            "nickname": "belo30",
            "address": "Rua Noite de Dezembro, N.2312, Campo Mourão-PR",
            "bio": "Estou cursando Sistemas na Utfpr ",
            "createdAt": "2021-05-01T00:30:50.000Z",
            "updatedAt": "2021-05-01T00:30:50.000Z",
            "_links": [
                {
                    "href": "http://localhost:3030/users?dataUser=ricardo",
                    "method": "GET",
                    "rel": "get_users_name"
                },
                {
                    "href": "http://localhost:3030/users?dataUser=camargo belo",
                    "method": "GET",
                    "rel": "get_users_last_name"
                },
                {
                    "href": "http://localhost:3030/users/belo30",
                    "method": "GET",
                    "rel": "get_user_nickname"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "POST",
                    "rel": "update_user"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "PATCH",
                    "rel": "update_user_partial"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "DELETE",
                    "rel": "delete_user"
                }
            ]
        },
        ...
    ]
}
```
Exemplo de resposta caso não encontre correspondente ao solicitado:
```
{
    "code": 200,
    "users": []
}
```
##### Erro no servidor! 500
Caso ocorra esta resposta, significa que houve algum problema na base de dados. Motivos: Indeterminado.

Exemplo:
```
{
    "code": 500,
    "error": "Erro ao consultar a base de dados"
}
```

### GET /users/{nickname}
Endpoint responsável por retornar os dados de um usuário de acordo com o respectivo nickname.
#### Parâmetros
Path params: *nickname*

#### Responstas
##### OK! 200
Caso haja um usuário com o respectivo nickname, ira ser retornado os dados preenchidos.

Exemplo de resposta:
```
{
    "code": 200,
    "user_data": {
        "name": "ric",
        "lastName": "camargo belo",
        "nickname": "belo30",
        "_links": [
            {
                "href": "http://localhost:3030/users?dataUser=ric",
                "method": "GET",
                "rel": "get_users_name"
            },
            {
                "href": "http://localhost:3030/users?dataUser=camargo belo",
                "method": "GET",
                "rel": "get_users_last_name"
            },
            {
                "href": "http://localhost:3030/users/11",
                "method": "POST",
                "rel": "update_user"
            },
            {
                "href": "http://localhost:3030/users/11",
                "method": "PATCH",
                "rel": "update_user_partial"
            },
            {
                "href": "http://localhost:3030/users/11",
                "method": "DELETE",
                "rel": "delete_user"
            }
        ]
    }
}
```
Caso não haja um usuário com o respectivo nickname, ira ser retornado os dados vazios.

Exemplo de resposta:
```
{
    "code": 202,
    "user_data": {
        "name": "",
        "lastName": "",
        "nickname": "",
        "_links": []
    }
}

```

##### Erro no servidor! 500
Caso ocorra esta resposta, significa que houve algum problema da base de dados. Motivos: Indeterminado.

Exemplo:
```
{
    "code": 500,
    "error": "Erro ao fazer consulta na base de dados"
}
```

### POST /users
Endpoint responsável por fazer o cadastro do usuário.
#### Parâmetros:
```
{
    "name":"nomedousuario",          // Obrigatório
    "lastName":"sobrenomedousuario", // Obrigatório
    "nickname":"nicknamedousuario",  // Obrigatório - Unico - Máximo 30 caracteres
    "address":"enderecodousuario",   // Obrigatório
    "bio":"descricaodousuario"       // Não Obrigatório - Máximo 100 caracteres
}
```
#### Responstas
##### CRIADO! 201
Caso ocorra esta resposta, ira ser retornado os dados respectivos do usuário criado.

Exemplo de  resposta:
```
{
    "code": 201,
    "message": "Criado com sucesso",
    "user_data": {
        "id": 1,
            "name": "ricardo",
            "lastName": "camargo belo",
            "nickname": "belo30",
            "address": "Rua Noite de Dezembro, N.2312, Campo Mourão-PR",
            "bio": "Estou cursando Sistemas na Utfpr ",
            "createdAt": "2021-05-01T00:30:50.000Z",
            "updatedAt": "2021-05-01T00:30:50.000Z",
            "_links": [
                {
                    "href": "http://localhost:3030/users?dataUser=ricardo",
                    "method": "GET",
                    "rel": "get_users_name"
                },
                {
                    "href": "http://localhost:3030/users?dataUser=camargo belo",
                    "method": "GET",
                    "rel": "get_users_last_name"
                },
                {
                    "href": "http://localhost:3030/users/belo30",
                    "method": "GET",
                    "rel": "get_user_nickname"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "POST",
                    "rel": "update_user"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "PATCH",
                    "rel": "update_user_partial"
                },
                {
                    "href": "http://localhost:3030/users/11",
                    "method": "DELETE",
                    "rel": "delete_user"
                }
            ]
    }
}
```
##### Erro de requisição! 400
Caso ocorra esta resposta, significa que problemas com relação ao corpo da requisição. Motivos: Dados maiores que o seu limite, dados passados vazios, nickname existente no sistema.

Exemplos:

###### *name* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do nome"
}
```

###### *lastName* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do sobrenome"
}
```

###### *nickname* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do nickname"
}
```

###### *nickname* presente no sistema
```
{
    "code": 400,
    "error": "nickname já presente"
}
```

###### *nickname* maior de 30 caracteres
```
{
    "code": 400,
    "error": "Máximo permitido são 30 caracteres para o nickname"
}
```

###### *address* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do endereço"
}
```

###### *bio* maior de 100 caracteres
```
{
    "code": 400,
    "error": "Máximo permitido são 100 caracteres para a bio"
}
```

##### Erro no servidor! 500
Caso ocorra esta resposta, significa que houve algum problema na base de dados. Motivos: Indeterminado.

Exemplo:
```
{
    "code": 500,
    "error": "Erro ao fazer cadastro na base de dados"
}
```

### PATCH /users/{id_do_usuario}
Endpoint responsável por atualizar os dados do usuário presente no sistema.

#### Parâmetros
```
{
    "name":"nomedousuario",          // Obrigatório
    "lastName":"sobrenomedousuario", // Obrigatório
    "nickname":"nicknamedousuario",  // Obrigatório - Unico - Máximo 30 caracteres
    "address":"enderecodousuario",   // Obrigatório
    "bio":"descricaodousuario"       // Não Obrigatório - Máximo 100 caracteres
}
```
#### Responstas
##### OK! 200
Caso o usuário esteja presente no sistema será retornado os dados atualizados.

Exemplo de resposta:
```
{
    "code": 200,
    "user_data": {
        "id": 11,
        "name": "ric",
        "lastName": "camargo belo",
        "nickname": "belo30",
        "address": "Rua Noite de Dezembro, N.2312, Campo Mourão-PR",
        "bio": "Estou cursando Sistemas na Utfpr ",
        "createdAt": "2021-05-01T00:30:50.000Z",
        "updatedAt": "2021-05-01T01:09:35.000Z",
        "_links": [
            {
                "href": "http://localhost:3030/users?dataUser=ric",
                "method": "GET",
                "rel": "get_users_name"
            },
            {
                "href": "http://localhost:3030/users?dataUser=camargo belo",
                "method": "GET",
                "rel": "get_users_last_name"
            },
            {
                "href": "http://localhost:3030/users/belo30",
                "method": "GET",
                "rel": "get_user_nickname"
            },
            {
                "href": "http://localhost:3030/users/11",
                "method": "DELETE",
                "rel": "delete_user"
            }
        ]
    }
}
```

##### ACEITO, PORÉM NÃO CONCLUÍDO! 202
Caso o usuário não esteja presente no sistema será retornado os dados vazios.

Exemplo de  resposta:
```
{
    "id": 0,
    "name": "",
    "lastName": "",
    "nickname": "",
    "address": "",
    "bio": "",
    "createdAt": "",
    "updatedAt": "",
    "_links": []
}
```

##### Erro de requisição! 400
Caso ocorra esta resposta, significa que problemas com relação ao corpo da requisição. Motivos: Dados maiores que o seu limite, dados passados vazios, nickname existente no sistema.

Exemplos:

###### *name* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do nome"
}
```

###### *lastName* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do sobrenome"
}
```

###### *nickname* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do nickname"
}
```

###### *nickname* presente no sistema
```
{
    "code": 400,
    "error": "nickname já presente"
}
```

###### *nickname* maior de 30 caracteres
```
{
    "code": 400,
    "error": "Máximo permitido são 30 caracteres para o nickname"
}
```

###### *address* nulo ou vazio
```
{
    "code": 400,
    "error": "Necessário o preenchimento do endereço"
}
```

###### *bio* maior de 100 caracteres
```
{
    "code": 400,
    "error": "Máximo permitido são 100 caracteres para a bio"
}
```

##### Erro no servidor! 500
Caso ocorra esta resposta, significa que houve algum problema da base de dados. Motivos: Indeterminado.

Exemplo:
```
{
    "code": 500,
    "error": "Erro ao fazer atualização na base de dados"
}
```

### DELETE /users/{id}
Endpoint responsável fazer deletar os dados de um usuário de acordo com o respectivo id.
#### Parâmetros
Path params: *id*

#### Responstas
##### OK! 200
Caso haja um usuário com o respectivo id, ira ser deletado o usuário.

Exemplo de resposta:
```
{
    "code": 200
}
```

##### ACEITO, PORÉM NÃO CONCLUÍDO! 202
Caso não haja um usuário com o respectivo id.

Exemplo de resposta:
```
{
    "code": 202
}

```

##### Erro no servidor! 500
Caso ocorra esta resposta, significa que houve algum problema da base de dados. Motivos: Indeterminado.

Exemplo:
```
{
    "code": 500,
    "error": "Erro ao deletar da base de dados"
}
```
