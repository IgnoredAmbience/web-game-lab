// stands = #sprites for standing, likewise for walks
function Actor (x, y, color, texture, stands, walks) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.texture = new Image();
  this.texture.src = texture;

  this.action = "stand"; // Also "walk" and "fight", maybe "shop"

  this.standingMax = stands;
  this.standingStage = 0;

  this.walkingMax = walks;
  this.walkingStage = 0;
}

Actor.prototype.draw = function () {
  if (graphicsLevel == 0) {
    context.fillStyle = this.color;
    context.fillRect((this.x-viewX)*TILE_SIZE,(this.y-viewY)*TILE_SIZE,TILE_SIZE,TILE_SIZE);
  }
  else {
    // Row 0 of the texture image is standing
    // Row 1 of the texture image is walking animation
    var source_x;
    var source_y;
    var dest_x;
    var dest_y;
    switch (this.action) {
      case "stand" :
        source_x = this.standingStage*TILE_SIZE;
        source_y = 0;
        dest_x = this.x;
        dest_y = this.y;
        this.standingStage = (this.standingStage + 1) % this.standingMax;
        break;
      case "walk" :
        this.walkingStage = (this.walkingStage + 1) % this.walkingMax;

        source_x = this.walkingStage*TILE_SIZE;
        source_y = 0;

        // Calculate how far between the start and destination we should draw
        var walkStep = this.walkingMax / this.walkingStage;
        dest_x = this.x + (this.walkingX - this.x)/walkStep;
        dest_y = this.y + (this.walkingY - this.y)/walkStep;

        if (this.walkingStage == 0) this.action = "stand";
        break;
    }
    context.drawImage(this.texture,
                      source_x,source_y, TILE_SIZE,TILE_SIZE,
                      (dest_x-viewX)*TILE_SIZE,(dest_y-viewY)*TILE_SIZE, TILE_SIZE,TILE_SIZE);
  }
}


Actor.prototype.move = function (direction) {

  this.walkingX = this.x;
  this.walkingY = this.y;

  switch (direction) {
    case "left" :
      this.x--; break;
    case "right" :
      this.x++; break;
    case "up" :
      this.y--; break;
    case "down" :
      this.y++; break;
  }
  // Check for map boundaries
  if (this.x < 0) this.x = 0;
  if (this.x > mapWidth-1) this.x = mapWidth-1;
  if (this.y < 0) this.y = 0;
  if (this.y > mapHeight-1) this.y = mapHeight-1;

  this.action = "walk";
}


var canMove = 1;
// Player movement event handler
function keyPressed (event) {
  if (canMove) {
    canMove = 0;
    var blah = (event.keyCode || event.charCode);
    switch (blah) {
      case 37 : // Left
      case leftKey :
        Player.move("left"); break;
      case 38 : // Up
      case upKey :
        Player.move("up"); break;
      case 39 : // Right
      case rightKey :
        Player.move("right"); break;
      case 40 : // Down
      case downKey :
        Player.move("down"); break;
      default :
    }
    // To prevent movement flooding
    setTimeout(function() {canMove = 1;}, 500);
    // Update the view boundaries
    maxX = Player.x + halfWidth;
    maxY = Player.y + halfHeight;
    viewX = Player.x - halfWidth;
    viewY = Player.y - halfHeight;
  }
}
