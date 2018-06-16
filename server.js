
require('dotenv').config();

var express = require('express'),
    path = require("path"),
    app = express(),
    server = app.listen(5001),
    //DIST_DIR = path.join(__dirname, "dist"),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    activityController = require('./controllers/activity.controller');

/** MIDDLEWARES **/
mongoose.Promise = global.Promise;


//get content of incoming request under req.body
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));

//allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//serve site
//app.use(express.static(DIST_DIR));

//routes
app.use(require('./routes'));
/****************/

mongoose.connect(process.env.DB_URI).then(function(response){
    console.log('i am in !');
}).catch(error=>{
    console.log(error);
});

mongoose.connection.once('open',function(){
    console.log('connected');
}).on('error',function(error){
    console.log(error)
});