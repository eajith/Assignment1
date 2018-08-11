/*
*
* Main file for the application should start the application using this file
*
*/

var http = require('http');
var url  = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

//creating the HTTP server
var httpServer = http.createServer(function(req,res){	

	//Getting the URL and parsing it
	var parsedUrl = url.parse(req.url,true);

	//Getting the path and trimming it
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	//Get the queryString
	var queryStringOject = parsedUrl.query;

	//Get the headers
	var headers = req.headers;

	//Get the payload
	var buffer = '';
	var decoder = new stringDecoder('utf-8');
	req.on('data',function(data){
		buffer +=decoder.write(data);
	});

	//Get the method
	var method = req.method.toLowerCase();
	

	req.on('end',function(){
		buffer +=decoder.end();

		//selecting the handler the request should go into
		var chosenHandler = typeof(routes[trimmedPath]) !=='undefined' ? routes[trimmedPath] : handlers.notFound;

		//constructing the data
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringOject' : queryStringOject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		}

		
		chosenHandler(data,function(statuscode,payload){

			//check if the status code is null if it is default to 200
			statuscode = typeof(statuscode) == 'number' ? statuscode : 200;

			//check if the payload if empty, if it is empty default to empty object
			payload = typeof(payload) == 'object' ? payload : {};

			//conver the payload ojbect to string
			var payloadString = JSON.stringify(payload);

			//response
			res.setHeader('Content-Type','application/json');
			res.writeHead(statuscode);
			res.end(payloadString);

			//Console the output
			console.log('Request received with : ',statuscode,payloadString);
			console.log('request received on path :'+trimmedPath + ' with method :' + method +'and with these querystring :', queryStringOject);

		}); 

	});

});

var handlers = {};

handlers.hello = function(data,callback){
	if(data.method == 'post'){
		callback(143,{'message':"you have hitted  the post route"})

	}else{
		callback(101,{'message':"You have hitted the get route"})
	}
}

handlers.notFound= function(data,callback){
	callback(404,{'message': 'SORRY the route not found'});
}


var routes = {
	'hello' : handlers.hello
}


//starting the HTTP server
httpServer.listen(config.httpPort,function(){
	console.log("Server started and listening on the port :"+config.httpPort);
});