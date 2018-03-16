var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');

var con = mysql.createConnection({
	multipleStatements: true,
host: 'localhost',
user: 'root',
password: 'xs241926126',
database: 'ebp',
});

app.use(express.static("."));

app.get('/',function (req, res){
  res.sendFile(path.join(__dirname+'/login.html'));
  console.log('done');
});

app.get('/login',function (req, res){
	var name = req.query.name;
	var pass = req.query.pass;
	
	var str = 'SELECT type FROM users WHERE username=\''+name+'\' AND password=\''+ pass+'\'';
	query.once('query', function(rows){
		if(err){
			console.log('Error');
			return 0;
		}
		else{
			if(rows.length>0){
					console.log(rows);
	//				req.session.userid = rows;
					res.send(rows);
			//	return res.redirect('/Getusers')
			}
			else
				return res.redirect('/');
		}
	});
	query.query(str);
);
});

app.get('/data',function (req, res){
//	var name = req.query.name;
//	var pass = req.query.pass;
	
	//var str = 'SELECT type FROM users WHERE username=\''+name+'\' AND password=\''+ pass+'\'';
	con.query('SELECT * FROM users',function(err, rows, fields){
			res.send(rows);
			
		}
);
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});



app.listen(3000);