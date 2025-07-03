const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
    },
    servers: [
      { url: 'https://post-xw77.onrender.com' } // ✅ Update this to your actual deployed URL
    ],
  },
  apis: ['./routes/*.js'],
};

export default options; // ✅ THIS LINE FIXES YOUR ISSUE
