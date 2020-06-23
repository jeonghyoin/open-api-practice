//Request Modual
//request 모듈에서 모든 요청은 get 방식
var request = require('request');
/* request('http://www.naver.com', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
}); */

//날씨 정보 가져오기
request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body) {
    parser.parseString(body, function (err, jsonData) {
        var resultWeather = jsonData.rss.channel[0].item[0].description[0].header[0].wf[0];
        return resultWeather;
    })
});