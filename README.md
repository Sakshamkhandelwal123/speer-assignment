# Speer Assignment

## Technologies/Frameworks Used

1. NodeJS --> It is easy to code in node js with javascript and typescript. Node js is non blocking, the way it runs the code by default is asynchronous code.
2. TypeScript --> It makes it easier to write accurate code more quickly and catch bugs prior to runtime. We can also define return type in typescript.
3. NestJS --> It enhances developer productivity by providing features like type checking, autocompletion, and better code documentation. Its use of decorators, dependency injection, and other design patterns enables maintainable and clean code.
4. PostgreSQL --> It gives us more flexibility in data types, scalability. It is relatively faster compared to most of the relational databases available.
5. Sequelize --> It provides excellent support for database synchronization, eager loading, associations, transactions, and database migrations while reducing development time and preventing SQL injections.
6. Meilisearch --> Meilisearch is a powerful search engine that offers several advantages, including fast search capabilities, customisable ranking and filtering, easy integration, and scalability.

## Installation

To install the dependencies for this project, run the following command:

```bash
$ npm install
```

## Installation(Setup files)

Download and Install meilisearch from this website :-  
[https://www.meilisearch.com/docs/learn/getting_started/installation](https://www.meilisearch.com/docs/learn/getting_started/installation)

Run meilisearch by following command :-

```
./meilisearch
```

## Running the application

To start the application run the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Environment Variables

This application uses environment variables to configure various settings. These variables are stored in an `.env` file located in the root of the project.

Here's a brief description of each environment variable:

### Environment

```
APP_ENV= # The environment in which the application is running (e.g. development, main)
PORT= # Port where server is listening
```

### Database

```
DB_DIALECT= # The dialect of the database server
DB_HOST= # The hostname of the database server
DB_PORT= # The port number on which the database server is listening
DB_USERNAME= # The username of the database user
DB_PASSWORD= # The password of the database user
DB_NAME= # The name of the database
```

### JWT

```
JWT_SECRET= # The private key used to sign JWTs
```

### Redis

```
REDIS_HOST= # The hostname of redis server
REDIS_PORT= # The port number on which the redis server is listening
```

### Meilisearch

```
MEILISEARCH_HOST= # The host url of meilisearch server
MEILI_MASTER_KEY= # The secret key of meilisearch
```

Make sure to replace the placeholder values with your own values before starting the application.
