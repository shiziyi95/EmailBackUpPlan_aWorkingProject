var EventEmitter = require('events').EventEmitter;
var utils= require('util');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'1234',
	dateStrings:true,
	database:'ebp'
});
function sqlq(){
	EventEmitter.call(this);
}


sqlq.prototype.query=function(q){
	var self = this;
	console.log(q);
	conn.query(q,
	function(err,row,field){
		if(err){
			console.log('query failed');
			console.log(err);
		}else{

			self.emit("r",row);
		}
	}
	
);}
utils.inherits(sqlq,EventEmitter);
module.exports= sqlq;