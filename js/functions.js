// CONSTANTS
var GRAPHICS_MAX = 2;
var TILE_SIZE = 24;
var SPRITE_SIZE = 16;
var frameInterval = 200;
var NUM_TILES = 8; 

// GLOBAL VARIABLES

// For rendering
var canvas;
var context;

var Player;
var players;
var scenery; // Array of elements in the background scenery
var tiles; // 2D array of background tiles
var mapHeight;
var mapWidth;
var minX; // The (x,y) of the top left corner of the view
var minY;
var maxX;
var maxY;
var halfWidth; // Hacky, not entirely necessary
var halfHeight;

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
  canvas.width = 32*TILE_SIZE;
  canvas.height = 32*TILE_SIZE;
  halfWidth = (canvas.width/TILE_SIZE)/2;
  halfHeight = (canvas.height/TILE_SIZE)/2;

  players = new Array();

  loadMap();

  loadBackground();

  Notifications.init();

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
  var httpRequest = Ajax('GET', 'player', true);
  httpRequest.send(null);
  httpRequest.onload = function(evt) {
    if(httpRequest.status != 200) {
      return;
    } else {
      var p = JSON.parse(httpRequest.responseText);
      loginPlayer(p);
    }
  }
}

function login () {
  var username = document.getElementById("userBox").value;

  var httpRequest = Ajax('POST', 'login', true);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send(requestString({name: username}));
  httpRequest.onload = function(evt) {
    if(httpRequest.status != 200) return;

    var p = JSON.parse(httpRequest.responseText);
    loginPlayer(p);
  }
}

function loginPlayer (p) {
  var texture = new Image ();
  texture.src = "sprites/player" + SPRITE_SIZE + ".png";
  Player = p.id;
  players[Player] = p;
  actorify(players[Player], "black",texture,1,2);
  setView(players[Player]);
  updateStats(players[Player])
  document.getElementById("loginName").innerHTML = players[Player].name;
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("logoutBox").style.display = "inline";
}

function logout () {
  var httpRequest = Ajax('POST', "logout", false);
  httpRequest.send(null);
  Player = null;
  updateStats();
  document.getElementById("logoutBox").style.display = "none";
  document.getElementById("loginBox").style.display = "inline";
}

function updateStats (p) {
  if(!p) {
    document.getElementById('playerStats').style.display = 'none';
  } else {
    document.getElementById('playerStats').style.display = 'inline';
    document.getElementById("wealthDisplay").innerHTML = "Wealth: " + p.wealth;
    document.getElementById("healthDisplay").innerHTML = "Health: " + p.health;
    document.getElementById("stealthDisplay").innerHTML = "Stealth: " + p.stealth;
    document.getElementById("shelfDisplay").innerHTML = "Shelf: " + p.shelf;
  }
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

function requestString (data) {
  var parts = [];
  for (field in data) {
    parts.push(encodeURIComponent(field) + '=' + encodeURIComponent(data[field]));
  }
  return parts.join('&');
}

function Ajax(method, uri, async, multipart) {
  var r = new XMLHttpRequest();
  if(multipart != undefined && multipart) {
    r.multipart = true;
  }
  r.open(method, uri, async);
  r.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  return r;
}

// Taken from the Mozilla ECMAScript reference
if ( !Function.prototype.bind ) {
  Function.prototype.bind = function( obj ) {
    if(typeof this !== 'function') // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');

    var slice = [].slice,
        args = slice.call(arguments, 1),
        self = this,
        nop = function () {},
        bound = function () {
          return self.apply( this instanceof nop ? this : ( obj || {} ),
            args.concat( slice.call(arguments) ) );
        };

    bound.prototype = this.prototype;
    return bound;
  };
}
