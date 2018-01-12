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

// aggiungi astronauta
app.post('/',function(req,res){
	var astro_name = req.body.firstName;
	var astro_sur = req.body.lastName;
	var astro_isInSpace = req.body.isInSpace;
	file_a.id = file_a.id +1;
	file_a.astronauts.push({
		firstName: astro_name,
		lastName: astro_sur,
		isInSpace: astro_isInSpace,
		id: file_a.id
	})
	// aggiorniamo il json
	fs.writeFile('./data.json', JSON.stringify(file_a, null, 2), 'utf-8', function(err) {
		if (err) throw err;
		console.log('Succesfully added astronaut ' + astro_name);
	})

	var reply = {
		status: 'successfully added astronaut with following characteristics',
		firstName: astro_name,
		lastName: astro_sur,
		isInSpace: astro_isInSpace,
		id: file_a.id
	  }
	res.status(200).send(reply);
});


//mostra tutti gli astronauti presenti nel database
app.get('/',function(req,res){
	var reply = file_a.astronauts;
	console.log(JSON.stringify(reply, null, 2));
	res.send(reply);
});


//trova con id e mostra astronauta
app.get('/:id',function(req,res){
	var reply;
	var id = Number(req.params.id);
	var index = file_a.astronauts.findIndex(function(item, i){
	  return item.id=== id;
	});
	if(index<0){
		reply = 'astronaut not found';
		console.log(reply);
	}
	else{
		reply = file_a.astronauts[index];
		console.log(JSON.stringify(reply, null, 2));
	}
	res.send(reply);
});



//aggiorna dati di un astronauta con id
app.put('/:id',function(req,res){
	var reply;
	var id = Number(req.params.id);
	var astro_name;
	var astro_sur;
	var astro_isInSpace;
	var index = file_a.astronauts.findIndex(function(item, i){
		return item.id=== id;
	});
	if(index<=0){
		 reply = 'astronaut not found';
		console.log(reply);
	}
	else{
		if(!req.body.firstName){
			astro_name = file_a.astronauts[index].firstName;
		}
		else{
			astro_name = req.body.firstName;
		}
		if(!req.body.lastName){
			astro_sur = file_a.astronauts[index].lastName;
		}
		else{
			astro_sur = req.body.lastName;
		}
		if(!req.body.isInSpace){
			astro_isInSpace = file_a.users[index].isInSpace;
		}
		else{
			astro_isInSpace = req.body.isInSpace;
		}
		file_a.astronauts[index].firstName = astro_name;
		file_a.astronauts[index].lastName = astro_sur;
		file_a.astronauts[index].isInSpace = astro_isInSpace;
		reply = {
			status: 'successfully updated',
			firstName: astro_name,
			lastName: astro_sur,
			isInSpace: astro_isInSpace,
			id: file_a.astronauts[index].id
		}
		// aggiorno json
		fs.writeFile('./data.json', JSON.stringify(file_a, null, 2), 'utf-8', function(err) {
			if (err) throw err;
			console.log('Succesfully updated astronaut ' + astro_name);
		})
	}
	console.log(JSON.stringify(reply, null, 2));
	res.send(reply);
});



// to make it visible to the rest of the programm
module.exports = app;