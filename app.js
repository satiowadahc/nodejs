const express = require('express');
const bodyParder = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongo = require('mongoJS');
const ObjectID = mongo.ObjectID;
const db = mongo('mongodb://pizzahut:d0m1n03s@ds237669.mlab.com:37669/moosejaw', ['roads']);
const app = express();


app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(bodyParder.json());
app.use(bodyParder.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
	res.locals.errors = null;
	next();
});

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


app.post('/points/add', (req, res)=>{
	req.checkBody('name', 'Name is Required]').notEmpty();
	req.checkBody('location', 'location is Required').notEmpty();
	req.checkBody('status', 'Status is Required').notEmpty();

	const errors = req.validationErrors();
	
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
	})	
		
	} else {
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
	    });
	    
	}
	res.redirect('/');
});


app.delete('/points/delete/:id', (req,res)=>{
	//TODO test ids
	console.log(req.params.id);
	db.roads.remove({_id:ObjectID(req.params.id)},(err)=>{
		if(err){
			console.log(err);
		}
	});
	res.redirect('/');
});

app.listen(3000, ()=>{
	console.log('Server Started on 3000')
});
