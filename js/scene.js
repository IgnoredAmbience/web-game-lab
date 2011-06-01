// For now, all the scenery contains is a list of shops. Eventually, other arguments may be passed in, which will need to be added to this.scenery by looping over :/
function loadMap (shops) {
  scenery = shops;
  // TODO: The following are magic numbers, change later
  mapHeight = 16;
  mapWidth = 16;
}

// There are separate lists for scenery, other players and the user player, rendered in that order
function draw () {
  toDraw = new Array();
  // For all items, if they're in view, add to toDraw
  for (var i in scenery) {
    if (inView(scenery[i])) {
      toDraw.push(scenery[i]);
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
