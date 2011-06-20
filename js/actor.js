// stands = #sprites for standing, likewise for walks
function actorify (obj, texture, stands, walks) {
  obj.texture = texture;

  obj.action = "stand"; // Also "walk" and "fight", maybe "shop"

  obj.standingMax = stands;
  obj.standingStage = 0;

  obj.walkingMax = walks;
  obj.walkingStage = 0;

  obj.attackStage = 0;
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
      source_x = actor.standingStage*SPRITE_SIZE;
      source_y = 0;
      dest_x = actor.x;
      dest_y = actor.y;
      actor.standingStage = (actor.standingStage + 1) % actor.standingMax;
      break;
    case "walk" :
      actor.walkingStage = (actor.walkingStage + 1) % actor.walkingMax;

      source_x = actor.walkingStage*SPRITE_SIZE;
      source_y = 0;

      // Calculate how far between the start and destination we should draw
      var walkStep = actor.walkingMax / actor.walkingStage;
      dest_x = actor.x + actor.walkingX/walkStep;
      dest_y = actor.y + actor.walkingY/walkStep;

      if (actor.id == Player) {
        setView({x: dest_x, y: dest_y});
      } 

      if (actor.walkingStage == 0) actor.action = "stand";
      break;
  }
  context.drawImage(actor.texture,
                    source_x,source_y, SPRITE_SIZE,SPRITE_SIZE,
                    (dest_x-minX)*TILE_SIZE,(dest_y-minY)*TILE_SIZE, TILE_SIZE,TILE_SIZE);
}

function drawAttack(actor) {
  var source_x = 0;
  var source_y = 0;
 
  var dest_x = actor.x + shelfLocs[actor.attackStage][0];
  var dest_y = actor.y + shelfLocs[actor.attackStage][1];

  actor.attackStage = (actor.attackStage + 1) % 8;
  if (actor.attackStage == 0) delete View.attackers[View.attackers.indexOf(actor)];
  context.drawImage(shelfSprite,
                    source_x,source_y, SPRITE_SIZE,SPRITE_SIZE,
                    (dest_x-minX)*TILE_SIZE,(dest_y-minY)*TILE_SIZE, TILE_SIZE,TILE_SIZE);
}


function moveActor (actor,direction) {
  actor.walkingX = 0;
  actor.walkingY = 0;

  switch (direction) {
    case "west" :
      actor.x--;
      actor.walkingX = 1;
      break;
    case "east" :
      actor.x++;
      actor.walkingX = -1;
      break;
    case "north" :
      actor.y--;
      actor.walkingY = 1;
      break;
    case "south" :
      actor.y++;
      actor.walkingY = -1;
      break;
    default :
      return;
  }

  actor.action = "walk";
  View.recheckPlayers = 1;
}


var canMove = 1;
// Player movement event handler
function keyPressed (event) {
  var move;

  // Prevent any AJAX requests from being aborted using the ESC key
  if((event.keyCode || event.charCode) == 27) event.preventDefault();

  // Don't capture key events in input fields
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
    case 32 : // Spacebar
      move = "attack"; break;
    default :
      return;
  }

  event.stopPropagation();
  event.preventDefault();
  if (!Player) {
    switch (move) {
      case "west" :
        minX--; maxX--; break;
      case "east" :
        minX++; maxX++; break;
      case "north" :
        minY--; maxY--; break;
      case "south" :
        minY++; maxY++; break;
      default:
    }
    View.recheckScenery = 1;
  } else {

    if (canMove) {
      canMove = 0;

      var httpRequest = Ajax('POST', (move == "attack") ? "attack" : "player/move", false);

      if (move == "attack") httpRequest.send(null);
      else httpRequest.send(requestString({moveType: move}));

      if (httpRequest.status != 200) move = '';
      else if (move != 'attack') {
        var obj = JSON.parse(httpRequest.responseText);

        // If we're over a shop, show its contents
        var p = players[Player];
        moveActor(p, obj.move);
        displayShop();
        if (scenery[p.x][p.y] && scenery[p.x][p.y].type = "portal") {
          loadMap(scenery[p.x][p.y].dest_map);
        }
      }

      // To prevent movement flooding
      setTimeout(function() {canMove = 1;}, TIMEOUT);
    }
  }
}
