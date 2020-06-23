//HTTP 클래스를 사용한 서버 구성
//8080번 포트, http://localhost:8080/으로 실행
var http = require("http");
var weather = require('./xmlToJsExample');

http.createServer(function (req, res) {
	var body = "hello Server";
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.end(weather.fetchWeatherData);
}).listen(3000);