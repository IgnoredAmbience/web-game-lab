function displayShop() {
  var sample = '[{"name":"helloooo","value":"12","itemClass":"sword","statValue":"+30"},{"name":"wibble","value":"19","itemClass":"axe","statValue":"-12"}]';
  listItems(sample);
}

function listItems (jsonItems) {
  var itemList = JSON.parse(jsonItems);
  var display = document.getElementById("shopDisplay");
  display.innerHTML = "";
  for (var i in itemList) {
    // create list of descriptions and buy buttons
    var item = itemList[i];
    display.innerHTML += "<p>" + item.name + "<br>" + item.value + "<br>" + item.itemClass + "<br>" + item.statValue + "<button>"+i+"</button>" + "</p>";
  }
}
