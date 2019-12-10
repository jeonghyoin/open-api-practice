//db
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'fintech'
});
connection.connect();

//express.js
var express = require("express"),
app = express();

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

//템플렛 추가
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//index
app.get("/", function (request, response) {
    var user_name = request.query.user_name;
    var user_contents = request.query.user_contents;
    response.end("Hello " + user_name + "! " + user_contents);
});

//get
app.get("/member", function (req, res) {
    var temp;
    connection.query('SELECT * FROM fintech.member', function (error, results) {
        if (error) throw error;
        temp = results
        res.send(temp);
    });      
});

//html 띄우기 - ejs
app.get('/test', function(req, res) {
    res.render('test'); //파일명
});

app.listen(port);
console.log("Listening on port ", port);
