var express = require('express')
var mongoose = require('mongoose')
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server); 

//var messages = [{
//		id:1,
//		text:"Conexión satisfactoria con el servidor",
//		asunt:"Mensaje bienvenida"
//	}]

app.use(express.static('server/public'))
var Agent = require('../models/agent')
var Event = require('../models/event')
routes = require('../routes/router')(app,io,Event);

//conectando a bd
mongoose.connect('mongodb://localhost/app_agents')

var db = mongoose.connection;


db.on('error', console.error.bind(console, 'conexión a bd con error:'));
db.once('open', function() {
	console.log('Abierta la bd');
});

//comando on dice se queda escuchando el servidor
io.on('connection', function(socket){ //cliente que ha mandado el mensaje
	//console.log('Alguien se ha conectado con Socket: '+socket.id+' - '+socket.handshake.sessionID)
	var idSocket = socket.id;
	var agent = new Agent({id:idSocket});
	//almacena el agente por id
	agent.save(function(err, agent){
		if(err) return console.error(err);
		console.log('Se ha guardado el agente con id: '+socket.id);
	});
	//socket.join(socket.handshake.sessionID); 2
	//enviando id asginado en la bd al cliente
	if (io.sockets.connected[idSocket]) {
    	io.sockets.connected[idSocket].emit('welcome', idSocket); //dinero
	} else{
		console.log('Se ha desconectado el cliente mientras se guardaba en la db, borrandolo');
		Agent.remove({ id: idSocket }, function (err) {
		if (err) return handleError(err);
		  	console.log('Usuario desconectado y eliminado db: '+idSocket);
		});
		//db.agents.find({'state':True}).count()
	}
	//io.to(socket#id).emit('hey')
	//socket.emit('messages',messages);
	//socket.on('reply-message', function(data){

	//	messages.push(data);
	//	console.log(messages);
		//io.sockets.emit('messages', messages);
	//});
	socket.on('reply-message',function(data){
		console.log(data);
		if(data.response=='money'){
			console.log('Es sobre dinero: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
			  agent.money = data.value;
			  agent.save(function(err, agent){
			  	if(err) return console.error(err);
			  	console.log('Se ha actualizado agente con money: '+agent.money);
			  });
			});
		} else if(data.response=='numSales') {
			console.log('Es sobre numSales: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
			  agent.numSales = data.value;
			  agent.save(function(err, agent){
			  	if(err) return console.error(err);
			  	console.log('Se ha actualizado agente con numSales: '+agent.numSales);
			  });
			});
		} else if(data.response=='timeSale') {
			console.log('Es sobre timeSale: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
			  agent.timeSale = data.value;
			  agent.save(function(err, agent){
			  	if(err) return console.error(err);
			  	console.log('Se ha actualizado agente con timeSale: '+agent.timeSale);
			  });
			});
		} else if(data.response=='gain') {
			console.log('Es sobre gain: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
			  agent.gain = data.value;
			  agent.save(function(err, agent){
			  	if(err) return console.error(err);
			  	console.log('Se ha actualizado agente con gain: '+agent.gain);
			  });
			});
		} else if(data.response=='typeEvent') {
			console.log('Es sobre typeEvent: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
			  agent.typeEvent = data.value;
			  agent.save(function(err, agent){
			  	if(err) return console.error(err);
			  	console.log('Se ha actualizado agente con typeEvent: '+agent.typeEvent);
			  });
			});
		}
	});

	socket.on('disconnect', function(){
		Agent.remove({ id: idSocket }, function (err) {
		if (err) return handleError(err);
		  	console.log('Agente desconectado y eliminado db: '+idSocket);
		});
	});
});

server.listen(8080, function() {  
    Agent.remove({}, function (err) {
		if (err) return handleError(err);
		  	console.log('Eliminados todos agentes db');
		});
    Event.remove({}, function (err) {
		if (err) return handleError(err);
		  	console.log('Eliminados todos eventos db');
		});
    console.log('Servidor corriendo en http://localhost:8080');
});