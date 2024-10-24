# Users Microservice with NestJS

This project is a user microservice developed with **NestJS**, using **REST API** and **gRPC** for communication between services. It is designed to be part of a microservice architecture that allows efficient user management.

## Technologies Used

- **NestJS**: A framework for building scalable Node.js applications.
- **REST API**: For HTTP communication with other services or clients.
- **gRPC**: Efficient communication protocol for interaction between microservices.
- **TypeScript**: Programming language to enhance code quality.
- **Docker**: To containerize the microservice and simplify deployment.

### Development Mode

To run the microservice in development mode:
```bash
pnpm run start:dev
```
This will start the REST server on port `3000` and the gRPC service on port `50051` by default.