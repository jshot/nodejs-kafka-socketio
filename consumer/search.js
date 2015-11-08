var kafka = require('../libs/kafka');

exports.processSearch = function()
{
	//consume topic search-frontend
	kafka.consume('search-frontend', function(message)
    {
        var value = JSON.parse(message.value);

        //set timeout is simulation for searching in real world
        setTimeout(function()
        {
        	console.log('Success consume ' + message.value);

        	


        }, 3000); //just simulate searching takes 700ms long from database / external 3rd party API
    });
};