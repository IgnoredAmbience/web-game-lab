// Will pull from server and load
function loadMap () {
  var r = Ajax('GET', 'map', false);
  r.send(null);
  if(r.status != 200) return; // FAIL!

  scenery = new Array();
  var a;

  var map = JSON.parse(r.responseText);
  mapHeight = map.height;
  mapWidth = map.width;

  map.tiles.forEach(function(tile) {
    switch (tile.type) {
      case "shop":
        a = new Tile(tile,new Actor(tile.x, tile.y, "red", "sprites/shop.png", 2, 0));
        break;
    }
    scenery.push(a);
  });
}

// There are separate lists for scenery, other players and the user player, rendered in that order
function draw () {
  toDraw = new Array();
  // For all items, if they're in view, add to toDraw
  for (var i in scenery) {
    if (inView(scenery[i].actor)) {
      toDraw.push(scenery[i].actor);
    }
  }
  // Clear the canvas
  canvas.width = canvas.width;
  // Color the edge of the map
  colorBoundaries();
  // draw the scenery
  for (var i in toDraw) {
    toDraw[i].draw();
  }
  // Render the player on top
  Player.draw();
}

// Returns whether the item is within the view
function inView (item) {
  return ( item.x > viewX
        && item.x < maxX
        && item.y > viewY
        && item.y < maxY
         );
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
function setView () {
  maxX = Player.x + halfWidth;
  maxY = Player.y + halfHeight;
  viewX = Player.x - halfWidth;
  viewY = Player.y - halfHeight;
}
