// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit'); // Import express-rate-limit
const typeDefs = require('./schemas/UserSchema');
const resolvers = require('./resolvers/UserResolvers');
const { ValidationError, DuplicateError } = require('./utils/CustomErrors');
const logger = require('./utils/Logger'); // Import your logger

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;



// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB connected')) // Log successful connection
  .catch(err => {
    logger.error('MongoDB connection error:', err); // Log connection error
    process.exit(1); // Exit the process on error
  });



// Define API limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10000, // Limit each IP to 30 requests per 5 minutes
  message: 'Too many requests, please try again later.', // Response message for rate limit exceeded
});


// Apply the rate limiting middleware to all requests
app.use(limiter);


// Custom middleware to log when the rate limit is exceeded
app.use((err, req, res, next) => {
  if (err && err.status === 429) { // Check if the error is a rate limit error
    logger.warn(`Rate limit reached for IP: ${req.ip}`);
  }
  next(err); // Call the next middleware
});



// Apollo Server setup with custom error formatting
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      req, // Pass the request object to context
      rateLimit: {
        current: req.rateLimit.current, // Set current usage for the IP
        limit: req.rateLimit.limit, // Set the limit for the IP
      },
    };
  },
  formatError: (err) => {
    // Log the full error details for debugging
    logger.error(err); // Log the entire error object

    if (err.originalError instanceof ValidationError || err.originalError instanceof DuplicateError) {
      return { message: err.message, code: err.originalError.code };
    }
    // Default error format for other errors
    return { message: 'An unexpected error occurred.', code: 'INTERNAL_SERVER_ERROR' };
  },
});



// Start the Apollo server
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });



  // Start the Express server
  app.listen(PORT, () => {
    logger.info(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`); // Log server start
  });
};



// Call the start function
startServer().catch(err => {
  logger.error('Error starting the server:', err); // Log server start error
});
