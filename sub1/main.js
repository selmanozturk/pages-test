// localStorage.clear()
if (localStorage.getItem('coffees') == null || localStorage.getItem('sliderStep') == null || !localStorage.getItem('resetData1')) {
  localStorage.setItem('coffees', JSON.stringify({
    "Headphone": {
      "price": "$49.99",
      "mid-range": "40"
    },
    "VR Glasses":{
      "price": "$89.99",
      "mid-range": "80"
    },
    "Drone": {
      "price": "$149.99",
      "mid-range": "120"
    },
    "Phone": {
      "price": "$799.99",
      "mid-range": "600"
    }
  }));
  localStorage.setItem('sliderStep', '50');
  localStorage.setItem('resetData1', true);
}

const $slider = document.querySelector('.scn');

$slider.style.width = window.innerHeight + 'px';
$slider.style.height = window.innerWidth + 'px';

var input = document.querySelector(".slider");

var coffees = window.coffees = JSON.parse(localStorage.getItem('coffees'));
var currentStep = window.currentStep = parseFloat(localStorage.getItem('sliderStep'));
input.value = currentStep;

var datasourceURL = "https://api.ommasign.com/v1/datasource/1814/force";


input.addEventListener("input", throttle(function () {
    setSliderStep(input.value);

    var postData = {};

    Object.keys(coffees).forEach(function(coffeeName) {
      var item = coffees[coffeeName];
      postData[coffeeName] = calculateNewPrice(item, currentStep);
    });

    // console.log(postData);
    request(postData);
  }, 100)
);

function throttle(cb, wait) {
  var timeout = undefined;
  return function () {
    if (timeout == undefined) {
      timeout = setTimeout(function () {
        cb();
        clearInterval(timeout);
        timeout = null;
      }, wait);
    }
  };
}

var request = function (data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", datasourceURL);
  xhr.setRequestHeader(
    "Authorization",
    "0a4d63da5f225b9836e45bed01163b8a8e1b79368bed9fa85ec81a5d94accc2d"
  );
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify({ data }));
  xhr.onload = function () {
    if (xhr.status !== 200) {
      console.log("Something went wrong", xhr.status);
    }
    console.log("Updated datasource");
  };
  xhr.onerror = function () {
    console.log("Request failed");
  };
};

function setSliderStep(val) {
  localStorage.setItem('sliderStep', val);
  currentStep = val;
}

function calculateNewPrice(item, step) {
  var diff = ((step - 50) / 100) * item['mid-range'] * 2;
  var newPrice = parseFloat(item.price.replace('$', '')) - diff;
  var priceAsString = newPrice.toFixed(2) + ' $';
  return priceAsString;
}