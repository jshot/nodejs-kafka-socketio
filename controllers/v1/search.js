var redis = require('../../libs/redis');
var kafka = require('../../libs/kafka');
var random = require("random-js")(); // uses the nativeMath engine

exports.find = function(req, res)
{
	var productID = req.params.productID || null;
	if(!productID)
	{
		res.json({status:'failed', message:'Invalid product ID'});
		return;
	}


	//if product id sent
	//check from redis
	var keyRedis = 'SEARCH#' + productID;
	var checkRedis = function(callback)
    {
        var getRedis = req.query;
        getRedis.redisKey = keyRedis;
        redis.get(getRedis, function(err, result)
        {
            if(err)
            {
                console.error('Error get redis '+ keyRedis, err);
                callback(null, null);
                return;
            }

            if(result)
                callback(null, JSON.parse(result) );
            else
                callback(null, null);

        });
    };

    //check from database
    var getFromDB = function(result, callback)
    {
    	//if any result from checkRedis
    	if(result)
    	{
    		//then instantly parse into callback
    		callback(null, result);
    		return;
    	}

    	var dataStore = {data : random.integer(0,100) };

    	//if redis empty
    	//get from DB, but for demo, I use random data
    	var setRedis = {};
        setRedis.redisKey = keyRedis;
        setRedis.redisExpired = 5 * 60; //5 minutes stored to redis

        //store random data, but it could be changed read from database mysql / mongodb
        setRedis.value = JSON.stringify(dataStore);
        redis.set(setRedis);


        /**** INSERT KAFKA BROKER ****/
        kafka.insertProducer('search-frontend', dataStore);

        callback(null, dataStore);
    };

    async.waterfall([checkRedis, getFromDB], function(err, result)
    {
    	if(err)
    	{
    		res.json({status:'failed'});
    		return;
    	}

    	res.json({status: 'success', result : result});
    });


		
};