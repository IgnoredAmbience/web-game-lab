// CONSTANTS
var GRAPHICS_MAX = 2;
var TILE_SIZE = 16;

// GLOBAL VARIABLES
var Player;
var graphicsLevel = 1;


function init() {
  Scene.init();
  Player = new Actor (1,1,"black","player.png");

  var shops = new Array();
  shops.push(new Shop(3,8,"red"));
  shops.push(new Shop(4,8,"red"));

  Scene.loadMap(shops);

  document.addEventListener("keypress", keyPressed, true);

  Scene.draw();

  updateStats(1,2,3,4);
}

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

function changeGraphics () {
  graphicsLevel = (graphicsLevel + 1) % GRAPHICS_MAX;
  Scene.draw();
}
