// stands = #sprites for standing, likewise for walks
function actorify (obj, color, texture, stands, walks) {
  obj.color = color;
  obj.texture = texture;

  obj.action = "stand"; // Also "walk" and "fight", maybe "shop"

  obj.standingMax = stands;
  obj.standingStage = 0;

  obj.walkingMax = walks;
  obj.walkingStage = 0;
}

function drawActor (actor) {
  // Row 0 of the texture image is standing
  // Row 1 of the texture image is walking animation
  var source_x;
  var source_y;
  var dest_x;
  var dest_y;
  switch (actor.action) {
    case "stand" :
      source_x = actor.standingStage*TILE_SIZE;
      source_y = 0;
      dest_x = actor.x;
      dest_y = actor.y;
      actor.standingStage = (actor.standingStage + 1) % actor.standingMax;
      break;
    case "walk" :
      actor.walkingStage = (actor.walkingStage + 1) % actor.walkingMax;

      source_x = actor.walkingStage*TILE_SIZE;
      source_y = 0;

      // Calculate how far between the start and destination we should draw
      var walkStep = actor.walkingMax / actor.walkingStage;
      dest_x = actor.x + (actor.walkingX - actor.x)/walkStep;
      dest_y = actor.y + (actor.walkingY - actor.y)/walkStep;

      if (actor == Player) {
        setView({x: dest_x, y: dest_y});
      } 

      if (actor.walkingStage == 0) actor.action = "stand";
      break;
  }
  context.drawImage(actor.texture,
                    source_x,source_y, TILE_SIZE,TILE_SIZE,
                    (dest_x-viewX)*TILE_SIZE,(dest_y-viewY)*TILE_SIZE, TILE_SIZE,TILE_SIZE);
}


function moveActor (actor,direction) {
  actor.walkingX = actor.x;
  actor.walkingY = actor.y;

  switch (direction) {
    case "west" :
      actor.x--; break;
    case "east" :
      actor.x++; break;
    case "north" :
      actor.y--; break;
    case "south" :
      actor.y++; break;
    default :
      return;
  }
  // Check for map boundaries
  if (actor.x < 0) actor.x = 0;
  if (actor.x > mapWidth-1) actor.x = mapWidth-1;
  if (actor.y < 0) actor.y = 0;
  if (actor.y > mapHeight-1) actor.y = mapHeight-1;

  actor.action = "walk";
}


var canMove = 1;
// Player movement event handler
function keyPressed (event) {
  var move;
  if(event.target.tagName == 'INPUT') return;

  switch (event.keyCode || event.charCode) {
    case 37 : // Left
    case leftKey :
      move = "west"; break;
    case 38 : // Up
    case upKey :
      move = "north"; break;
    case 39 : // Right
    case rightKey :
      move = "east"; break;
    case 40 : // Down
    case downKey :
      move = "south"; break;
    default :
      return;
  }

  event.stopPropagation();
  event.preventDefault();
  if (!Player) {
    switch (move) {
      case "west" :
        viewX--; maxX--; break;
      case "east" :
        viewX++; maxX++; break;
      case "north" :
        viewY--; maxY--; break;
      case "south" :
        viewY++; maxY++; break;
    }
  } else

  if (canMove) {
    canMove = 0;

    var httpRequest = Ajax('POST', "player/move", false);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(requestString({moveType: move}));
    if(httpRequest.status != 200) move = '';
    moveActor(Player,move);

    if ((scenery[Player.x][Player.y]) && scenery[Player.x][Player.y].type == "shop") {
      // Show the shop button
      displayShop(scenery[Player.x][Player.y].id);
      document.getElementById("shopDisplay").style.visibility = "visible"; 
    }
    else {
      document.getElementById("shopDisplay").style.visibility = "hidden"; 
    }

    // To prevent movement flooding
    setTimeout(function() {canMove = 1;}, 500);
    // Update the view boundaries
  }
}
