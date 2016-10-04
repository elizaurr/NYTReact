//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//requires schemas
var Article = require('./server/model.js');

//port
var app = express();
var PORT = process.env.PORT || 3000;

//run morgan for logging 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.app+json'}));


app.use(express.static('./public'));


//mongod config 
mongoose.connect('mongodb://heroku_9vzrp4j7:lags35evhoatglpl970bppd2bv@ds035280.mlab.com:35280/heroku_9vzrp4j7');
var db = mongoose.connection;


db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful!');
});


//main route
app.get('/', function(req,res){
  res.sendFile('./public/index.html');
});

// route gets all saved articles
app.get('/api/saved', function(req,res){

    Article.find({})
        .exec(function(err, doc){


            if(err) {
              console.log(err);
            }
            else {
              res.send(doc);
            }
        })
});


//route to add an article to the saved list

app.post ('/api/saved', function (req,res) {
    var newArticle = new Article(req.body);


    console.log(req.body);


    var title = req.body.title;
    var date = req.body.date;
    var url = req.body.url;


    newArticle.save(function(err,doc) {
      if(err) {
        console.log(err);
      }
      else {
       res.json(doc);
      }
    });
});



//route to delete article from saved 
app.delete('/api/saved', function(req,res) {

    var url = req.param('url');


    Article.find({"url": url}).remove().exec(function(err,data) {


        if(err) {
          console.log(err);
        }
        else{
          res.send("delete");
        }

    });
});


app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});