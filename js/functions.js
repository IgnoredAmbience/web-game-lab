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

var upKey;
var downKey;
var leftKey;
var rightKey;

function updateStats (w,h,st,sh) {
  var wealth = document.getElementById("wealthDisplay").innerHTML = "Wealth: " + w;
  var health = document.getElementById("healthDisplay").innerHTML = "Health: " + h;
  var stealth = document.getElementById("stealthDisplay").innerHTML = "Stealth: " + st;
  var shelf = document.getElementById("shelfDisplay").innerHTML = "Shelf: " + sh;
}

function setKeys () {
  upKey = document.getElementById("upKeyInput").value.charCodeAt(0);
  downKey = document.getElementById("downKeyInput").value.charCodeAt(0);
  leftKey = document.getElementById("leftKeyInput").value.charCodeAt(0);
  rightKey = document.getElementById("rightKeyInput").value.charCodeAt(0);
}

function init () {
  // Set up the drawing environment
  canvas = document.getElementById("canvas");
  context = this.canvas.getContext("2d");
  context.font = "bold 12px sans-serif";

  Player = new Actor (1,1,"black","player.png");
  document.addEventListener("keypress", keyPressed, true);

  setKeys();

  // "magic number" type crap that will be removed/implemented later
  var shops = new Array();
  shops.push(new Actor(3,8,"red","shop.png"));
  shops.push(new Actor(4,8,"red","shop.png"));

  loadMap(shops);

  // Draw the screen
  draw();

  updateStats(1,2,3,4);
}
