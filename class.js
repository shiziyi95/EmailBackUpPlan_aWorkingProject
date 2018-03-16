var express = require('express');
var app= express();
app.use(express.static("."));
var bodyParser = require('body-parser'); app.use(bodyParser.urlencoded({ extended: true })); app.use(bodyParser.json());

var sqlquery1 = require("./query.js");
var query = new sqlquery1();
var path = require('path');
var session =require('client-sessions');
app.use(session({
	cookieName: 'session',
	secret: 'asdfasdf23423',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

var mysql = require('mysql');
var conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'1234',
	dateStrings:true,
	database:'ebp'
});

app.get('/class',function (req, res){
	console.log("to class page");
	res.sendFile(path.join(path.dirname(require.main.filename),"class2.html"));
});
app.post('/class2',function (req, res){
	res.redirect("/class");
});
app.get('/editclass',function (req, res){
	res.sendFile(path.join(path.dirname(require.main.filename),"editclass2.html"));
});
app.post('/editclass2',function (req, res){
	console.log("to editclass");
	res.redirect("/editclass");
});
app.post('/login',function (req, res){
	console.log(req.body);
	var name = req.body.name;
	var pass = req.body.pass;
	
	var str = 'SELECT id FROM user WHERE email=\''+name+'\' AND password=\''+ pass+'\'';
	console.log(str);
	conn.query(str, function(err,rows,field){
		if(err){
			console.log('Error');
			return 0;
		}
		else{
			if(rows.length>0){
				console.log(rows);
				req.session.userid=rows[0].id;
				res.redirect('/class');
			}
			else{
				console.log("user not found");
				res.redirect('/');
			}
		}
	});
//	query.query(str);
});

app.get("/getclass",function(req,res){
	console.log("get class");
	var sql="select classid, name,instructor,email, time, day from class";
	sql +=" where user= \""
	sql +=req.session.userid;
	sql+= "\""
	sql += " order by time;"
	query.once('r', function(msg){
		res.send(msg);
	});
	query.query(sql);
});
app.get("/getuser",function(req,res){
	var sql="select name,email from user";
	sql +=" where user= \""
	sql +=req.session.userid;
	sql+= "\"";
	query.once('r', function(msg){
		res.send(msg);
	});
	query.query(sql);
});
app.get("/sendemail", function(req,res){
	var sql="select user.name as username,user.email as useremail,class.instructor,class.name as classname,class.email as classemail from class left join user on class.user = user.id";
	sql +=" where user= \""
	sql +=req.session.userid;
	sql +="\" and classid=\""
	sql +=req.query.id;
	sql+= "\";"
	query.once('r', function(msg){
		var sql2="select excuse from excuse where id=\""
		var sql3="select count(id) as total from excuse;";
		query.once('r', function(msg3){
			var x = Math.floor((Math.random() * msg3[0].total) + 1);
			sql2+= x;
			sql2+="\";";
			query.once('r', function(msg2){
				var mailto = "mailto:" + msg[0].classemail
				var subject = "?subject="+ escape("Absent, " + msg[0].classname)
				var body = "&body="+ escape("Hello professor " + msg[0].instructor + ",") + escape('\r\n')+ escape('\r\n')+ escape(msg2[0].excuse) + escape('\r\n') + escape('\r\n')+ escape("Regards,") +escape('\r\n') + escape(msg[0].username) // NO MORE THAN 2K CHARACTERS
				
				//console.log(body);
				var link1 = mailto + subject + body;
				res.send(link1);

			});
			query.query(sql2);
		});
		query.query(sql3);
	});
	query.query(sql);
});
app.post("/subm",function(req,res){
	if(req.body.selectedid=="-1"){
		var sql="insert into class (name, user, instructor, email, time, day) values(\"";
		sql += req.body.classname;
		sql += "\" , \"";
		sql += req.session.userid;
		sql += "\" , \"";
		sql += req.body.instructor;
		sql += "\" , \"";
		sql += req.body.email;
		sql += "\" , \"";
		sql += req.body.time;
		sql += ":";
		sql += req.body.time2;
		sql += "\" , \"";
		sql += req.body.day;
		sql += "\");";
	}
	else{
		var sql="update class set name= \"";
		sql += req.body.classname;
		sql += "\" , instructor= \"";
		sql += req.body.instructor;
		sql += "\" , email= \"";
		sql += req.body.email;
		sql += "\" , time= \"";
		sql += req.body.time;
		sql += ":";
		sql += req.body.time2;
		sql += "\" ,day= \"";
		sql += req.body.day;
		sql +="\" where classid=\""
		sql +=req.body.selectedid;
		sql+= "\";"
	}
	query.once('r', function(msg){

	});
	query.query(sql);
	res.redirect("/class");
});

app.get("/selectedid",function(req,res){
	var sql="select classid, name,instructor,email, time, day from class"
	sql +=" where classid=\""
	sql +=req.query.classid;
	sql +="\";";
	query.once('r', function(msg){
		res.send(msg);
	});
	query.query(sql);
});
app.listen(8080,function(){console.log('running')});