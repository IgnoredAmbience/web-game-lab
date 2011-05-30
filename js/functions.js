// CONSTANTS
var GRAPHICS_MAX = 2;
var TILE_SIZE = 16;

// GLOBAL VARIABLES
var graphicsLevel = 1;
var frameInterval = 10;

var canvas;
var context;

var Player;
var scenery;
var mapHeight;
var mapWidth;


function updateStats (w,h,st,sh) {
  var wealth = document.getElementById("wealthDisplay").innerHTML = "Wealth: " + w;
  var health = document.getElementById("healthDisplay").innerHTML = "Health: " + h;
  var stealth = document.getElementById("stealthDisplay").innerHTML = "Stealth: " + st;
  var shelf = document.getElementById("shelfDisplay").innerHTML = "Shelf: " + sh;
}
