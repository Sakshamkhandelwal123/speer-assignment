import 'dotenv/config';

export const applicationConfig = {
  app: {
    env: process.env.APP_ENV,
    port: process.env.PORT,
  },

  database: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'speer-secret',
    expiresIn: '24h',
    issuer: 'speer',
  },
};
