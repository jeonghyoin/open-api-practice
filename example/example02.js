//배열 선언
var car1 = "Saab";
var car2 = "Volvo";
var car3 = "BMW";

var cars = ["Saab", "Volvo", "BMW"];

console.log(cars);
console.log(cars[0]);
console.log(cars[1]);
console.log(cars[2]);

var cars = [];
var car01 = {name : "sonata",ph : "500ph",
    //함수 선언
    start : function () {
        console.log("car01 engine is starting");
    },
    stop : function () {
        console.log("car01 engine is stoped");
    }
}

var car02 = {name : "BMW",ph : "600ph",
    start : function () {
        console.log("car02 engine is starting");
    },
    stop : function () {
        console.log("car02 engine is stoped");
    }
}

//객체를 담음
cars[0] = car01;
cars[1] = car02;

//BMW 출력
console.log(cars[1].name);
//2 출력
console.log(cars.length);