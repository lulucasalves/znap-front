
# Projeto Znap Frontend

Este é um teste para desenvolvedor pleno na empresa Znap, serão passadas as instruções para inicialização do servidor.

A versão em que foi desenvolvida o projeto foi com  Node: `v20.6.1` e NPM `v9.8.1` é recomendavel utilizar estas versões para iniciar o servidor.

Ele está configurado para fazer requisições por padrão em `http://localhost:8080` e precisa do servidor [backend](https://github.com/lulucasalves/znap-back) ativo para iniciar a aplicação.

### Clonando projeto
```bash
    git clone git@github.com:lulucasalves/znap-front.git
```

### Instalando dependências
```bash
    npm install
```
```bash
    yarn
```

### Iniciando projeto
```bash
    npm run dev
```
```bash
    yarn dev
```

### Utilizando o docker
É possível iniciar o projeto usando o `Docker` ou o `Docker Compose`

#### Docker
```bash
    docker build -t znap-front .

    # servidor em primeiro plano
    docker run -p 3000:3000 znap-front

    # servidor em segundo plano
    docker run -d -p 3000:3000 znap-front
```

#### Docker Compose
```bash
    # servidor em primeiro plano
    docker-compose up

    # servidor em segundo plano
    docker-compose up -d
```