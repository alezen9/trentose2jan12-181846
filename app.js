var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var fs = require('fs');

// per avere persistenza dei dati
var file_a;
var exists = fs.existsSync('data.json');
if (exists) {
  // legge il file se esiste
  console.log('loading database');
  var txt = fs.readFileSync('data.json', 'utf8');
  // lo mette nella variabile file_a come oggetto
  file_a = JSON.parse(txt);
} else {
  // altrimenti partiamo con un file vuoto
  console.log('empty database');
  file_a = {
			"astronauts": [],
			  "id": 0
			};
}




// to make it visible to the rest of the programm
module.exports = app;