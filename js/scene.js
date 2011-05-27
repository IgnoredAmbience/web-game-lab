var Scene = {

  init: function () {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.context.font = "bold 12px sans-serif";
  },

  // For now, all the scenery contains is a list of shops. Eventually, other arguments may be passed in, which will need to be added to this.scenery by looping over :/
  loadMap: function (shops) {
    this.scenery = shops;
    this.width = 32;
    this.height = 32;
  },

  // TODO: Weigh up the merits of having separate item lists for scenery, actors and the player, rendered in that order. Also, scenery can probably have some nice staticy stuff done to it, maybe turned into a temporary bitmap for rendering, that's just moved around the canvas?
  draw: function () {
    toDraw = new Array();
    // for all items, if they're in view, add to toDraw
    for (var i in this.scenery) {
      if (this.inView(this.scenery[i])) {
        toDraw.push(this.scenery[i]);
      }
    }
    // clear the canvas
    this.canvas.width = this.canvas.width;
    // draw them
    for (var i in toDraw) {
      toDraw[i].draw();
    }
    // Render the player on top
    Player.draw();
  },

  // TODO: Make this actually return whether something is in view or not
  inView: function (item) {
    return true;
  }

}
