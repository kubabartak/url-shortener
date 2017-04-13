
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const short_urls = require('./models/short_urls');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));
//conect to database


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/short_urls', function(err){
    if (err) return console.log("error")}
);


// database entry. (*) to use whole string, not diveded wirt "/" 
app.get('/new/:urlToShorten(*)', function (req, res){
var urlToShorten = req.params.urlToShorten;  
   
  
  // test if string is valid Url
  var validate = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        if (validate.test(urlToShorten)) {        
            var short = Math.floor(Math.random()*100000).toString();
            var dbEntry = new short_urls({
                originalUrl: urlToShorten, 
    shorterUrl: short
            })
            dbEntry.save(function(err){
                if (err) {
                    return res.send("Error saving to database");
                } console.log("db entry successfull")
            });
            
            var data = { 'Your url': urlToShorten, 
                       "short url": short};
    res.json(data);
             } else {
                 data = {"error": "Enter valid url"};
                 res.json(data)}
        });

// redirect to url with short url 

app.get('/:urlToForward', function(req, res){
    var url = req.params.urlToForward;
    short_urls.findOne({'shorterUrl': url}, function (err, db){
        if (err) return res.send("Error reading database"); 
       else if (db===null) {return res.send("No such url in database");} else {
           var reg = new RegExp("^(http|https)://", "i");
          if (reg.test(url)) {res.redirect(301, db.originalUrl);}
           else {res.redirect(301, 'http://'+ db.originalUrl)}
       }
    })
    
})


// listen
// ()=> stands for ES5 function(){}
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server runs");
})