Notifications = {
  init: function() {
    var r = Ajax('PUT', 'poll', true, true);
    r.onload = this.handler;
    r.onreadystatechange = function() {
      console.log('orsc:', this.readyState, this.responseText);
    };
    r.onabort = function() {console.log('abort');};
    r.send(null);
  },

  handler: function(evt) {
             console.log('ol');
    document.getElementById('chatmessages').innerHTML = this.responseText + '<br/>' + document.getElementById('chatmessages').innerHTML;
  },
  
  send: function() {
    var r = Ajax('POST', 'chat', true);
    r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    r.send(requestString({message: document.getElementById('chat').value}));
  }
};
