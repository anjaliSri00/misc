require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
console.log(process.env.DB_NAME, typeof process.env.DB_PASSWORD)
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: __dirname + '/migration',
    },
  },
}; 