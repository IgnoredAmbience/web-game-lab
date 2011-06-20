Notifications = {
  timeoutId: 0,
  init: function() {
    window.setInterval(this.poll.bind(this), 60000);
    this.poll();
    window.addEventListener('unload', this.destroy.bind(this), true);

    var chat = document.getElementById('chatinput');
    chat.addEventListener('focus', function() {
      if(this.value == "Enter a message and hit enter to send") {
        this.value = '';
      }
    }, false);
    chat.addEventListener('blur', function() {
      if(this.value == '') {
        this.value = "Enter a message and hit enter to send";
      }
    }, false);
    chat.addEventListener('keypress', this.send.bind(this), true);
  },

  destroy: function(event) {
    this.r.abort();
  },

  poll: function() {
    if(this.r) {
      this.r.abort();
    }

    this.r = Ajax('PUT', 'poll', true, true);
    this.r.addEventListener('load', this.handler.bind(this), false);
    this.r.send(null);
  },

  handler: function(evt) {
    if(console) {
      console.log(this.r.responseText);
    }

    var obj = JSON.parse(this.r.responseText);
    switch (obj.type) {
      case "move" :
        moveActor(players[obj.player.id], obj.move);
        break;
      case "login" :
        if (obj.player.mapId == players[Player].mapId) {
          actorify(obj.player,players[Player].texture,1,2);
          players[obj.player.id] = obj.player;
          View.recheckPlayers = 1;
        }
        break;
      case "logout" :
        delete players[obj.player.id];
        View.recheckPlayers = 1;
        break;
      case "attack" :
        // Display that the given player has attacked
        View.attackers.push(players[obj.player.id]);
        break;
      case "statChange" :
        // Update our own stats
        players[Player].wealth = obj.player.wealth;
        players[Player].health = obj.player.health;
        players[Player].stealth = obj.player.stealth;
        players[Player].shelf = obj.player.shelf;
        updateStats(players[Player]);
        if (players[Player].health <= 0) logout();
        break;
      case "chat" :
        document.getElementById('chatmessages').innerHTML = obj.msg + '<br/>' + document.getElementById('chatmessages').innerHTML;
        break;
      case "disconnect" :
        window.clearTimeout(this.timeoutId);
        var h = document.createElement('h1');
        h.innerText = "Server disconnected";
        document.replaceChild(h, document.firstChild);
        break;
      case "mapChange" :
        // If it was in our map, kill it
        if (players[obj.player.id]) {
          delete players[obj.player.id];
          View.recheckPlayers = 1;
        // If it's now in our map, show it
        } else if (players[Player].mapId == obj.player.mapId) {
          actorify(obj.player,players[Player].texture,1,2);
          players[obj.player.id] = obj.player;
          View.recheckPlayers = 1;
        }
      default :
    }
  },
  
  send: function(e) {
    if((e.keyCode || e.charCode) != 13) return; 
    var field = document.getElementById('chatinput');

    var r = Ajax('POST', 'chat', true);
    r.send(requestString({message: field.value}));
    field.value = '';
  }
};
