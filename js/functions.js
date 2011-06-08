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

var tiles;

function init () {
  // Set up the drawing environment
  canvas = document.getElementById("canvas");
  context = this.canvas.getContext("2d");
  context.font = "bold 12px sans-serif";
  halfWidth = (canvas.width/TILE_SIZE)/2;
  halfHeight = (canvas.height/TILE_SIZE)/2;

  loadMap();

  loadBackground();

  // Set up the view boundaries
  setView({x:(mapWidth/2),y:(mapHeight/2)});

  document.addEventListener("keypress", keyPressed, false);
  setKeys();

  checkLogin();

  // Draw the screen
  setInterval(draw,frameInterval);

  document.getElementById("userBox").focus();
}

function checkLogin () {
  var httpRequest = Ajax('GET', 'player', false);
  httpRequest.send(null);
  if(httpRequest.status != 200) {
    return;
  } else {
    var p = JSON.parse(httpRequest.responseText);
    loginPlayer(p);
  }
}

function login () {
  var username = document.getElementById("userBox").value;

  var httpRequest = Ajax('POST', 'login', false);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send(requestString({name: username}));
  if(httpRequest.status != 200) return;

  var p = JSON.parse(httpRequest.responseText);
  loginPlayer(p);
}

function loginPlayer (p) {
  Player = new Actor (p.x, p.y, "black", "sprites/player.png",1,2);
  setView(Player);
  updateStats(p)
  document.getElementById("loginName").innerHTML = p.name;
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("logoutBox").style.display = "inline";
}

function logout () {
  var httpRequest = Ajax('POST', "logout", false);
  httpRequest.send(null);
  Player = null;
  document.getElementById("logoutBox").style.display = "none";
  document.getElementById("loginBox").style.display = "inline";
}

function updateStats (p) {
  document.getElementById("wealthDisplay").innerHTML = "Wealth: " + p.wealth;
  document.getElementById("healthDisplay").innerHTML = "Health: " + p.health;
  document.getElementById("stealthDisplay").innerHTML = "Stealth: " + p.stealth;
  document.getElementById("shelfDisplay").innerHTML = "Shelf: " + p.shelf;
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

function requestString (data) {
  var parts = [];
  for (field in data) {
    parts.push(encodeURIComponent(field) + '=' + encodeURIComponent(data[field]));
  }
  return parts.join('&');
}

function Ajax(method, uri, async) {
  var r = new XMLHttpRequest();
  r.open(method, uri, async);
  r.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  return r;
}
