var express = require('express');
var app = express();
var fs = require("fs");

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

app.get('/index.htm', function (req, res) {
   res.sendFile(__dirname + "/" + "index.htm");
})

app.get('/', function (req, res) {
   res.sendFile(__dirname + "/" + "post.htm");
})

app.get('/filelist', function (req, res) {
   console.log("查看 /filebox 目录");
   fs.readdir("filebox", function (err, files) {
      if (err) {
         return console.error(err);
      }
      files.forEach(function (file) {
         console.log(file);
      });
      res.send(files);
   });
})

app.post('/process_post', urlencodedParser, function (req, res) {

   // 输出 JSON 格式
   var response = {
      "first_name": req.body.first_name,
      "last_name": req.body.last_name
   };
   console.log(response);
   //res.end(JSON.stringify(response));
   if (req.body.first_name == 123 && req.body.last_name == 123) {
      res.redirect('index.htm')
   } else {
      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
      res.end('账号密码错误');
   }

})


app.post('/file_upload', function (req, res) {

   console.log(req.files[0]);  // 上传的文件信息

   var des_file = "filebox/" + req.files[0].originalname;
   fs.readFile(req.files[0].path, function (err, data) {
      fs.writeFile(des_file, data, function (err) {
         if (err) {
            console.log(err);
         } else {
            response = {
               message: 'File uploaded successfully',
               filename: req.files[0].originalname
            };
         }
         console.log(response);
         res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
         console.log(JSON.stringify(response));
         res.end('上传成功');
         
      });

   });


})

