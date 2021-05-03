# Como iniciar o projeto

Passos para Executar o Projeto:
## 1) Ir ao diretório principal do projeto e executar 'docker-compose up'
```
flavio@flavio:~/Desktop/apiRestUsers$ ls
docker-compose.yml  Dockerfile  instructions.md  jest.config.js  node_modules  package.json  package-lock.json  README.md  src  test
flavio@flavio:~/Desktop/apiRestUsers$ docker compose up
```
Obs: ao executar o comando, será gerado um erro por parte do nodejs. É necessário que ele termine de criar a pasta mysql com a base de dados, 
para isso espere aparecer a menssagem:
```
mysql-container | 2021-05-03T16:19:40.900512Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.24'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
```
logo após e só fechar o container com **ctrl + c** e subi-lo novamente.

## 2) Caso queira executar um teste utilize o comando 'docker exec -it node_container npm test'
```
flavio@flavio:~/Desktop/apiRestUsers$ ls
docker-compose.yml  Dockerfile  instructions.md  jest.config.js  node_modules  package.json  package-lock.json  README.md  src  test
flavio@flavio:~/Desktop/apiRestUsers$ docker exec -it node_container npm test
```
## 3) Configurando POSTMAN para consumir a API para fazer teste manuais:
O projeto utiliza JWT, por conta disso faz se necessário a criacão de um usuário, e com o **nickname** será utilizado na rota POST */auth*
para efetuar a autenticacão

Imagem de exemplo criacão de um usuário:
![image1](https://cdn.discordapp.com/attachments/490594796088459275/838819140713185300/Screenshot_from_2021-05-03_13-46-01.png)
Imagem de exemplo para obter o token:
![image2](https://cdn.discordapp.com/attachments/490594796088459275/838820838823297144/Screenshot_from_2021-05-03_13-53-50.png)

### Para proceguir com o CRUD da API deve copiar o token e:
###### 1 Abrir a aba Authorization
###### 2 Clicar no select *Type* e selecionar a opção *Bearer Token*
###### 3 Cololar o Token no campo *Token*
Imagem de exemplo para inserir o token:
![imagem3](https://cdn.discordapp.com/attachments/490594796088459275/838822398841192498/Screenshot_from_2021-05-03_14-00-12.png)

### Pronto! Ambiente configurado para efetuar os testes

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
- Query params: *dataUser*

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
- Path params: *id*

Body params:

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
