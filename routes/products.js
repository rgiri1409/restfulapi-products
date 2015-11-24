var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('productdb', server);


db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'productdb' database");
		db.collection('products', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'products' collection doesn't exist. Creating it with sample...");
				populateDB();
			}
		});
	}
	
});


exports.findAll = function(req, res) {
	db.collection('products', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};


exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving Product: ' + id);
	db.collection('products',function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.addProduct = function(req, res) {
	var product = req.body;
	console.log('Adding Product: ' + JSON.stringify(product));
	db.collection('products', function(err, collection) {
		collection.insert(product, {strict:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error occurs'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateProduct = function(req, res) {
	var id = req.params.id;
	var product = req.body;
	console.log('Updating product: ' + id);
	console.log(JSON.stringify(product));
	db.collection('products', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, product, {strict:true}, function(err, result) {
			if (err) {
				console.log('Error in updating Product: ' + err);
				res.send({'error':'Error occured'});
			} else {
				console.log('' + result + 'Product updated');
				res.send(product);
			}
		});
	});
}

exports.deleteProduct = function(req, res) {
	var id = req.params.id;
	console.log('Deleting Product: ' + id);
	db.collection('products', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {strict:true}, function(err, result) {
			if (err) {
				res.send({'error': 'Error Occurred' + err});
			} else {
				console.log('' +result + 'Product deleted');
				res.send(req.body);
			}
		});
	});
}

//populate database with data sample

var populateDB = function() {

	var products = [
	{
		name: "Ammoclean Detergent",
		Category: "All Purpose",
		Size: "5L",
		Price: 34.57,
		ExpiryDate: "12092016",
		Logopic: "ammo.jpg"
	},
	{
		name: "Cleanbreak(H&G)",
		Category: "Heavy Duty",
		Size: "15L",
		Price: 85.78,
		ExpiryDate: "11122017",
		Logopic: "break-h&g.jpg"
	},
    {
    	name: "Spray Clean",
    	Category: "Washroom Cleaner",
    	Size: "10L",
    	Price: 67.55,
    	ExpiryDate: "02042017",
    	Logopic: "spray.jpg"
    }];

    db.collection('products', function(err, collection) {
    	collection.insert(products, {strict:true}, function(err, result) {});
    });

 };

	
	
