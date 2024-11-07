# User Management API

Welcome to the User API! This API provides functionalities to manage users, including CRUD operations, authentication, and more.

## Features

- **User CRUD Operations**: Create, Read, Update, and Delete user accounts.
- **Rate Limiting**: Protects the API from abuse by limiting the number of requests from a single IP address (20 requests per 15 minutes).
- **Password Hashing**: User passwords are securely hashed using bcrypt before storage to enhance security.
- **Input Validation**: Ensures that user data meets specific criteria (e.g., valid email format, age restrictions).
- **Custom Error Handling**: Provides meaningful error messages for validation errors and duplicate entries.



## Languages and Frameworks

- **JavaScript**: The primary programming language for the project.
- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web application framework for Node.js.
- **Apollo Server**: GraphQL server for handling API requests.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **bcrypt**: Library for hashing passwords.



## Endpoints



### Queries

- **Get All Users**
  - **Endpoint**: `GET /graphql`
  - **Query**:
    ```graphql
    query {
      getUsers {
        id
        username
        email
      }
    }
    ```



### Mutations

- **Add User**
  - **Endpoint**: `POST /graphql`
  - **Mutation**:
    ```graphql
    mutation {
      addUser(fullName: "John Doe", age: 25, address: "123 Main St", email: "john@example.com", contactNumber: "+639123456789", username: "john_doe", password: "securepassword") {
        id
        username
        email
      }
    }
    ```

- **Update User**
  - **Endpoint**: `POST /graphql`
  - **Mutation**:
    ```graphql
    mutation {
      updateUser(id: "user_id", fullName: "Jane Doe", email: "jane@example.com") {
        id
        username
        email
      }
    }
    ```

- **Delete User**
  - **Endpoint**: `POST /graphql`
  - **Mutation**:
    ```graphql
    mutation {
      deleteUser(id: "user_id") {
        id
        username
      }
    }
    ```

    

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
3. Set up your .env file with your MongoDB URI.
4. Start the server:
    npm run dev



## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

