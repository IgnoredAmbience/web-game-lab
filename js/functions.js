// CONSTANTS
var TILE_SIZE = 16; // Rendered size of each tile
var SPRITE_SIZE = 16; // Size of each texture
var frameInterval = 100; // 1/framerate in ms
var NUM_TILES = 8; // Number of base background tiles
var TIMEOUT = 500; // Number of miliseconds for move timeouts

// GLOBAL VARIABLES

// For rendering
var canvas;
var context;

var Player;
var players;
var scenery; // Array of elements in the background scenery
var background;
var mapHeight;
var mapWidth;
var minX; // The (x,y) of the top left corner of the view
var minY;
var maxX;
var maxY;
var halfWidth; // Hacky, not entirely necessary
var halfHeight;

var shelfSprite; // 1 shared image for all attacks
var shelfLocs = [[1,-1],[1,0],[1,1],[0,1]
                ,[-1,1],[-1,0],[-1,-1],[0,-1]
                ];

var playerSprite;
var viewMapId;

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

  shelfSprite = new Image();
  shelfSprite.src = "sprites/shelf" + SPRITE_SIZE + ".png";

  playerSprite = new Image();
  playerSprite.src = "sprites/player" + SPRITE_SIZE + ".png";

  viewMapId = 1;

  // Load the starting map
  loadMap(viewMapId);

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
  httpRequest.send(requestString({name: username}));
  httpRequest.onload = function(evt) {
    if(httpRequest.status != 200) return;
    if (httpRequest.responseText == "fail") {
      alert(username + " is dead");
      alert("For a small PayPay donation, we can resurrect " + username);
      alert("Do you really wish for " + username + " to languish in purgatory?");
    }
    else {
      var p = JSON.parse(httpRequest.responseText);
      loginPlayer(p);
    }
  }
}

function loginPlayer (p) {
  Player = p.id;
  players[Player] = p;
  viewMapId = p.mapId;
  loadMap(viewMapId);

  actorify(players[Player], playerSprite,1,2);

  setView(players[Player]);
  updateStats(players[Player])
  document.getElementById("loginName").innerHTML = players[Player].name;
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("logoutBox").style.display = "inline";
  View.recheckPlayers = 1;

  loadInventory();

  Notifications.poll();
}

function logout () {
  var httpRequest = Ajax('POST', "logout", false);
  httpRequest.send(null);
  delete players[Player];
  Player = null;
  updateStats();
  document.getElementById("logoutBox").style.display = "none";
  document.getElementById("loginBox").style.display = "inline";

  Notifications.poll();
}

function updatePlayer() {
  var httpRequest = Ajax('GET', 'player', false);
  httpRequest.send(null);
  fromServer = JSON.parse(httpRequest.responseText);
  players[Player].wealth = fromServer.wealth;
  players[Player].stealth = fromServer.stealth;
  players[Player].health = fromServer.health;
  players[Player].shelf = fromServer.shelf;

  updateStats(players[Player]);

  loadInventory();
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
  r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
