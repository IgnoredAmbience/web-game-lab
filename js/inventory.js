function loadInventory() {
  var r = Ajax('GET', "inventory", false);
  r.send(null);

  if( r.status != 200) {
      return;
  }

  players[Player].inventory = JSON.parse(r.responseText);
}

