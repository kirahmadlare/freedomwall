var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var methodOverride = require('method-override');
var port = process.env.port || 3000;

//app config

mongoose.connect("mongodb://freedomwall:Hrxtrfktcvd7pth@ds031087.mlab.com:31087/freedomwall");
//mongoose.connect('mongodb://localhost/freedomwall');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

//mongoose scheema
var Schema = mongoose.Schema;

//create wallSchema

var wallSchema = new Schema({
	author: String,
	image: String,
	body: String,
	created: {type:Date, default: Date.now}

});

var Wall = mongoose.model('Wall',wallSchema); //attach schema

// Wall.create({
// 	author: "Anon",
// 	image: "http://www.kzeequotes.com/wp-content/uploads/2016/02/sad-crying-boy-image.jpg",
// 	body: "I feel sad when I'm not with you"
// });

app.get('/',function(req,res){
	res.redirect('/walls');

});


//INDEX get all page
app.get('/walls',function(req,res){

	Wall.find({},function(err,walls){
		if(err){
			console.log(err);
		}else { 
			res.render('index',{walls:walls});
		}
		
	});

});

//NEW WALL
app.get('/walls/new',function(req,res){
	res.render("new",{err:""});

});
//CREATE WALL
app.post('/walls',function(req,res){

//check if author is blank replace it with ANONYMOUSE
req.body.wall.author = req.body.wall.author || 'anonymous';
//santiize
req.body.wall.body = req.sanitize(req.body.wall.body);


Wall.create(req.body.wall,function(err,newWall){
	if(err){
		res.render("new",{err:"error"});
	}else{
		res.redirect("/walls");

	}

	});

});

//show route

app.get('/walls/:id',function(req,res){
	Wall.findById(req.params.id, function(err,foundWall){
		if(err){
			res.redirect('/walls');
		}else
		{
			res.render("show",{wall:foundWall});
		}
	});
});


//EDIT ROUTE

app.get('/walls/:id/edit',function(req,res){
	Wall.findById(req.params.id,function(err,foundWall){
			if(err){
				res.redirect('/wall');
			}else{
				res.render('edit',{wall:foundWall});
			}
	});

});

//UPDATE ROUTE

app.put('/walls/:id',function(req,res){
//check if empty
	req.body.wall.author = req.body.wall.author || 'anonymous';
//santiize
	req.body.wall.body = req.sanitize(req.body.wall.body);
Wall.findByIdAndUpdate(req.params.id,req.body.wall,function(err,updatedWall){
		if(err){
			res.redirect('/walls');
		}else{
			res.redirect("/walls/" + req.params.id);
		}


	});

});


//deleet route

app.delete("/walls/:id",function(req,res){
	//restroy blog
	Wall.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect('/walls');
		}else{
			res.redirect('/walls');
		}
	});
	
});


app.listen(port,process.env.IP,function(){
console.log("server is running");
});
