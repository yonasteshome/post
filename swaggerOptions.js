const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
    },
    servers: [
      { url: 'https://your-deployed-backend.com' } // ✅ Change from localhost
    ],
  },
  apis: ['./routes/*.js'],
};
