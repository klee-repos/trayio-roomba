
const fs = require('fs');
const Promise = require('bluebird');

// Input file
const inputFile = './input.txt';
const contentsArray = fs.readFileSync(inputFile).toString().split('\n');

// Global variables
var roombaData = {}
let locationsCleaned=[];

// This will generate roombaData object
var readData = function() {
    return new Promise(function(resolve, reject) {
        roombaData['dirtLocations'] = [];
        for (let i = 0; i < contentsArray.length; i++) {
            let firstDataPoint = parseInt(contentsArray[i].substring(0,1))
            let secondDataPoint = parseInt(contentsArray[i].substring(2))
            if (i === 0) {
                roombaData['roomDimensions'] = [firstDataPoint, secondDataPoint];
            }
            else if (i === 1) {
                roombaData['hooverStartPosition'] = [firstDataPoint, secondDataPoint];
                roombaData['hooverEndPostition'] = [firstDataPoint, secondDataPoint];
            }
            else if (i === contentsArray.length - 1) {
                roombaData['drivingDirections'] = contentsArray[i];
            }
            else {
                roombaData.dirtLocations.push([firstDataPoint, secondDataPoint])
            }
            roombaData['dirtBlocksCleaned'] = 0;
        }
        resolve()
    })
}

//Checks location for dirt
var checkForDirt = function(currentLocation) {
    let dirtLocations = roombaData.dirtLocations
    for (let i = 0; i < dirtLocations.length; i++) {
        if (dirtLocations[i][0] === currentLocation[0]) {
            if (dirtLocations[i][1] === currentLocation[1]) {
                dirtLocations.splice(i,1)
                roombaData.dirtBlocksCleaned += 1;
            }
        }
    }
}

//Navigations Roomba through the room
var navigateRoomba = function() {
    return new Promise(function(resolve, reject) {
        let x = roombaData.roomDimensions[0];
        let y = roombaData.roomDimensions[1];
        for (let i = 0; i < roombaData.drivingDirections.length; i++) {
            let direction = roombaData.drivingDirections.substring(i,i+1)
            let currentLocation = roombaData.hooverEndPostition;
            if (direction === "N") {
                if (currentLocation[1] < y ) {
                    currentLocation[1] += 1;
                    checkForDirt(currentLocation)
                }
            }
            if (direction === "E") {
                if (currentLocation[0] < x) {
                    currentLocation[0] += 1
                    checkForDirt(currentLocation)
                }
            }
            if (direction === "S") {
                if (currentLocation[1] > 0) {
                    currentLocation[1] -= 1
                    checkForDirt(currentLocation)
                }
            }
            if (direction === "W") {
                if (currentLocation[0] > 0) {
                    currentLocation[0] -= 1
                    checkForDirt(currentLocation)
                }
            } 
        }
        resolve()
    })
}


readData().then(function() {
    navigateRoomba().then(function() {
        console.log(roombaData.hooverEndPostition[0] + " " + roombaData.hooverEndPostition[1])
        console.log(roombaData.dirtBlocksCleaned)
    })
})
