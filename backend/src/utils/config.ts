const dev = true;

const conf = {
  dev,
  swaggerPath: '/docs',
  database: {
    host: 'localhost',
    port: dev ? 3300 : 3306,
    username: 'user',
    password: 'userpassword',
    name: 'mydatabase',
  },
};

export default conf;
