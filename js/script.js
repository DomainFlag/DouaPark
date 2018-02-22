let utility = document.querySelector(".utility");
let button = document.querySelector(".button");
let table = document.querySelector("table");

let flag_slide_down = false;
let utilityClass = utility.className;

button.addEventListener("click", function() {
    if(flag_slide_down) {
        utility.className = utilityClass + " slide_down";
    } else {
        utility.className = utilityClass + " slide_up";
    }

    flag_slide_down = !flag_slide_down;
});


let keys = {
    "center" : "Lyon 1",
    "latitude" : 72.0,
    "longitude" : 120.0,
    "zoom" : 16,
    "size" : {
        x: 640,
        y: 640
    },
    "scale" : 2,
    "key" : "AIzaSyAKfZaL0aBsrWohb54sAiKRMLItyI4nBew"
};

/************************************************/
function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.7789, lng: 4.8680},
        zoom: 15,
        disableDefaultUI: true
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        let coordinates = map.getBounds().toJSON();
        boundMap(coordinates);
    });
}
