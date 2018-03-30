let canvas = document.querySelector("canvas");
let gl = canvas.getContext("webgl");

gl.canvas.width = document.body.clientWidth;
gl.canvas.height = document.body.clientHeight;

const clipspaceOffsetX = 60/gl.canvas.width*2.0;
const clipspaceOffsetY = 24/gl.canvas.height*2.0;

let matrices = {
    "translation": function(x, y) {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ];
    },
    "translationOForth": function(x, y) {
        return [
            1, 0, 0,
            0, 1, 0,
            -x, -y, 1
        ];
    },
    "translationOBack": function(x, y) {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ];
    },
    "rotation": function(s, c) {
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },
    "idMatrix" : function() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]
    },
    "vector" : function(nb) {
        let coordinates = [];
        for(g = 0; g < nb*3; g++)
            coordinates.push(0);
        return coordinates;
    }
};

function multiplyMatrices() {
    let mat = matrices["idMatrix"]();
    for (let a = 0; a < arguments.length; a++) {
        let matProv = mat.slice();
        for (let g = 0; g < 3; g++) {
            for (let h = 0; h < 3; h++) {
                mat[g*3+h] = 0;
                for (let i = 0; i < 3; i++) {
                    mat[g*3+h] += matProv[g*3+i]*arguments[a][i*3+h];
                }
            }
        }
    }
    return mat;
}

function multiplyMatrixWithVector(matrix, vector) {
    let result = matrices["vector"](vector.length/3);
    for(let t = 0; t < vector.length/3; t++)
        for(let g = 0; g < 3; g++)
            for(let h = 0; h < 3; h++)
                result[t*3+g] += vector[t*3+h]*matrix[h*3+g];
    return result;
}

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.subtract = function(v) {
    return new Vector(this.x-v.x, this.y-v.y);
};

Vector.prototype.clip = function() {
    this.x = this.x/gl.canvas.width*2.0;
    this.y = this.y/gl.canvas.height*2.0;
};

function Coordinates(longitude, latitude) {
    let coordinates = longitude.match(/(\d)+/g);
    this.longitude = {
        "degree" : Number(coordinates[0]),
        "minutes" : Number(coordinates[1]),
        "seconds" : Number(coordinates[2]),
        "direction" : longitude.match(/([A-Za-z])+/g)[0]
    };
    coordinates = latitude.match(/(\d)+/g);
    this.latitude = {
        "degree" : Number(coordinates[0]),
        "minutes" : Number(coordinates[1]),
        "seconds" : Number(coordinates[2]),
        "direction" : latitude.match(/([A-Za-z])+/g)[0]
    };
}

Coordinates.prototype.toString = function() {
    return "" +
        this.longitude.degree + "° " +
        this.longitude.minutes + "' " +
        this.longitude.seconds + "\" " +
        this.longitude.direction + "\n" +

        this.latitude.degree + "° " +
        this.latitude.minutes + "' " +
        this.latitude.seconds + "\" " +
        this.latitude.direction;
};

let directions = {
    "north": 1,
    "east": 1,
    "west": -1,
    "south": -1
};

Coordinates.prototype.decimal = function() {
    return {
        "lat" : directions[this.latitude.direction]*(this.latitude.degree + this.latitude.minutes/60 + this.latitude.seconds/3600),
        "lng" : directions[this.longitude.direction]*(this.longitude.degree + this.longitude.minutes/60 + this.longitude.seconds/3600)
    };
};

function Lot() {
    this.width = clipspaceOffsetX-1;
    this.height = clipspaceOffsetY-1;
    this.angle = 0;
    this.translation = new Vector(0, 0);
}

Lot.prototype.fetchCoordinates = function(offset) {
    return [
        -1, -1, 1,
        -1, this.height, 1,
        -1+offset, this.height, 1,
        -1+offset, this.height, 1,
        -1+offset, -1, 1,
        -1, -1, 1,

        -1+offset, -1, 1,
        -1+offset, this.height, 1,
        this.width, this.height, 1,
        this.width, this.height, 1,
        this.width, -1, 1,
        -1+offset, -1, 1
    ];
};

function Park(name, vehicle, latitude, longitude, places, email, system) {
    this.name = name;
    this.vehicle = vehicle;
    this.coordinates = new Coordinates(longitude, latitude);
    this.places = {
        "reserved" : places,
        "free" : places-15
    };
    this.email = email;
    this.control = system;
    this.lot = new Lot();
}


Park.prototype.fetchCoordinates = function() {
    let offsetProportion = this.places.reserved/(this.places.reserved+this.places.free);
    let offset = (1+this.lot.width)*offsetProportion;
    return this.lot.fetchCoordinates(offset);
};

Park.prototype.checkBounds = function(coordinates) {
    let coord = this.coordinates.decimal();
    return coord["lng"] >= coordinates["west"] &&
        coord["lng"] <= coordinates["east"] &&
        coord["lat"] >= coordinates["south"] &&
        coord["lat"] <= coordinates["north"];
};

Park.prototype.clipCoordinates = function(coordinates) {
    let offsetLng = coordinates["east"] - coordinates["west"];
    let offsetLat = coordinates["north"] - coordinates["south"];

    let coord = this.coordinates.decimal();
    this.lot.translation.x = (coord["lng"]-coordinates["west"])/offsetLng*2.0-1;
    this.lot.translation.y = (coord["lat"]-coordinates["south"])/offsetLat*2.0-1;
};


Park.prototype.transformationMatrix = function() {
    let idMatrix = matrices["idMatrix"]();
    let translationOForth = matrices["translationOForth"](-1, -1);
    let translation = matrices["translation"](this.lot.translation.x-clipspaceOffsetX/2, this.lot.translation.y-clipspaceOffsetY/2);
    let rotation = matrices["rotation"](Math.sin(this.lot.angle), Math.cos(this.lot.angle));

    return multiplyMatrices(translationOForth, translation);
};

function DouaPark() {
    this.parking = [];
    this.bound = [];
    this.insertParkLoot("Nautibus", "Car", "45°46'53\"north", "4°52'20\"east", 20, "Cchivriga@hotmail.com", "Camera");
    this.insertParkLoot("Grignard", "Car", "45°46'56\"north", "4°52'15\"east", 18, "DomainFlag2@gmail.com", "Camera");
    this.insertParkLoot("Quoi 43", "Car", "45°46'50\"north", "4°52'12\"east", 18, "DomainFlag2@gmail.com", "Camera");
    this.insertParkLoot("Chisinau", "Bicycle", "47°00'33.1\" north", "28°49'29.3\"east", 100, "Cchivriga@hotmail.com", "Wood");
}

DouaPark.prototype.insertParkLoot = function(name, vehicle, latitude, longitude, places, email, system) {
    this.parking.push(new Park(name, vehicle, latitude, longitude, places, email, system));
};

DouaPark.prototype.fetchCoordinate = function(park) {
    return multiplyMatrixWithVector(park.transformationMatrix(), park.fetchCoordinates());
};

DouaPark.prototype.fetchCoordinates = function() {
    let coordinates = [];
    for(let g = 0; g < this.bound.length; g++) {
        coordinates = coordinates.concat(multiplyMatrixWithVector(this.bound[g].transformationMatrix(), this.bound[g].fetchCoordinates()));
    }
    return coordinates;
};

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16)/255,
        parseInt(result[2], 16)/255,
        parseInt(result[3], 16)/255
    ] : null;
}

const colorsHex = [
    "#2DC30A", "#ffffff",
    "#F85A40", "#ffffff",
    "#FD9F3E", "#ffffff",
    "#2F88A7", "#ffffff"
];


let colors = [];

for(let g = 0; g < colorsHex.length; g++) {
    colors.push(hexToRgb(colorsHex[g]));
}

DouaPark.prototype.colors = function() {
    let palette = [];
    for(let g = 0; g < this.bound.length; g++) {
        for(let h = 0; h < 6; h++) {
            palette = palette.concat(colors[g*2%colors.length]);
        }
        for(let h = 0; h < 6; h++) {
            palette = palette.concat(colors[(g*2+1)%colors.length]);
        }
    }
    return palette;
};

let douaPark = new DouaPark();

let vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    void main() {
        gl_Position = vec4(vec3(a_position.xy, 0), 1);
        v_color = a_color;
    }
`;

let fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
        gl_FragColor = vec4(v_color, 1);
    }
`;

function createShader(gl, source, type) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success)
        return shader;
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success)
        return program;
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resize(gl) {
    let realToCSSPixels = window.devicePixelRatio;

    let displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
    let displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

    if (gl.canvas.width  !== displayWidth ||
        gl.canvas.height !== displayHeight) {

        gl.canvas.width  = displayWidth;
        gl.canvas.height = displayHeight;
    }
}

canvas.addEventListener("click", mousedown);

function mousedown(e) {
    let minX, minY, maxX, maxY;
    for(let g = 0; g < douaPark.parking.length; g++) {
        let coordinates = douaPark.fetchCoordinate(douaPark.parking[g]);
        minX = coordinates[0];
        minY = coordinates[1];
        maxX = coordinates[6];
        maxY = coordinates[7];

        let clipspaceX = e.pageX/canvas.getBoundingClientRect().width*2.0-1.0;
        let clipspaceY = -(e.pageY/canvas.getBoundingClientRect().height*2.0-1.0);

        if(clipspaceX >= minX && clipspaceX <= maxX &&
            clipspaceY >= minY && clipspaceY <= maxY) {
            popup.style.display = "flex";
            popup.className = "popup_appear_in";
        }
    }
}


// canvas.addEventListener("mousedown", mousedown);
// let focused = null;
// let currentPos = null;
// let direction = null;
//
// function mousedown(e) {
//     let minX, minY, maxX, maxY;
//     for(let g = 0; g < douaPark.parking.length; g++) {
//         minX = douaPark.parking[g].dimensions[0];
//         minY = douaPark.parking[g].dimensions[1];
//         maxX = douaPark.parking[g].dimensions[4];
//         maxY = douaPark.parking[g].dimensions[5];
//
//         let clipspaceX = e.pageX/gl.canvas.width*2.0-1.0;
//         let clipspaceY = e.pageY/gl.canvas.height*2.0-1.0;
//
//         if(clipspaceX >= minX && clipspaceX <= maxX && clipspaceY >= minY-clipspaceOffsetY && clipspaceY <= minY+clipspaceOffsetY) {
//             action(e, g, "bottom");
//         } else if(clipspaceX >= minX && clipspaceX <= maxX && clipspaceY >= maxY-clipspaceOffsetY && clipspaceY <= maxY+clipspaceOffsetY) {
//             action(e, g, "top");
//         } else if(clipspaceY >= minY && clipspaceY <= maxY && clipspaceX >= minX-clipspaceOffsetX && clipspaceX <= minX+clipspaceOffsetX) {
//             action(e, g, "left");
//         } else if(clipspaceY >= minY && clipspaceY <= maxY && clipspaceX >= maxX-clipspaceOffsetX && clipspaceX <= maxX+clipspaceOffsetX) {
//             action(e, g, "right");
//         } else if(clipspaceX >= minX && clipspaceX <= maxX &&
//             clipspaceY >= minY && clipspaceY <= maxY) {
//             action(e, g, null);
//         }
//     }
// }
//
// function action(e, g, orientation) {
//     currentPos = new Vector(e.pageX, e.pageY);
//     focused = douaPark.parking[g].dimensions;
//     canvas.removeEventListener("mousedown", mousedown);
//     canvas.addEventListener("mouseup", mouseup);
//     direction = orientation;
//
//     if(!direction)
//         canvas.addEventListener("mousemove", mousemoveTranslate);
//     else
//         canvas.addEventListener("mousemove", mousemoveResize);
// }
//
// function mouseup(e) {
//     canvas.addEventListener("mousedown", mousedown);
//     canvas.removeEventListener("mouseup", mouseup);
//     canvas.removeEventListener("mousemove", mousemoveTranslate);
//     canvas.removeEventListener("mousemove", mousemoveResize);
//     focused = null;
//     currentPos = null;
// }
//
//
// function mousemoveResize(e) {
//     let newPos = new Vector(e.pageX, e.pageY);
//     let offsetPos = newPos.subtract(currentPos);
//     offsetPos.clip();
//     switch(direction) {
//         case "left" : {
//             focused[0] += offsetPos.x;
//             focused[2] += offsetPos.x;
//             focused[10] += offsetPos.x;
//             break;
//         }
//         case "right" : {
//             focused[4] += offsetPos.x;
//             focused[6] += offsetPos.x;
//             focused[8] += offsetPos.x;
//             break;
//         }
//         case "top" : {
//             focused[3] += offsetPos.y;
//             focused[5] += offsetPos.y;
//             focused[7] += offsetPos.y;
//             break;
//         }
//         case "bottom" : {
//             focused[1] += offsetPos.y;
//             focused[9] += offsetPos.y;
//             focused[11] += offsetPos.y;
//             break;
//         }
//     }
//     currentPos = newPos;
//     drawMap(gl);
// }
//
// function mousemoveTranslate(e) {
//     let newPos = new Vector(e.pageX, e.pageY);
//     let offsetPos = newPos.subtract(currentPos);
//     offsetPos.clip();
//     for(let g = 0; g < focused.length; g += 2) {
//         focused[g] += offsetPos.x;
//         focused[g+1] += offsetPos.y;
//     }
//     currentPos = newPos;
//     drawMap(gl);
// }

function drawMap(gl) {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(douaPark.colors()), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(douaPark.fetchCoordinates()), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, douaPark.bound.length*12);
}

function boundMap(coordinates) {
    douaPark.bound.length = 0;
    for(let g = 0; g < douaPark.parking.length; g++) {
        if(douaPark.parking[g].checkBounds(coordinates)) {
            douaPark.bound.push(douaPark.parking[g]);
            douaPark.bound[douaPark.bound.length-1].clipCoordinates(coordinates);
        }
    }

    if(douaPark.bound.length !== 0)
        drawMap(gl);
    else {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

let a_color, positionLocation;
let positionBuffer, colorBuffer;

if(gl) {
    resize(gl);
    let vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    let program = createProgram(gl, vertexShader, fragmentShader);

    positionLocation = gl.getAttribLocation(program, "a_position");
    a_color = gl.getAttribLocation(program, "a_color");

    positionBuffer = gl.createBuffer();
    colorBuffer = gl.createBuffer();

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.enableVertexAttribArray(a_color);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}