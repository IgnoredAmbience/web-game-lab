Notifications = {
  timeoutId: 0,
  init: function() {
    this.poll();
    window.addEventListener('unload', this.destroy.bind(this), true);
  },

  destroy: function(event) {
    this.r.abort();
  },

  poll: function() {
    window.clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(this.poll.bind(this), 60000);
    if(this.r) {
      this.r.abort();
    }
    this.r = Ajax('PUT', 'poll', true, true);
    this.r.addEventListener('load', this.handler.bind(this), false);
    this.r.addEventListener('error', this.poll.bind(this), false);
    this.r.send(null);
  },

  handler: function(evt) {
    document.getElementById('chatmessages').innerHTML = this.r.responseText + '<br/>' + document.getElementById('chatmessages').innerHTML;
    var obj = JSON.parse(this.r.responseText);
    switch (obj.type) {
      case "move" :
        moveActor(players[obj.player.id], obj.move);
        break;
      case "login" :
        actorify(obj.player,players[Player].texture,1,2);
        players[obj.player.id] = obj.player;
        View.recheckPlayers = 1;
        break;
      case "logout" :
        delete players[obj.player.id];
        View.recheckPlayers = 1;
        break;
      case "attack" :
        // Display that the given player has attacked
      case "statChange" :
        // Update our own stats
      default :
    }
  },
  
  send: function() {
    var r = Ajax('POST', 'chat', true);
    r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    r.send(requestString({message: document.getElementById('chat').value}));
  }
};
