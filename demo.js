
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) 
{ 
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });
}
else 
{
	

	// call the packages we need
	var express    	= require('express');
	var compression = require('compression');
	var bodyParser 	= require('body-parser');
	var routes 		= require('./routes');
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
	var port = (process.env.PORT || config.portApp);
	

	app.use(compression());
	app.use(bodyParser.json());

	app.all('/*', function(req, res, next) 
	{
		if (req.method == 'OPTIONS') 
		{
			res.status(200).end();
		} 
		else 
		{
			next();
		}
	});

	//middleware for v1, if needed, customize here, like validate access token 
	app.all('/v1/*', function(req, res, next) 
	{
		//...
		next();
		//...
	});


	app.use('/', require('./routes'));


	app.listen(port);
	console.log('Running on PORT ' + port + ' . Environment : '+ (typeof process.env.NODE_ENV == "undefined" ? 'local' : process.env.NODE_ENV) );
	console.log('Worker ' + cluster.worker.id + ' running!');
}
