// CONSTANTS
var GRAPHICS_MAX = 2;
var TILE_SIZE = 16;
var frameInterval = 200;

// GLOBAL VARIABLES
var graphicsLevel = 1;

// For rendering
var canvas;
var context;

var Player;
var scenery; // Array of elements in the background scenery
var mapHeight;
var mapWidth;
var viewX; // The (x,y) of the top left corner of the view
var viewY;
var halfWidth; // Hacky, not entirely necessary
var halfHeight;
var maxX;
var maxY;

// For alternate keymappings
var upKey;
var downKey;
var leftKey;
var rightKey;

function init () {
  // Set up the drawing environment
  canvas = document.getElementById("canvas");
  context = this.canvas.getContext("2d");
  context.font = "bold 12px sans-serif";
  halfWidth = (canvas.width/TILE_SIZE)/2;
  halfHeight = (canvas.height/TILE_SIZE)/2;

  // Set up the Player Actor and view boundaries based on the Player
  Player = new Actor (10,10,"black","sprites/player.png",1,2);
  maxX = Player.x + halfWidth;
  maxY = Player.y + halfHeight;
  viewX = Player.x - halfWidth;
  viewY = Player.y - halfHeight;

  document.addEventListener("keypress", keyPressed, true);

  setKeys();

  // "magic number" type crap that will be removed/implemented later
  var shops = new Array();
  shops.push(new Actor(3,8,"red","sprites/shop.png",2,0));
  shops.push(new Actor(4,8,"red","sprites/shop.png",2,0));

  loadMap(shops);

  // Draw the screen
  setInterval(draw,frameInterval);

  updateStats(1,2,3,4);
}

function updateStats (w,h,st,sh) {
  document.getElementById("wealthDisplay").innerHTML = "Wealth: " + w;
  document.getElementById("healthDisplay").innerHTML = "Health: " + h;
  document.getElementById("stealthDisplay").innerHTML = "Stealth: " + st;
  document.getElementById("shelfDisplay").innerHTML = "Shelf: " + sh;
}

// Toggles whether the settings panel is shown or not
function toggleSettings() {
  var panel = document.getElementById("settings").style;
  panel.visibility = (panel.visibility == "visible") ? "hidden" : "visible";
}

// Rebinds the movement keys
function setKeys () {
  upKey = document.getElementById("upKeyInput").value.charCodeAt(0);
  downKey = document.getElementById("downKeyInput").value.charCodeAt(0);
  leftKey = document.getElementById("leftKeyInput").value.charCodeAt(0);
  rightKey = document.getElementById("rightKeyInput").value.charCodeAt(0);
}

// Changes the detail level
function changeGraphics () {
  graphicsLevel = (graphicsLevel + 1) % GRAPHICS_MAX;
}
