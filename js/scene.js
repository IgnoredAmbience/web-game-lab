var View = {
  recheckScenery: 1,
  recheckPlayers: 1,
  attackers: []
}

// Will pull from server and load
function loadMap (mapID) {
  var r = Ajax('GET', 'map/'+mapID, false);
  r.send(null);
  if(r.status != 200) return; // FAIL!

  var map = JSON.parse(r.responseText);
  mapHeight = map.height;
  mapWidth = map.width;

  scenery = new Array();
  for (var i = 0; i < mapWidth; i++) {
    scenery[i] = new Array();
  }

  var shopTexture = new Image ();
  shopTexture.src = "sprites/shop" + SPRITE_SIZE + ".png";

  var portalTexture = new Image ();
  portalTexture.src = "sprites/portal" + SPRITE_SIZE + ".png";

  map.tiles.forEach(function(tile) {
    switch (tile.type) {
      case "shop":
        actorify(tile,shopTexture,2,0);
        break;
      case "portal":
        actorify(tile,portalTexture,4,0);
    }
    scenery[tile.x][tile.y] = tile;
  });

  var texture = new Image ();
  texture.src = "sprites/player" + SPRITE_SIZE + ".png";

  for (var i in map.players) {
    var p = map.players[i];
    actorify(p, texture, 1, 2);
    players[p.id] = p;
  }

  loadBackground();
}

// Loads the background grassy tiles
function loadBackground () {
  background = document.createElement("canvas");
  background.width = mapWidth * TILE_SIZE;
  background.height = mapHeight * TILE_SIZE;
  bContext = background.getContext("2d");
  var tiles = new Array ();
  // Generate the tiles
  for (var i = 0; i < NUM_TILES; i++) {
    tiles[i] = new Array();
    for (var j = 0; j < NUM_TILES; j++) {
      tiles[i][j] = makeTile();
    }
  }
  // Draw them to the background
  for (var i = 0; i < mapWidth; i++) {
    for (var j = 0; j < mapHeight; j++) {
      bContext.drawImage(tiles[i%NUM_TILES][j%NUM_TILES],i*TILE_SIZE,j*TILE_SIZE);
    }
  }
}

// There are separate lists for scenery, other players and the user player, rendered in that order
function draw () {
  // For all items, if they're in view, add to toDraw
  var xmin = Math.floor((minX < 0) ? 0 : minX);
  var xmax = Math.ceil((maxX > mapWidth) ? mapWidth : maxX);
  var ymin = Math.floor((minY < 0) ? 0 : minY);
  var ymax = Math.ceil((maxY > mapHeight) ? mapHeight : maxY);

  if (View.recheckScenery) {
    View.recheckScenery = 0;
    View.sceneryToDraw = new Array();
    // Check for scenery in view
    for (var i = xmin; i < xmax; i++) {
      for (var j = ymin; j < ymax; j++) {
        if (scenery[i][j])
          View.sceneryToDraw.push(scenery[i][j]);
      }
    }
  }

  if (View.recheckPlayers) {
    View.recheckPlayers = 0;
    View.playersToDraw = new Array();
    // Check for players in view
    for (var i in players) {
      if (inView(players[i].id != Player && players[i],xmin,xmax,ymin,ymax))
        View.playersToDraw.push(players[i]);
    }
  }

  // Clear the canvas
  canvas.width = canvas.width;
  // Color the edge of the map
  colorBoundaries();
  // Draw grass!
  context.drawImage(background,-minX*TILE_SIZE,-minY*TILE_SIZE);
  
  var setTheView = (Player && players[Player].action == "walk");

  // draw the view
  View.sceneryToDraw.forEach(drawActor);
  View.playersToDraw.forEach(drawActor);

  if (Player)
    drawActor(players[Player]);

  View.attackers.forEach(drawAttack);

}

function inView (p, xmin,xmax,ymin,ymax) {
  return (p.x >= xmin && p.x < xmax &&
          p.y >= ymin && p.y < ymax);
}

// Colors the "not map" bits of the view
function colorBoundaries () {
  context.fillStyle = "grey";
  if (minX < 0) context.fillRect(0,0,-minX*TILE_SIZE,canvas.height);
  if (maxX > mapWidth) {
    var mapDiffX = maxX - mapWidth;
    context.fillRect(canvas.width-(mapDiffX*TILE_SIZE),0,mapDiffX*TILE_SIZE,canvas.height);
  }
  if (minY < 0) context.fillRect(0,0,canvas.width,-minY*TILE_SIZE);
  if (maxY > mapHeight) {
    var mapDiffY = maxY - mapHeight;
    context.fillRect(0,canvas.height-(mapDiffY*TILE_SIZE),canvas.width,mapDiffY*TILE_SIZE);
  }
}

// Sets the view limits based on the player
function setView (obj) {
  maxX = obj.x + halfWidth;
  maxY = obj.y + halfHeight;
  minX = obj.x - halfWidth;
  minY = obj.y - halfHeight;
  View.recheckScenery = 1;
}

function makeTile () {
  var tile = document.createElement("canvas");
  tile.width = TILE_SIZE;
  tile.height = TILE_SIZE;
  var c = tile.getContext("2d");
  for (var i = 0; i < TILE_SIZE; i++) {
    for (var j = 0; j < TILE_SIZE; j++) {
      var s = 50 + Math.floor(Math.random() * 50);
      var l = 60 + Math.floor(Math.random() * 20);;
      drawPixel(c,i,j,120,s,l);
    }
  }
  return tile;
}

function drawPixel(c,x,y,h,s,l) {
  c.fillStyle = "hsl(" + h + "," + s + "%," + l + "%)";
  c.fillRect(x,y,1,1);
}
