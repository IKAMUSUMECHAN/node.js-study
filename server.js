var express = require('express');
var app = express();
var fs = require("fs");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var bodyParser = require('body-parser');
var multer = require('multer');

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/filebox', express.static('filebox'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).array('image'));

app.get('/index.html', function (req, res) {
   res.sendFile(__dirname + "/" + "index.html");
})

app.get('/', function (req, res) {
   res.sendFile(__dirname + "/" + "post.htm");
})




app.post('/process_post', urlencodedParser, function (req, res) {
   // 输出 JSON 格式
   var response = {
      "first_name": req.body.first_name,
      "last_name": req.body.last_name
   };
   console.log(response);
   //res.end(JSON.stringify(response));
  /**  if (req.body.first_name == 123 && req.body.last_name == 123) {
      res.redirect('index.html')
   } else {
      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
      res.end('账号密码错误');
   }*/
   MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("fileupload");
       var whereStr = {"name":req.body.first_name};  // 查询条件

      dbo.collection("users").find(whereStr).toArray(function(err, result) {
          if (err) {throw err}
         
        else if(result[0]==undefined){
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end('账号不存在');
         }
        else if (result[0].psw==req.body.last_name){
           console.log("success");
           res.redirect('index.html');
        }
        else if (result[0].psw!=req.body.last_name){
         console.log("fail");
         res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
         res.end('密码错误');
      }
        console.log(result);
        db.close();
      });
  });

})

app.post('/file_upload', function (req, res) {

   console.log(req.files[0]);  // 上传的文件信息

   var des_file = "filebox/" + req.files[0].originalname;
   fs.readFile(req.files[0].path, function (err, data) {
      fs.writeFile(des_file, data, function (err) {
         if (err) {
            console.log(err);
            res.json('错误');
         } else {
            response = {
               message: 'File uploaded successfully',
               filename: req.files[0].originalname
            };
            res.redirect('index.html')
         }
         console.log(response); 

      });
   });

})


app.get('/filelist', function (req, res) {

   console.log("查看 /filebox 目录");
   fs.readdir("filebox", function (err, files) {
      if (err) {
         return console.error(err);
      }else{
         files.forEach(function (file) {
            console.log(file);
         });
      }
      res.send(files);
   });
})

app.get('/download', function (req, res) {
   res.redirect('filebox/back.png"')
   //res.sendFile(__dirname + "/filebox/" + "back.png");
})


app.get("/buttonClicked",function(req,res){
   console.log(req.query.value); //get param 
   var data = "send to client"
   res.send(data);
   res.end();
})