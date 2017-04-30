const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var countSchema = Schema({
	_id: {type: String, require:  true },
	seq: {type: Number, default: 0 }
});

var counter = mongoose.model('counter', countSchema);

var urlSchema = new Schema({
	_id: {type: Number, index: true},
	originalUrl: String,
	created: Date
});

urlSchema.pre('save', (next)=>{
	let doc = this;
	counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1}}, (err, counter)=>{
		if(err){
			return next(err);
		}
		doc._id = counter.seq;
		doc.create_at = new Date();
		next();
	})
})
var Url = mongoose.model('Url', urlSchema);

module.exports = Url;