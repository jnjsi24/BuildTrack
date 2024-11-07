// src/resolvers/UserResolvers.js
const { ValidationError, DuplicateError } = require('../utils/CustomErrors');
const User = require('../models/User');
const logger = require('../utils/Logger'); // Import logger

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactNumberRegex = /^(09|\+639)\d{9}$/;

const resolvers = {
  Query: {
    getUsers: async (parent, args, context) => {
      // Get the current usage for the IP address
      const ip = context.req.ip;
      const currentUsage = context.rateLimit.current; // This will depend on your rate limiting setup
      const maxLimit = context.rateLimit.limit; // Assuming you have access to the limit

      // Log the current usage and limit
      logger.info(`Current API usage for ${ip}: ${currentUsage}/${maxLimit}`);

      logger.info('Fetching all users'); // Log action
      return await User.find();
    },
  },
  Mutation: {
    addUser: async (_, { fullName, age, address, email, contactNumber, username, password }, context) => {
      // Get the current usage for the IP address
      const ip = context.req.ip;
      const currentUsage = context.rateLimit.current; // This will depend on your rate limiting setup
      const maxLimit = context.rateLimit.limit; // Assuming you have access to the limit

      // Log the current usage and limit
      logger.info(`Current API usage for ${ip}: ${currentUsage}/${maxLimit}`);

      // Validate required fields
      if (!fullName || !age || !address || !email || !contactNumber || !username || !password) {
        logger.warn('Validation error: All fields are required.'); // Log warning
        throw new ValidationError('All fields are required.');
      }
      if (age < 18) {
        logger.warn('Validation error: Age must be 18 or older.'); // Log warning
        throw new ValidationError('Age must be 18 or older.');
      }
      if (!emailRegex.test(email)) {
        logger.warn('Validation error: Invalid email format.'); // Log warning
        throw new ValidationError('Invalid email format.');
      }
      if (!contactNumberRegex.test(contactNumber)) {
        logger.warn('Validation error: Invalid contact number format.'); // Log warning
        throw new ValidationError('Invalid contact number format.');
      }

      // Duplicate email check
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        logger.warn(`Duplicate email error: ${email}`); // Log warning
        throw new DuplicateError('Email', email);
      }

      // Duplicate username check
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        logger.warn(`Duplicate username error: ${username}`); // Log warning
        throw new DuplicateError('Username', username);
      }

      // Create and save new user
      const newUser = new User({ fullName, age, address, email, contactNumber, username, password });
      await newUser.save();
      logger.info(`User added: ${email}`); // Log user addition
      return newUser;
    },

    updateUser: async (_, { id, fullName, age, address, email, contactNumber, username, password }, context) => {
      // Get the current usage for the IP address
      const ip = context.req.ip;
      const currentUsage = context.rateLimit.current; // This will depend on your rate limiting setup
      const maxLimit = context.rateLimit.limit; // Assuming you have access to the limit

      // Log the current usage and limit
      logger.info(`Current API usage for ${ip}: ${currentUsage}/${maxLimit}`);

      logger.info(`Updating user: ${id}`); // Log action
      // Find existing user
      const user = await User.findById(id);
      if (!user) {
        logger.warn(`User not found: ${id}`); // Log warning
        throw new ValidationError('User not found.');
      }

      // Validate fields if provided
      if (age && age < 18) {
        logger.warn('Validation error: Age must be 18 or older.'); // Log warning
        throw new ValidationError('Age must be 18 or older.');
      }
      if (email && !emailRegex.test(email)) {
        logger.warn('Validation error: Invalid email format.'); // Log warning
        throw new ValidationError('Invalid email format.');
      }
      if (contactNumber && !contactNumberRegex.test(contactNumber)) {
        logger.warn('Validation error: Invalid contact number format.'); // Log warning
        throw new ValidationError('Invalid contact number format.');
      }

      // Check for duplicate email if changed
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          logger.warn(`Duplicate email error during update: ${email}`); // Log warning
          throw new DuplicateError('Email', email);
        }
      }

      // Check for duplicate username if changed
      if (username && username !== user.username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
          logger.warn(`Duplicate username error during update: ${username}`); // Log warning
          throw new DuplicateError('Username', username);
        }
      }

      // Update user fields
      user.fullName = fullName || user.fullName;
      user.age = age || user.age;
      user.address = address || user.address;
      user.email = email || user.email;
      user.contactNumber = contactNumber || user.contactNumber;
      user.username = username || user.username;
      if (password) user.password = password; // Will trigger pre-save hashing

      // Save and return updated user
      const updatedUser = await user.save();
      logger.info(`User updated: ${updatedUser.email}`); // Log user update
      return updatedUser;
    },

    deleteUser: async (_, { id }, context) => {
      // Get the current usage for the IP address
      const ip = context.req.ip;
      const currentUsage = context.rateLimit.current; // This will depend on your rate limiting setup
      const maxLimit = context.rateLimit.limit; // Assuming you have access to the limit

      // Log the current usage and limit
      logger.info(`Current API usage for ${ip}: ${currentUsage}/${maxLimit}`);

      logger.info(`Deleting user: ${id}`); // Log action
      const user = await User.findById(id);
      if (!user) {
        logger.warn(`User not found for deletion: ${id}`); // Log warning
        throw new ValidationError('User not found.');
      }

      await user.deleteOne();
      logger.info(`User deleted: ${user.email}`); // Log user deletion
      return user;
    },
  },
};

module.exports = resolvers;
