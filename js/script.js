// Majd Odeh p1608951
// Cristian Chivriga p1612186

/************************************************/

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

/************************   Map   ************************/

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
            content[g].style.display = "flex";
            selected = g;
        }

        if(selected === 1) {
            // header.style.backgroundColor = "transparent";
            footer.style.display = "none";
        } else {
            // header.style.backgroundColor = "navbar-light";
            content[selected].style.display = "flex !important";
            footer.style.display = "flex";
        }
    });
}



/********************** Button toggle   **************************/

let btn_toggle = document.getElementById('btn_toggle');

btn_toggle.onclick = function () {
    if (this.innerHTML === "HIDE")
    this.innerHTML = "SHOW";
    else
        this.innerHTML = "HIDE";
};


function test(field, error, message) {
    if((!document.getElementById(field).value)||document.getElementById(field).value==="") {
        document.getElementById(error).innerHTML = message;
        // validated = false;
        return false;
    }else{
        document.getElementById(error).innerHTML = "";
        return true;
    }
}

/********************** Validate Form   **************************/


$('#inputNameParking').on('keyup focusout', function(){
    test('inputNameParking', 'nameError', "Enter Name!")
});

$('#inputTypeParking').on('keyup focusout', function() {
    test('inputTypeParking', 'typeError', "Enter Type!")
});

$('#inputLatitude').on('keyup focusout', function() {
    test('inputLatitude', 'latitudeError', "Enter latitude!")
});

$('#inputLongitude').on('keyup focusout', function() {
    test('inputLongitude', 'longitudeError', "Enter longitude!")
});

$('#inputPlaces').on('keyup focusout', function() {
    test('inputPlaces', 'placesError', "Enter places!")
});

$('#inputEmail').on('keyup focusout', function() {
    test('inputEmail', 'emailError', "Enter your email address!")
});

$('#inputSystem').on('keyup focusout', function() {
    let dropdown = document.getElementById('inputSystem').value;
    if(dropdown === ""){
        document.getElementById('systemError').innerHTML = "Choose a system!";
    }else{
        document.getElementById('systemError').innerHTML = "";
    }
});

function validateForm() {
    var validated = true;

    if(!test('inputNameParking', 'nameError', "Enter name!")){
        validated = false;
    }
    if(!test('inputTypeParking', 'typeError', "Enter Type!")){
        validated = false;
    }
    if(!test('inputLatitude', 'latitudeError', "Enter latitude!")){
        validated = false;
    }
    if(!test('inputLongitude', 'longitudeError', "Enter longitude!")){
        validated = false;
    }
    if(!test('inputPlaces', 'placesError', "Enter places!")){
        validated = false;
    }
    if(!test('inputEmail', 'emailError', "Enter your email address!")){
        validated = false;
    }
    let dropdown = document.getElementById('inputSystem').value;
    if(dropdown === ""){
        document.getElementById('systemError').innerHTML = "Choose a system!";
        return false
    }

    if(validated === true){
        addRow();
        emptyForm();
        successMessage();
    }
    return validated;
};

$(document).on('submit','#addParkingForm',function(){
    validateForm();
    $('[data-toggle="tooltip"]').tooltip('update');
    return false;
});


/********************** Validate Modal Form   **************************/

$('#inputNameParkingModal').on('keyup focusout', function(){
    test('inputNameParkingModal', 'nameErrorModal', "Enter Name!")
});

$('#inputTypeParkingModal').on('keyup focusout', function() {
    test('inputTypeParkingModal', 'typeErrorModal', "Enter Type!")
});

$('#inputLatitudeModal').on('keyup focusout', function() {
    test('inputLatitudeModal', 'latitudeErrorModal', "Enter latitude!")
});

$('#inputLongitudeModal').on('keyup focusout', function() {
    test('inputLongitudeModal', 'longitudeErrorModal', "Enter longitude!")
});

$('#inputPlacesModal').on('keyup focusout', function() {
    test('inputPlacesModal', 'placesErrorModal', "Enter places!")
});

$('#inputEmailModal').on('keyup focusout', function() {
    test('inputEmailModal', 'emailErrorModal', "Enter your email address!")
});

$('#inputSystemModal').on('keyup focusout', function() {
    let dropdown = document.getElementById('inputSystemModal').value;
    if(dropdown === ""){
        document.getElementById('systemErrorModal').innerHTML = "Choose a system!";
    }else{
        document.getElementById('systemErrorModal').innerHTML = "";
    }
});

function validateFormModal() {
    var validated = true;

    if(!test('inputNameParkingModal', 'nameErrorModal', "Enter name!")){
        validated = false;
    }
    if(!test('inputTypeParkingModal', 'typeErrorModal', "Enter Type!")){
        validated = false;
    }
    if(!test('inputLatitudeModal', 'latitudeErrorModal', "Enter latitude!")){
        validated = false;
    }
    if(!test('inputLongitudeModal', 'longitudeErrorModal', "Enter longitude!")){
        validated = false;
    }
    if(!test('inputPlacesModal', 'placesErrorModal', "Enter places!")){
        validated = false;
    }
    if(!test('inputEmailModal', 'emailErrorModal', "Enter your email address!")){
        validated = false;
    }
    let dropdown = document.getElementById('inputSystemModal').value;
    if(dropdown === ""){
        document.getElementById('systemErrorModal').innerHTML = "Choose a system!";
        return false
    }
    if(validated === true){
        modifyMessage();
    }
    return validated;
};

/********************** Search Table   **************************/

function tableSearch() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchField");
    filter = input.value.toUpperCase();
    table = document.getElementById("parkingTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

/********************** Delete Row from Table   **************************/

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("parkingTable").deleteRow(i);
}

/********************** Add row to table   **************************/

function addRow() {
    var table = document.getElementById("parkingTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);

    let vcell1 = document.getElementById('inputNameParking').value;
    let vcell2 = document.getElementById('inputTypeParking').value;
    let vcell3 = document.getElementById('inputLatitude').value;
    let vcell4 = document.getElementById('inputLongitude').value;
    let vcell5 = document.getElementById('inputPlaces').value;
    let vcell6 = document.getElementById('inputEmail').value;
    let vcell7 = document.getElementById('inputSystem').value;

    $(row).attr('data-name', vcell1);
    $(row).attr('data-type', vcell2);
    $(row).attr('data-latitude', vcell3);
    $(row).attr('data-longitude', vcell4);
    $(row).attr('data-places', vcell5);
    $(row).attr('data-email', vcell6);
    $(row).attr('data-system', vcell7);

    cell1.innerHTML = vcell1;
    cell2.innerHTML = vcell2;
    cell3.innerHTML = vcell3;
    cell4.innerHTML = vcell4;
    cell5.innerHTML = vcell5;
    cell6.innerHTML = vcell6;
    cell7.innerHTML = vcell7;
    cell8.innerHTML = '<span class="d-inline-block" data-target="#editModal" data-toggle="modal">\n' +
        '                                    <a class="editRow" href="#" data-toggle="tooltip" data-trigger="hover" title="Modify Parking">\n' +
        '                                        <img src="img/settings.svg" class="table-icon">\n' +
        '                                    </a>\n' +
        '                                </span>\n' +
        '                                <span class="d-inline-block" data-target="#deleteModal" data-toggle="modal">\n' +
        '                                    <a class="deleteRow" href="#" data-toggle="tooltip" data-trigger="hover" title="Delete Parking">\n' +
        '                                        <img src="img/rubbish-bin.svg" class="table-icon">\n' +
        '                                    </a>\n' +
        '                                </span>';

}

/********************** empty form   **************************/

function emptyForm() {
    document.getElementById('inputNameParking').value = '';
    document.getElementById('inputTypeParking').value = '';
    document.getElementById('inputLatitude').value = '';
    document.getElementById('inputLongitude').value = '';
    document.getElementById('inputPlaces').value = '';
    document.getElementById('inputEmail').value = '';
    document.getElementById('inputSystem').value = '';
}


/********************** modify row content   **************************/


function modifyRow(r) {
    var table = document.getElementById("parkingTable");
    var row = table.rows[r];

    let vcell1 = document.getElementById('inputNameParkingModal').value;
    let vcell2 = document.getElementById('inputTypeParkingModal').value;
    let vcell3 = document.getElementById('inputLatitudeModal').value;
    let vcell4 = document.getElementById('inputLongitudeModal').value;
    let vcell5 = document.getElementById('inputPlacesModal').value;
    let vcell6 = document.getElementById('inputEmailModal').value;
    let vcell7 = document.getElementById('inputSystemModal').value;

    $(row).attr('data-name', vcell1);
    $(row).attr('data-type', vcell2);
    $(row).attr('data-latitude', vcell3);
    $(row).attr('data-longitude', vcell4);
    $(row).attr('data-places', vcell5);
    $(row).attr('data-email', vcell6);
    $(row).attr('data-system', vcell7);

    row.cells[0].innerHTML = vcell1;
    row.cells[1].innerHTML = vcell2;
    row.cells[2].innerHTML = vcell3;
    row.cells[3].innerHTML = vcell4;
    row.cells[4].innerHTML = vcell5;
    row.cells[5].innerHTML = vcell6;
    row.cells[6].innerHTML = vcell7;
}

/********************** import row data into form   **************************/

function importData(r) {
    document.getElementById('inputNameParkingModal').value = $(r).attr('data-name');
    document.getElementById('inputTypeParkingModal').value = $(r).attr('data-type');
    document.getElementById('inputLatitudeModal').value = $(r).attr('data-latitude');
    document.getElementById('inputLongitudeModal').value = $(r).attr('data-longitude');
    document.getElementById('inputPlacesModal').value = $(r).attr('data-places');
    document.getElementById('inputEmailModal').value = $(r).attr('data-email');
    document.getElementById('inputSystemModal').value = $(r).attr('data-system');
}

/********************** alert messages   **************************/

function successMessage() {
    var div = document.getElementById("message");
    div.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">\n' +
        '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
        '    <span aria-hidden="true">&times;</span>\n' +
        '  </button>\n' +
        '  <strong>Done!</strong> The new parking was added successfully!\n' +
        '</div>';
}

function deleteMessage() {
    var div = document.getElementById("message");
    div.innerHTML = '<div class="alert alert-primary alert-dismissible fade show" role="alert">\n' +
        '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
        '    <span aria-hidden="true">&times;</span>\n' +
        '  </button>\n' +
        '  <strong>Done!</strong> The parking has been successfully deleted!\n' +
        '</div>';
}

function modifyMessage() {
    var div = document.getElementById("message");
    div.innerHTML = '<div class="alert alert-warning alert-dismissible fade show" role="alert">\n' +
        '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
        '    <span aria-hidden="true">&times;</span>\n' +
        '  </button>\n' +
        '  <strong>Done!</strong> The parking has been successfully modified!\n' +
        '</div>';
}

/********************** edit modal   **************************/

$(document).on("click", ".editRow", function () {
    var rowId = $(this).closest('tr')[0].rowIndex;
    var rowData = $(this).closest('tr');
    importData(rowData);
    $("#formButtonModal").attr("data-id", rowId);
});


$(document).on("click", "#formButtonModal", function () {
    var rowId = $(this).attr('data-id');
    if(validateFormModal()){
        modifyRow(rowId);
        $('#editModal').modal('hide');
    }
});

/********************** delete modal   **************************/

$(document).on("click", ".deleteRow", function () {
    var rowId = $(this).closest('tr')[0].rowIndex;
    $("#deleteButton").attr("data-id", rowId);
});

$(document).on("click", "#deleteButton", function () {
    var rowId = $(this).attr('data-id');
    document.getElementById("parkingTable").deleteRow(rowId);
    $('#deleteModal').modal('hide');
    deleteMessage();
});


