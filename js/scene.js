// For now, all the scenery contains is a list of shops. Eventually, other arguments may be passed in, which will need to be added to this.scenery by looping over :/
function loadMap (shops) {
  scenery = shops;
  // TODO: The following are magic numbers, change later
  mapHeight = 32;
  mapWidth = 32;
  viewX = 0;
  viewY = 0;
}

// There are separate lists for scenery, other players and the user player, rendered in that order
function draw () {
  toDraw = new Array();
  // for all items, if they're in view, add to toDraw
  for (var i in scenery) {
    if (inView(scenery[i])) {
      toDraw.push(scenery[i]);
    }
  }
  // clear the canvas
  canvas.width = canvas.width;
  // draw them
  for (var i in toDraw) {
    toDraw[i].draw();
  }
  // Render the player on top
  Player.draw();
}

// TODO: Make this actually return whether something is in view or not
function inView (item) {
  return ( item.x > viewX
        && item.x < (viewX + canvas.width)
        && item.y > viewY
        && item.y < (viewY + canvas.height)
         );
  //return true;
}

// Changes the detail level
function changeGraphics () {
  graphicsLevel = (graphicsLevel + 1) % GRAPHICS_MAX;
}
