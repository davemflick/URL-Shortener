var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var shortid = require('shortid');
var validUrl = require('valid-url');
var config = require('../config');

//Set up URL that points to database
var url = 'mongodb://' + config.db.host + '/' + config.db.name; //Add /databaseName when created
var MongoClient = mongodb.MongoClient;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'URL-Shortener' });
});

//GET url
router.get('/new/:url(*)', function (req, res, next) {
	  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")

      var collection = db.collection('links');
      var params = req.params.url;

      //sets current hostname to var local
      var local = req.get('host') + "/";

      var newLink = function (db, callback) {
        collection.findOne({ "url": params }, { short: 1, _id: 0 }, function (err, doc) {
          if (doc != null) {
            res.json({ original: params, short: local + doc.short });
          } else {
            if (validUrl.isUri(params)) {
              // if URL is valid, do this
              var shortCode = shortid.generate();
              var newUrl = { url: params, short: shortCode };
              collection.insert([newUrl]);
              res.json({ original: params, short: local + shortCode });
            } else {
            // if URL is invalid, do this
              res.json({ error: "Incorrect url format." });
            };
          };
        });
      };

		newLink(db, function () {
		  db.close();
		});
	  };
	});
});


router.get('/:short', function (req, res, next) {

    MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")

      var collection = db.collection('links');
      var params = req.params.short;

      var findLink = function (db, callback) {
        collection.findOne({ "short": params }, { url: 1, _id: 0 }, function (err, doc) {
          if (doc != null) {
            res.redirect(doc.url);
          } else {
            res.json({ error: "No shortlink database." });
          };
        });
      };

      findLink(db, function () {
        db.close();
      });

    };
  });
});



module.exports = router;
