function loadInventory() {
  var r = Ajax('GET', "inventory", false);
  r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  r.send(null);

  if( r.status != 200) {
      return;
  }

  document.getElementById('chatmessages').innerHTML = r.responseText + '<br/>' +
      document.getElementById('chatmessages').innerHTML;

  players[Player].inventory = JSON.parse(r.responseText);
}

