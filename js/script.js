let utility = document.querySelector(".utility");
let button = document.querySelector(".button");
let table = document.querySelector("table");
let tr = table.getElementsByClassName("toy")[0];
let tbody = table.querySelector("tbody");

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

let nameInput = document.querySelector("#parkNameInput");
let vehicleInput = document.querySelector("#vehicleTypeInput");
let latitudeInput = document.querySelector("#inputLatitude");
let longitudeInput = document.querySelector("#inputLongitude");
let emailInput = document.querySelector("#inputEmail");
let placesInput = document.querySelector("#numberPlacesInput");
let systemInput = document.querySelector("#inputSystem");

document.querySelector(".btn").addEventListener("click", (event) => {
    douaPark.insertParkLoot(nameInput.value,
        vehicleInput.value,
        latitudeInput.value,
        longitudeInput.value,
        emailInput.value,
        placesInput.value,
        systemInput.value);
    event.stopPropagation();
    event.preventDefault();
    clearTable();
    fillTable();
});

function clearTable() {
    while(tbody.firstChild)
        tbody.removeChild(tbody.firstChild);
}

function fillTable() {
    douaPark.parking.forEach((parking) => {
        let trCloned = tr.cloneNode(true);
        trCloned.className = "";
        trCloned.childNodes[1].textContent = parking.name;
        trCloned.childNodes[3].textContent = parking.vehicle;
        trCloned.childNodes[5].textContent = parking.coordinates.toString();
        trCloned.childNodes[7].textContent = parking.places.reserved;
        trCloned.childNodes[9].textContent = parking.email;
        trCloned.childNodes[11].textContent = parking.control;
        tbody.appendChild(trCloned);
    });
}

fillTable();

let search = document.querySelector(".search");
let suggestions = document.querySelector(".suggestions");
let searchInput = document.querySelector(".search_input");
let removeSuggestions = () => {
    while(suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
    }
};

function generateSuggestions(found) {
    removeSuggestions();
    found.forEach(suggestion => {
        let p = document.createElement("span");
        p.className = "suggestion";
        p.textContent = suggestion.name;
        p.addEventListener("click", (e) => {
            searchInput.value = p.textContent;
            setCenter(suggestion.coordinates);
            removeSuggestions();
            searchInput.focus();
        });
        suggestions.appendChild(p);
    });
}

let findSuggestions = () => {
    let found = [];
    douaPark.parking.forEach((parking) => {
        let regex1 = RegExp(searchInput.value, 'g');
        if(regex1.test(parking.name) && searchInput.value !== parking.name) {
            found.push({
                "name" : parking.name,
                "coordinates" : parking.coordinates
            });
            if(found.length === 3)
                generateSuggestions(found);
        }
    });
    if(found.length !== 0)
        generateSuggestions(found);
};

searchInput.addEventListener("input", findSuggestions);
search.addEventListener("blur", removeSuggestions);
searchInput.addEventListener("focus", findSuggestions);

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
let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.7789, lng: 4.8680},
        zoom: 15,
        disableDefaultUI: true
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        let coordinates = map.getBounds().toJSON();
        boundMap(coordinates);
    });
}

function setCenter(coordinates) {
    map.setCenter(coordinates.decimal());
    map.setZoom(15);
    boundMap(coordinates.decimal());
}
