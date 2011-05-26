var Scene = {

  init: function () {
    this.canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");
    this.context.font = "bold 12px sans-serif";

    this.items = new Array();
  },

  // TODO: Weigh up the merits of having separate item lists for scenery, actors and the player, rendered in that order. Also, scenery can probably have some nice staticy stuff done to it, maybe turned into a temporary bitmap for rendering, that's just moved around the canvas?
  draw: function () {
    toDraw = new Array();
    // for all items, if they're in view, add to toDraw
    for (var i in this.items) {
      if (this.inView(this.items[i])) {
        toDraw.push(this.items[i]);
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
