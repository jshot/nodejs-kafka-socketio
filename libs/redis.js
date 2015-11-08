//redis custom library
var cacheType = 'API';

var storedKey = function(key)
{
	return config.environment.toUpperCase() + '#' + cacheType + '#' + key;
};

exports.get = function(param, callback) 
{
	var redisKey = storedKey(param.redisKey);

	if(typeof param.hapuscache !== 'undefined')
	{
		
		redisClient.del(redisKey);
		callback(null,null);
	}
	else
	{
		redisClient.get(redisKey, function (err, valueRedis) 
	    {
	    	if(err)
	    		callback(err, null);
	    	else
	    		callback(null, JSON.parse(valueRedis));
	    });
	}
};


exports.set = function(param)
{
	var redisKey = storedKey(param.redisKey);
	redisClient.set(redisKey, JSON.stringify(param.value));
	if(typeof param.redisExpired !== 'undefined')
		redisClient.expire(redisKey, param.redisExpired);
	
};
