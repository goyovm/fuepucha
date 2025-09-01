const conf = {
  dev: process.env.NODE_ENV !== 'production',
  swaggerPath: '/docs',
  database: {
    host: 'localhost',
    port: 3300,
    username: 'user',
    password: 'userpassword',
    name: 'mydatabase',
  },
};

export default conf;
