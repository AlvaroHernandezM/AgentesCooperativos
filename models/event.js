var mongoose = require('mongoose')

//esquema 
var eventSchema = mongoose.Schema({
	name: String,
	state: {type:Boolean,default:true},
	numTickets: Number,
	price: Number,
	typeEvent: String,
	dateEvent: Number,
	agent: {type:String,default:'None'}
});
//Export the schema
module.exports = mongoose.model('Event', eventSchema);