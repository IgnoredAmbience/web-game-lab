// Will pull from server and load
function loadMap () {
  var r = Ajax('GET', 'map', false);
  r.send(null);
  if(r.status != 200) return; // FAIL!

  var map = JSON.parse(r.responseText);
  mapHeight = map.height;
  mapWidth = map.width;

  scenery = new Array();
  for (var i = 0; i < mapWidth; i++) {
    scenery[i] = new Array();
  }
  var a;

  var texture = new Image ();
  texture.src = "sprites/shop.png";

  map.tiles.forEach(function(tile) {
    switch (tile.type) {
      case "shop":
        actorify(tile, "red",texture,2,0);
        break;
    }
    scenery[tile.x][tile.y] = tile;
  });
}

// Loads the background grassy tiles
function loadBackground () {
  tiles = new Array ();
  for (var i = 0; i < 8; i++) {
    tiles[i] = new Array();
    for (var j = 0; j < 8; j++) {
      makeTile(i,j);
    }
  }
}

// There are separate lists for scenery, other players and the user player, rendered in that order
function draw () {
  toDraw = new Array();
  // For all items, if they're in view, add to toDraw
  var xmin = Math.floor((viewX < 0) ? 0 : viewX);
  var xmax = Math.ceil((maxX > mapWidth) ? mapWidth : maxX);
  var ymin = Math.floor((viewY < 0) ? 0 : viewY);
  var ymax = Math.ceil((maxY > mapHeight) ? mapHeight : maxY);

  for (var i = xmin; i < xmax; i++) {
    for (var j = ymin; j < ymax; j++) {
      if (scenery[i][j])
        toDraw.push(scenery[i][j]);
    }
  }
  // Clear the canvas
  canvas.width = canvas.width;
  // Color the edge of the map
  colorBoundaries();
  // Draw grass!
  for (var i = xmin; i < xmax; i++) {
    for (var j = ymin; j < ymax; j++) {
      context.drawImage(tiles[i%8][j%8],(i-viewX)*TILE_SIZE,(j-viewY)*TILE_SIZE);
    }
  }
  // draw the scenery
  for (var i in toDraw) {
    drawActor(toDraw[i]);
  }
  // Render the player on top
  if (Player)
    drawActor(Player);
}

// Colors the "not map" bits of the view
function colorBoundaries () {
  context.fillStyle = "grey";
  if (viewX < 0) context.fillRect(0,0,-viewX*TILE_SIZE,canvas.height);
  if (maxX > mapWidth) {
    var mapDiffX = maxX - mapWidth;
    context.fillRect(canvas.width-(mapDiffX*TILE_SIZE),0,mapDiffX*TILE_SIZE,canvas.height);
  }
  if (viewY < 0) context.fillRect(0,0,canvas.width,-viewY*TILE_SIZE);
  if (maxY > mapHeight) {
    var mapDiffY = maxY - mapHeight;
    context.fillRect(0,canvas.height-(mapDiffY*TILE_SIZE),canvas.width,mapDiffY*TILE_SIZE);
  }
}

// Sets the view limits based on the player
function setView (obj) {
  maxX = obj.x + halfWidth;
  maxY = obj.y + halfHeight;
  viewX = obj.x - halfWidth;
  viewY = obj.y - halfHeight;
}

function makeTile (x,y) {
  tiles[x][y] = document.createElement("canvas");
  tiles[x][y].width = TILE_SIZE;
  tiles[x][y].height = TILE_SIZE;
  var c = tiles[x][y].getContext("2d");
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      var s = 50 + Math.floor(Math.random() * 50);
      var l = 60 + Math.floor(Math.random() * 20);;
      drawPixel(c,i,j,120,s,l);
    }
  }
}

function drawPixel(c,x,y,h,s,l) {
  c.fillStyle = "hsl(" + h + "," + s + "%," + l + "%)";
  c.fillRect(x,y,1,1);
}
