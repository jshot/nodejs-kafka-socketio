
// call the packages we need
var express    	= require('express');
var compression = require('compression');
var bodyParser 	= require('body-parser');
var redis 		= require('redis');

GLOBAL.async 	= require('async');
app        		= express();

//configuration file
if(typeof process.env.NODE_ENV == "undefined")
{
	fileConfig = './cfg/local.json';
}
else fileConfig = './cfg/'+process.env.NODE_ENV+'.json';
GLOBAL.config = require('./'+fileConfig);
GLOBAL.redisClient = redis.createClient( config.redisPort, config.redisHost, function(err) { log.error(err); } );

//port app
var port = process.env.PORT;


app.use(compression());
app.use(bodyParser.json());


/*********** CONSUMER START HERE ***********/
var consumerSearch = require('./consumer/search');
consumerSearch.processSearch();



app.listen(port);
console.log('Running CONSUMER on PORT ' + port + ' . Environment : '+ (typeof process.env.NODE_ENV == "undefined" ? 'local' : process.env.NODE_ENV) );

