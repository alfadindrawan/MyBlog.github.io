const express = require('express');
const session = require('express-session')
const app = express();
const connection = require('./database');
const bcrypt = require('bcrypt');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

// Connection Database
connection.connect((err) => {
  if(err){
      console.log('error connecting: ' + err.stack);
      return;
  }
  // console.log('success');
});

app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
  if(req.session.userId === undefined){
    console.log("Anda belum login");
    res.locals.username = ' ';
    res.locals.isLoggedIn = false
  }else{
    console.log("Anda telah login");
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true
  }
  next();
});

app.get('/', (req, res) => {
    res.render('top.ejs');
});


app.get('/list', (req, res) => {
  connection.query(
    'SELECT * FROM articles',
    (error, results) => {
      res.render('list.ejs', { articles: results });
    }
  );
});


app.get('/article/:id', (req, res) => {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM articles WHERE id = ?',
    [id],
    (error, results) => {
      res.render('article.ejs', { article: results[0] });
    }
  );
});


// Baris LogIn
app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', (req, res) => {
  const email = req.body.email;
  connection.query(
    'SELECT *FROM users WHERE email= ?',
    [email],
    (error, results) => {
      
      if(results.length > 0){
        const plain = req.body.password;
        const hash = results[0].password;

        bcrypt.compare(plain, hash, (error, isEqual) => {
          if(isEqual){
          req.session.userId = results[0].id;
          req.session.username = results[0].username;
          res.redirect('/list');
        }else{
          res.redirect('/login');
          }
        })

      }else{
        res.redirect('/login');
      }
    }
    )
  });
  

// Baris SignUp
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {errors: []});
  })

app.post('/signup', 
  (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password; 

    const errors = [];

    if(username === ''){
      errors.push('Username kosong');
    }
    if(email === ''){
      errors.push('Email kosong');
    }
    if(password === ''){
      errors.push('Password kosong')
    }
    console.log(errors);

    if(errors.length > 0){
      res.render('signup.ejs', {errors: errors})
    }else{
      next();
    }
  },
  (req, res, next) => {
    const email = req.body.email;
    const errors = [];

    connection.query(
      'SELECT *FROM users WHERE email= ?',
      [email],
      (error, results) => {
        if(results.length > 0){
          errors.push("Email Sudah terdaftar")
          res.render('signup.ejs', {errors: errors})
        }else{
          next();
        }
      }
    )
  },
  (req, res) => {
    console.log('Pendaftaran');
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    bcrypt.hash(password, 10, (error, hash) => {
      connection.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
        (error, results) => {
          req.session.userId = results.insertId;
          req.session.username = username;
          res.redirect('/list');
        });
    });
  });


// Baris LogOut
app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/list');
  })
})

app.listen(3000);
