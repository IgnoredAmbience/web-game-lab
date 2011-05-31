function init () {
  // Set up the drawing environment
  canvas = document.getElementById("canvas");
  context = this.canvas.getContext("2d");
  context.font = "bold 12px sans-serif";

  Player = new Actor (1,1,"black","player.png");
  document.addEventListener("keypress", keyPressed, true);

  // Set up the loop
  setInterval(draw,frameInterval);


  // "magic number" type crap that will be removed/implemented later
  var shops = new Array();
  shops.push(new Shop(3,8,"red"));
  shops.push(new Shop(4,8,"red"));

  loadMap(shops);

  updateStats(1,2,3,4);
}

// For now, all the scenery contains is a list of shops. Eventually, other arguments may be passed in, which will need to be added to this.scenery by looping over :/
function loadMap (shops) {
  scenery = shops;
  // TODO: The following are magic numbers, change later
  mapHeight = 32;
  mapWidth = 32;
}

// TODO: Weigh up the merits of having separate item lists for scenery, actors and the player, rendered in that order. Also, scenery can probably have some nice staticy stuff done to it, maybe turned into a temporary bitmap for rendering, that's just moved around the canvas?
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
  return true;
}

// Changes the detail level
function changeGraphics () {
  graphicsLevel = (graphicsLevel + 1) % GRAPHICS_MAX;
}
