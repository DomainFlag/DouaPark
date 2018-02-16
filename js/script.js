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
No need for now
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

// $('map')
//     .click(function(){
//         $(this).find('iframe').addClass('clicked')})
//     .mouseleave(function(){
//         $(this).find('iframe').removeClass('clicked')});

/*  Toggle button text  */
// $(function(){
//     $(".collapseButton").click(function () {
//         $(this).text(function(i, text){
//             return text === "Show" ? "Hide" : "Show";
//         })
//     });
// })

// var toggleButton = $(".collapseButton");
// toggleButton.on("click", function() {
//     toggleButton.data("text-original", toggleButton.text());
//     toggleButton.text(toggleButton.data("text-swap"));
// });

$("#collapseButton").button();
$('[#collapseButton]').click(function(){
    $(this).button('toggle');
    if ($(this).text()==="Closed"){
        $(this).button('open');
    }
    else {
        $(this).button('reset');
    }
});


$(".collapseButton").toggle(function() {
    $(this).text("DON'T PUSH ME");
}, function() {
    $(this).text("PUSH ME");
});

/*  Table delete row    */

function deleteParkingRow(Element) {
    Element.parent()
}
