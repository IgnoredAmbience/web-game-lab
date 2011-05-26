function Actor (x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
}

Actor.prototype.draw = function () {
  Scene.context.fillStyle = this.color;
  Scene.context.fillRect(this.x*10,this.y*10,10,10);
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
  Scene.context.fillRect(this.x*10,this.y*10,10,10);
}

Shop.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
}
