//비동기
function aFunc() {
    setTimeout(function () {
        console.log('a');
    }, 2000)
}

function bFunc() {
    setTimeout(function () {
        console.log('b');
    }, 1000)
}

function cFunc() {
    setTimeout(function () {
        console.log('c');
    }, 500)
}

//a -> b -> c가 아니라 c -> b -> a 출력
//aFunc();
//bFunc();
//cFunc();

//비동기 특징
//출력 형태
//첫 번째 기능 -> 마지막 기능 -> 두 번째 기능 -> 텍스트 파일
/* var fs = require('fs');

console.log('첫 번째 기능');
fs.readFile('./example.txt', 'utf8', function(err, result) {
    if(err) {
        console.error(err);
        throw err;
    }
    else {
        console.error("두 번째 기능");
        console.log(result);
    }
});
console.log('마지막 기능'); */

//sync
//A -> 텍스트 파일 -> B
/* var fs2 = require('fs');
console.log('A');

var res = fs2.readFileSync('./example.txt','utf8');
console.log(res);

console.log('B'); */

//callback
//1 -> 두 번째 기능 -> 텍스트 파일 -> 2
var fs = require('fs');

function callbackFunction(callback) {
    fs.readFile('./example.txt', 'utf8', function(err, result) {
        if(err) {
            console.error(err);
            throw err;
        }
        else {
            console.error("두 번째 기능");
            callback(result);
        }
    });
}

console.log('1');
callbackFunction(function(data) {
    console.log(data); //텍스트 파일 읽어오기
    console.log('2');
})
