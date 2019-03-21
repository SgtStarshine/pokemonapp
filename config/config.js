require('dotenv').config(); // this is important!
module.exports = {
  "development": {
    "username": "root",
    "password": process.env.MYSQL_PSWD,
    "database": "pokeDB",
    "host": "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "testdb",
    "host": "localhost",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "use_env_variable": "JAWSDB_URL",
    "dialect": "mysql"
  }
} 