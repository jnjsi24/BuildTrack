// src/utils/CustomErrors.js

class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
      this.code = "VALIDATION_ERROR";
    }
  }
  
  class DuplicateError extends Error {
    constructor(field, value) {
      super(`${field} "${value}" already exists.`);
      this.name = "DuplicateError";
      this.code = "DUPLICATE_ERROR";
    }
  }
  
  module.exports = { ValidationError, DuplicateError };
  