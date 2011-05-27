function Actor (x, y, color, texture) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.texture = new Image();
  this.texture.src = texture;

  this.walkingMax = this.texture.width / TILE_SIZE;
  this.walkingStage = 0;
}

Actor.prototype.draw = function () {
  if (graphicsLevel == 0) {
    context.fillStyle = this.color;
    context.fillRect(this.x*TILE_SIZE,this.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
  }
  else {
    context.drawImage(this.texture,
                      this.walkingStage*TILE_SIZE,0, TILE_SIZE,TILE_SIZE,
                      this.x*TILE_SIZE,this.y*TILE_SIZE, TILE_SIZE,TILE_SIZE);
  }
}


Actor.prototype.move = function (direction) {

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

  if (this.x < 0) this.x = 0;
  if (this.x > mapWidth-1) this.x = mapWidth-1;
  if (this.y < 0) this.y = 0;
  if (this.y > mapHeight-1) this.y = mapHeight-1;

  this.walkingStage = (this.walkingStage + 1) % this.walkingMax;
}



function Shop (x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
}

Shop.prototype.draw = function () {
  context.fillStyle = this.color;
  context.fillRect(this.x*TILE_SIZE,this.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
}



// Player movement event handler
function keyPressed (event) {
  switch (event.keyCode) {
    case 37 : // Left
      Player.move("left"); break;
    case 38 : // Up
      Player.move("up"); break;
    case 39 : // Right
      Player.move("right"); break;
    case 40 : // Down
      Player.move("down"); break;
    default :
  }
}
