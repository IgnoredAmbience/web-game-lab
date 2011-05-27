function Actor (x, y, color, texture) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.texture = new Image();
  this.texture.src = texture;

  this.walkingStage = 0;
}

Actor.prototype.draw = function () {
  if (graphicsLevel == 0) {
    context.fillStyle = this.color;
    context.fillRect(this.x*TILE_SIZE,this.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
  }
  else {
  context.drawImage(this.texture,
                          this.walkingStage*TILE_SIZE,0,TILE_SIZE,TILE_SIZE,
                          this.x*TILE_SIZE,this.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
  }
}


Actor.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;

  if (this.x < 0) this.x = 0;
  if (this.x > mapWidth-1) this.x = mapWidth-1;
  if (this.y < 0) this.y = 0;
  if (this.y > mapHeight-1) this.y = mapHeight-1;

  this.walkingStage = (this.walkingStage + 1) % 2;
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

Shop.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
}



// Player movement event handler
function keyPressed (event) {
  switch (event.keyCode) {
    case 37 : // Left
      Player.move(-1,0); break;
    case 38 : // Up
      Player.move(0,-1); break;
    case 39 : // Right
      Player.move(1,0); break;
    case 40 : // Down
      Player.move(0,1); break;
    default :
  }
}
