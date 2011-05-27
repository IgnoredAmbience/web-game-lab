function Actor (x, y, color, texture) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.texture = new Image();
  this.texture.src = texture;
}

Actor.prototype.draw = function () {
  //Scene.context.fillStyle = this.color;
  //Scene.context.fillRect(this.x*TILE_SIZE,this.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
  Scene.context.drawImage(this.texture,
                          0,0,TILE_SIZE,TILE_SIZE,
                          this.x,this.y,TILE_SIZE,TILE_SIZE);
}

Actor.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
}


function Shop (x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
}

Shop.prototype.draw = function () {
  Scene.context.fillStyle = this.color;
  Scene.context.fillRect(this.x*TILE_SIZE,this.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
}

Shop.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
}


function keyPressed (event) {
  switch (event.keyCode) {
    case 37 : // Left
      Player.x--; break;
    case 38 : // Up
      Player.y--; break;
    case 39 : // Right
      Player.x++; break;
    case 40 : // Down
      Player.y++; break;
    default :
  }
  if (Player.x < 0) Player.x = 0;
  if (Player.y < 0) Player.y = 0;
  Scene.draw();
}
