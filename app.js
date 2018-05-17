const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongo = require('mongoJS');
const ObjectID = mongo.ObjectID;
const db = mongo('mongodb://pizzahut:d0m1n03s@ds237669.mlab.com:37669/moosejaw', ['roads']);
const app = express();
const google = require('@google/maps');


//Initialize Middle Ware
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

//Google maps
const googleMapsClient = google.createClient({
	key: 'AIzaSyDOojys9XUzySpVHVrkrTqttPw9o9Dthcw'
});


//Is this nessecary
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//For EJS
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
	res.locals.errors = null;
	next();
});


//Error Checking Middle Ware
app.use(expressValidator({
 errorFormatter: (param, msg, value) =>{
	var namespace = param.split('.'),
	root = namespace.shift(),
	formParam = root;

	while(namespace.length){
		formParam += '[' + namespace.shift() + ']';
	}
	return{
		param: formParam,
		msg  : msg,
		value: value
	};
  }
}));

//Initialize home Page
//TODO add a login page
app.get('/', (req,res)=>{

	db.roads.find((err,docs)=>{
		if(err){
			console.log(err);
		}
		res.render('index',{
		 "title":"Moose Jaw Roads",
		 "places": docs
	    });
	})

});

//load map page
app.get('/maps', (req,res)=>{
	db.roads.find((err,docs)=>{
		if(err){
			console.log(err);
		}
		res.render('maps',{
		 "title":"Moose Jaw Roads",
		 "places": docs
	    });
	})
});




app.post('/test', (req,res)=>{
	console.log(res);
	res.redirect('/');
});

// Page is as it says
app.post('/points/add', (req, res)=>{

	// Check for fields filled out
	req.checkBody('name', 'Name is Required]').notEmpty();
	req.checkBody('location', 'location is Required').notEmpty();
	req.checkBody('status', 'Status is Required').notEmpty();
	// TODO type checking on coordinates
	// Check for localization
	const errors = req.validationErrors();
	
	// Refuse and explain why
	// Else Insert the point
	if (errors){
		console.log('Error Inserting')
		db.roads.find((err ,docs)=>{
			if(err){
			console.log(err);
		    }
		    res.render('index',{
		      "title":"Moose Jaw Roads",
		      "places": docs,
		      "errors": errors
	    });
	})} 
	else {
		const newPoint = {
			"type": "Feature",
			"properties": {
				name: req.body.name,
				location: req.body.location,
				status: req.body.status
			},
			"geometry": {
				"type": "Point",
				"coordinates": req.body.coordinates
			}
		}

	    db.roads.insert(newPoint, (err,res)=>{
	    	if(err){
	    		console.log(err);
	    	}
	});}

	// Reload the page
	res.redirect('/');
});

// Delete the point, this might be exploitable
app.delete('/points/delete/:id', (req,res)=>{
	console.log(req.params.id);
	db.roads.remove({_id:ObjectID(req.params.id)},(err)=>{
		if(err){
			console.log(err);
		}
	});
	res.redirect('/');
});


//Start the server
app.listen(3000, ()=>{
	console.log('Server Started on 3000')
});
