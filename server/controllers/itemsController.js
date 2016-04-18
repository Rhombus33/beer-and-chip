var ItemQuery = require('../queries/itemQueries');

module.exports = {
	get: function(req, res) {
		var eventID = req.params.eventID;
		ItemQuery.getAll(eventID, function(items){
			res.json(items);
		});
	},

	post: function(req, res) {
		var item = req.body;
		console.log(item);
		ItemQuery.addOne(item, function(newItem){
			res.json(newItem);
		});
	},

	put: function(req, res) {
		var itemID = req.params.itemID;
		var newAttrs = req.body;
		ItemQuery.updateOne(itemID, newAttrs, function() {
			res.send();
		})
	},

	delete: function(req, res) {
		var itemID = req.params.itemID;
		ItemQuery.deleteOne(itemID, function(){
			res.send();
		});
	}
}