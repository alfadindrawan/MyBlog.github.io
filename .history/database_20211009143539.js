const mysql = require('mysql');
const session = require('express-session')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Stark009',
    database: 'blog'
  });

  app.use(
    session({
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: false
    })
  )


module.exports {connection;