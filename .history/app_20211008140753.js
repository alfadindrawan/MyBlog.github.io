const express = require('express');
const app = express();
const connection = require('./database');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));



// Ini adalah path route untuk halaman Teratas
// Pastikan URL dan code untuk menampilkan halaman-nya
app.get('/', (req, res) => {
  (error, results) => {
    if(error) {
      console.log("s");
    }
  }
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

app.listen(3000);
