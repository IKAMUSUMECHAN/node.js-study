var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("fileupload");
    var myobj = { name: "123", psw: "123" };
    dbo.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("插入成功");
        db.close();
    });
});