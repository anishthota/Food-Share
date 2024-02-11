function enterLocation() {
    address = document.getElementById("locationInput").value
    //address = address.split(" ")
    console.log(address)
    //slkdfjsld = "maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyCYOozU4ZE1B7NJhnkSpmQj2mqZ2Z0FEsM"
    coordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address[0] + "+" + address[1] + "+" + address[2] + "+" + address[3] + "&key=AIzaSyCYOozU4ZE1B7NJhnkSpmQj2mqZ2Z0FEsM"

    // Make a GET request
    fetch(coordinates)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        lat = data.results[0].geometry.location.lat
        lng = data.results[0].geometry.location.lng
    })
    .catch(error => {
        console.error('Error:', error);
    });
    initMap(lat, lng,address)
}

let map;
let service;
let infowindow;
let lat, lng;


function initMap(latitude,longitude,address) {

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
  });
  var pyrmont = new google.maps.LatLng(latitude, longitude);
  if (address != undefined) {query = 'Food Pantry Near' + address}
  else {query = ""}
  const request = {
    location: pyrmont,
    radius: '100000',
    query: query
  };

  service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
        console.log(results, status)
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < 8; i++) {
            createMarker(results[i]);
          }
          map.setCenter(results[0].geometry.location);
        }
        list(results)
      });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

function list(places) {
    document.getElementById("locationList").innerHTML = ""
    for (i = 0; i <= 8; i++) {
        rating = places[i].rating
        if (rating == 0) {rating = "No Ratings"}
        document.getElementById('locationList').innerHTML += "<div class='card' <br> <label class='cardTitle'> " + places[i].name + ' - <label class="rating">' + rating + '</label></label> <br> <p>' + places[i].formatted_address + '</p></div>'
    }
}

function game() {
    window.location = "game.html"
}
function search() {window.location = "index.html"}
function wishlist() {window.location = "wishlist.html"}


interval = setInterval(timeUpdate, 1000)
time = 0
money = 100
bread = 0
apples = 0
pasta = 0
var customerbread, customerapples, customerpasta;
var paystatus = false;
function timeUpdate() {
    time++; document.getElementById("time").innerHTML = "Time: " + time
    if (time % 20 == 10) {
        customerbread = Math.round(Math.random() * 6)
        customerapples = Math.round(Math.random() * 3)
        customerpasta = Math.round(Math.random() * 2)
        document.getElementById("customer").innerHTML = "<h4>Customer</h4>" + "Bread: " + customerbread + "<br> Apples: " + customerapples + "<br> Pasta: " + customerpasta + "<br> <button id='pay' onclick='pay()'>Pay</button>"
        document.getElementById("buyBread").style.display = "none"
        document.getElementById("buyApple").style.display = "none"
        document.getElementById("buyPasta").style.display = "none"
    }
    if (time == 20) {
        if (paystatus != true) {alert("YOU FAILED!"); window.location = "index.html"}
        clearInterval(interval)
        document.getElementById("endOfTheDayResults").style.display = "block"
        document.getElementById("endOfTheDayBread").innerHTML = "Bread: " + bread;
        document.getElementById("endOfTheDayApple").innerHTML = "Apples: " + apples;
        document.getElementById("endOfTheDayPasta").innerHTML = "Pasta: " + pasta;
        time = 0;
    }
}


function addBread() {if (money - 4 < 0) {alert("Too expensive!"); return} bread++; money = money - 4; update()}
function addApple() {if (money - 5 < 0) {alert("Too expensive!"); return} apples++; money = money - 5; update()}
function addPasta() {if (money - 8 < 0) {alert("Too expensive!"); return} pasta++; money = money - 8; update()}

function update() {
    document.getElementById("breadLabel").innerHTML = "Bread: " + bread
    document.getElementById("appleLabel").innerHTML = "Apples: " + apples
    document.getElementById("pastaLabel").innerHTML = "Pasta: " + pasta
    document.getElementById("money").innerHTML = "Money: $" + money
}

function pay() {
    bread = bread - customerbread; 
    apples = apples - customerapples; 
    pasta = pasta - customerpasta; 
    if ((bread < 0) || (apples < 0) || (pasta < 0)) {alert("YOU FAILED!"); window.location = "index.html"}
    money = money + customerbread *4 +customerapples*5 + customerpasta*8;
    document.getElementById("customer").innerHTML = ""
    update()
    paystatus = true;
    document.getElementById("buyBread").style.display = "block"
    document.getElementById("buyApple").style.display = "block"
    document.getElementById("buyPasta").style.display = "block"
}

function donate() {
    alert("Successful Donation!")
    bread = 0
    apples = 0
    pasta = 0
    document.getElementById("endOfTheDayResults").style.display = "none"
    update()
    interval = setInterval(timeUpdate, 1000)
}
