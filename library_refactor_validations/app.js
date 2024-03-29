var express = require("express"),
app = express(),
methodOverride = require('method-override'),
bodyParser = require("body-parser"),
db = require("./models/index");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//Home
app.get('/', function(req, res){
  res.render('home');
});

//Index
app.get('/books', function(req, res){
  db.Book.findAll().done(function(err,books){
    res.render('library/index', {allBooks: books});
  });
});

//New
app.get('/books/new', function(req, res){
  res.render("library/new", {title:"",author:""});
});

//Create
app.post('/books', function(req, res) {
  var title = req.body.book.title;
  var author = req.body.book.author;
  db.Book.create({
    title: title,
    author: author
  }).done(function(err,success){
    if(err) {
      var errMsg = "title must be at least 6 characters";
      res.render('library/new',{errMsg:errMsg, title:title, author:author});
    }
    else{
      res.redirect('/books');
    }
  });
});

//Show
app.get('/books/:id', function(req, res) {
  db.Book.find(req.params.id).done(function(err,book){
    res.render('library/show', {book: book});
  });
});

//Edit
app.get('/books/:id/edit', function(req, res) {
  //find our book
  var id = req.params.id;
  db.Book.find(id).done(function(err,book){
    res.render('library/edit', {book: book});
  });
});

//Update
app.put('/books/:id', function(req, res) {
  var id = req.params.id;
  db.Book.find(id).done(function(err,book){
    book.updateAttributes({
      title: req.body.book.title,
      author: req.body.book.author
    }).done(function(err,success){
    if(err) {
      var errMsg = "title must be at least 6 characters";
      res.render('library/new',{errMsg:errMsg});
    }
    else{
      res.redirect('/books');
    }
    });
  });
});

//Delete
app.delete('/books/:id', function(req, res) {
  var id = req.params.id;
  db.Book.find(id).done(function(err,book){
    book.destroy().done(function(err,success){
      res.redirect('/books');
    });
  });
});

app.get('*', function(req,res){
  res.render('404');
});

app.listen(3000, function(){
  "Server is listening on port 3000";
});
