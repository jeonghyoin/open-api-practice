var request = require('request');
var parseString = require('xml2js').parseString;

//날씨 정보 가져오기
function fetchWeatherData() {
    request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body) {
        var xml = body;
        parseString(xml, function (err, result) {
            //tree 구조
            console.log(result.rss.channel[0].item[0].description[0].header[0].wf);
        })
    });
}

module.exports.fetchWeatherData = fetchWeatherData();