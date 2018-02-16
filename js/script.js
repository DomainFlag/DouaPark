// let utility = document.querySelector(".utility");
// let button = document.querySelector(".button");
// let table = document.querySelector("table");
//
// let flag_slide_down = false;
// let utilityClass = utility.className;
//
// button.addEventListener("click", function() {
//     if(flag_slide_down) {
//         utility.className = utilityClass + " slide_down";
//     } else {
//         utility.className = utilityClass + " slide_up";
//     }
//
//     flag_slide_down = !flag_slide_down;
// });


/************************************************/
/*
No need for now.
 */
let keys = {
    "center" : "Lyon 1",
    // "latitude" : 72.0,
    // "longitude" : 120.0,
    "zoom" : 16,
    "size" : {
        x: 640,
        y: 640
    },
    "scale" : 2,
    "key" : "AIzaSyAKfZaL0aBsrWohb54sAiKRMLItyI4nBew"
};

let authority = "https://maps.googleapis.com/maps/api/staticmap?";

function urlConstructor() {
    let url = authority;
    for(let key in keys) {
        if(typeof keys[key] === "object") {
            url += key + "=" + keys[key].x + "x" + keys[key].y + "&";
        } else
            url += key + "=" + keys[key] + "&";
    }
    return url;
}

/************************************************/
function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.7789, lng: 4.8680},
        zoom: 15,
        disableDefaultUI: true
    });
}

let header = document.querySelector("nav");
let footer = document.querySelector("footer");

let content = [document.querySelector(".main"), document.querySelector("#map")];

let selected = 0;
let nav_links = document.getElementsByClassName("nav-link");
for(let g = 0; g < nav_links.length; g++) {
    nav_links[g].addEventListener("click", function(e) {
        if(selected !== g) {
            content[selected].style.display = "none";
            content[g].style.display = "initial";
            selected = g;
        }

        if(selected === 1) {
            header.style.backgroundColor = "transparent";
            footer.style.display = "none";
        } else {
            header.style.backgroundColor = "initial";
            footer.style.display = "initial !important";
        }
    });
}