'use strict';

const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var config = require('/Users/davidflick/Documents/fcc/URL-Shortener/config.js');
var Url = require('/Users/davidflick/Documents/fcc/URL-Shortener/url');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//Connect to Pug and Public files
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

//Home Page
app.get('/', (req, res)=>{
	res.render('body');
})

//Obtain URL extension as Argument. Return a JSON object with Original and Shortened URL
app.get('/short/*', (req, res)=>{

	req.params.original = req.params['0'];
	let randomNum = Math.floor(Math.random() * 100);
	res.json({
		Original: req.params['0'],
		Short: 'http://' + req.hostname + '/' + randomNum,
	})
	res.send(req.params);
})



//Set up Server. 3000 for local and process.env.PORT for heroku.
app.listen(process.env.PORT || 3000, ()=> {
	console.log("The frontend server is running on port 3000 or Heroku");
});









