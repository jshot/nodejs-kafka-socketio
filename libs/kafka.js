var kafka = require('kafka-node-slim');
var random = require("random-js")(); // uses the nativeMath engine

var totalKafkaPartition = 2;

exports.insertProducer = function(topic, dataProducer)
{
	var HighLevelProducer = kafka.HighLevelProducer;
	var KeyedMessage = kafka.KeyedMessage;
	var client = new kafka.Client(config.kafkaZookeeperServer);
	var producer = new HighLevelProducer(client);

	var payloads = [];
	var key = '', km = null;
	
	producer.on('ready', function() 
	{

		key = topic + '#' + (new Date().getTime());
		km = new KeyedMessage(key, JSON.stringify(dataProducer));
		var randomPartition = random.integer(0, (totalKafkaPartition-1));
		payloads.push({ 
            topic: topic,
            messages: km,
            partition: randomPartition,
            attributes: 1, //gzip
        });

		
		producer.send(payloads, function (err, val) 
        {
        	if(err)
        		console.error('Failed insert kafka topic : ' + topic, err.message);
        	console.log(val);
        	producer.close();
        });
		

        
	});
};


exports.consume = function(topic, callback)
{

	var consumerGroup = topic + '-group';
	var client = new kafka.Client(config.kafkaZookeeperServer);
	var HighLevelConsumer = kafka.HighLevelConsumer;
    var consumerKafka = new HighLevelConsumer(
        client,
        [
            { topic: topic }
        ],
        {
            // Group
            groupId: consumerGroup

        }
    );

    consumerKafka.on('error', function (err) {
        console.error('ERROR CONSUME ' + topic, JSON.stringify(err));
    });

    consumerKafka.on('message', function (message) 
    {
        callback(message);
    });

};