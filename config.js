const path = require('path');
const password = require('password.js');

const config = {
  debug: true,
  port: 3306,
  mysql: {
    host: 'wordnews-database.cbahr4yobiec.us-east-1.rds.amazonaws.com',
    user: 'hee3',
    password: `${password}`,
    database: 'wordnews_database'
  }
};

