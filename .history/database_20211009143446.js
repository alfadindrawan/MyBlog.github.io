const mysql = require('mysql');
const session = require('express-session')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Stark009',
    database: 'blog'
  });

  app.use(
    
  )


module.exports = connection;