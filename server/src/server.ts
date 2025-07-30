import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import sequelize from './config/db';
import { schema } from './graphql/schema';



const app: Application = express();
const port = process.env.PORT || 4000;  // GraphQL API will run on port 4000

// CORS config:
// const corsOptions = {
//   origin:  process.env.CORS_ORIGIN, // only allow my frontend
//   credentials: true // case if i send cookies or auth headers
// };

app.use(cors());


// Initialize an Apollo Server instance
const server = new ApolloServer({ schema });

// Start the Apollo Server before applying middleware
const startApolloServer = async () => {

  // Connect to the database
  // Sync the database (optional, but useful for development)
  await sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error syncing database', err);
  });

  // Start Apollo Server
  await server.start();

  // Apply Apollo middleware to the Express app
  server.applyMiddleware({ app });

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}${server.graphqlPath}`);
  });
};



// Express route for testing
app.get('/', (req, res) => {
  res.send('Hello, this is an Express server with Apollo GraphQL!');
});

// Call the function to start everything
startApolloServer();