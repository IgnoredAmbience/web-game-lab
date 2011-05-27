// CONSTANTS
var GRAPHICS_MAX = 2;
var TILE_SIZE = 16;

// GLOBAL VARIABLES
var graphicsLevel = 1;
var frameInterval = 100;

var canvas;
var context;

var Player;
var scenery;
var mapHeight;
var mapWidth;


function updateStats (w,h,st,sh) {
  var wealth = document.getElementById("wealthDisplay");
  var health = document.getElementById("healthDisplay");
  var stealth = document.getElementById("stealthDisplay");
  var shelf = document.getElementById("shelfDisplay");
  
  wealth.innerHTML = "Wealth: " + w;
  health.innerHTML = "Health: " + h;
  stealth.innerHTML = "Stealth: " + st;
  shelf.innerHTML = "Shelf: " + sh;
}
