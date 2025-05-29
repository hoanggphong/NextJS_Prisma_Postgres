import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js Prisma API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Next.js Prisma application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to the API docs
};

export const spec = swaggerJsdoc(options); 