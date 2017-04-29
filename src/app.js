'use strict';

var express = require('express');
var app = express();


//Connect to Pug and Public files
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

//Home Page
app.get('/', (req, res)=>{
	res.render('body');
})


//Obtain URL extension as Argument. Return a JSON object with Original and Shortened URL

app.get('/URL', (req, res)=>{
	
})


//Set up Server. 3000 for local and process.env.PORT for heroku.
app.listen(process.env.PORT || 3000, ()=> {
	console.log("The frontend server is running on port 3000 or Heroku");
});