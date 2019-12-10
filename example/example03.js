//반복문
var cars = ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi"];
var text = "";

var i;
for (i = 0; i < cars.length; i++) {	
    text += cars[i] + " ";
    if (cars[i] === "BMW") {
        console.log("BMW 존재!");
    } else {
        console.log("BMW 없음!");
    }
}

console.log(text);