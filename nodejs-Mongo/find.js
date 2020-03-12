var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("fileupload");
     var whereStr = {"name":'123'};  // 查询条件
    dbo.collection("users").find(whereStr).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
		console.log(result[0].name);
		if (result[0].psw==123){
			console.log("success");
		};
		db.close();
    });
});