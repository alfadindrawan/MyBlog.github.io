const express = require('express');
const app = express();
const connection = require('./database');
const session = require('')
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

connection.connect((err) => {
  if(err){
      console.log('error connecting: ' + err.stack);
      return;
  }
  console.log('success');
});




// Ini adalah path route untuk halaman Teratas
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get('/', (req, res) => {
    res.render('top.ejs');
});

// Ini adalah path route untuk halaman Artikel
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get('/list', (req, res) => {
  connection.query(
    'SELECT * FROM articles',
    (error, results) => {
      // Pastikan data dan nama property diberikan pada file EJS
      res.render('list.ejs', { articles: results });
    }
  );
});

// Ini adalah path route untuk halaman Detail Artikel
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get('/article/:id', (req, res) => {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM articles WHERE id = ?',
    [id],
    (error, results) => {
      // Pastikan data dan nama property diberikan pada file EJS
      res.render('article.ejs', { article: results[0] });
    }
  );
});

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
        if(req.body.password === results[0].password){
          console.log("Autentikasi berhasil");
          res.redirect('/list')
        }else{
          console.log("Autentukasi gagal");
          res.redirect('/login')
        }
      }else{
        res.redirect('/login');
      }
    }
  )
})

app.listen(3000);
