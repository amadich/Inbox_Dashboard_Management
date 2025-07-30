import { Sequelize } from "sequelize-typescript";

// Ensure that the environment variables are loaded
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    models: [__dirname + '/../models'],
  }
);



export default sequelize;
