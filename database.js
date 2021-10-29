const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Stark009',
    database: 'blog'
  });

module.exports = connection;