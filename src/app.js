
var express = require('express');
var mongoose = require('mongoose');
var UrlEntry = require('./UrlEntry');
var createFullUrl = require('./url-utils');
var isValidUrl = require('./url-utils');
var getShortCode = require('./mongo-utils');
var isDuplicate = require('./mongo-utils');
var insertNew = require('./mongo-utils');
require('../.babelrc')


//import { UrlEntry } from './urlEntry';
// import { createFullUrl, isValidUrl } from './url-utils';
// import { getShortCode, isDuplicate, insertNew } from './mongo-utils';
 
mongoose.Promise = global.Promise;
 
export const app = express();
mongoose.connect('mongodb://localhost:27017/urlShortener');
 
app.get('/:shortCode', (req, res) => {
  let shortCode = parseInt(req.params.shortCode);
  if (isNaN(shortCode)) {
    res.status(200).json({ error: 'Invalid URL shortCode. It must be a number.' })
  } else {
    UrlEntry.findOne({ shortCode }).then(doc => {
      if (!doc) {
        res.status(404).json({ error: 'Page not found' });
      } else {
        res.redirect(doc.original);
      }
    });
  }
});
 
app.get('/new/*', (req, res) => {
  let url = req.params[0];
  if (isValidUrl(url)) {
    isDuplicate(url).then(exists => {
      if (exists) {
        res.status(500).json({ error: 'URL already exists in the database.', shortCode: exists });
      } else {
        insertNew(url).then(inserted => {
          res.status(200).json({ message: 'Url successfully shortened', url: createFullUrl(req, inserted.shortCode) });
        });
      }
    });
  } else {
    res.status(500).json({ error: 'Invalid URL format. Input URL must comply to the following: http(s)://(www.)domain.ext(/)(path)'});
  }
});



