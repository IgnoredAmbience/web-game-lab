function displayShop() {
  var p = players[Player];
  if ((scenery[p.x][p.y]) && scenery[p.x][p.y].type == "shop") {
    var id = scenery[p.x][p.y].id;
    var httpRequest = Ajax('GET', "shop/"+id, false);
    httpRequest.send(null);


    document.getElementById("shopDisplay").style.left = 
	document.getElementById("canvas").width + 25;

    outputItems(httpRequest.responseText, "shopDisplay",
		["itemID", "Name", "itemClass", "Stat", "Buy", "Sell"]);

    document.getElementById("shopDisplay").style.visibility = "visible"; 
  }
  else {
    document.getElementById("shopDisplay").style.visibility = "hidden"; 
  }
  
}

function outputItems (jsonItems, displayLocation, tableHeadings) {
  if(jsonItems === "")
      jsonItems = "[]";

  document.getElementById(displayLocation).innerHTML =
      buildItemTable(JSON.parse(jsonItems), tableHeadings);
}

function buildItemTable(itemList, tableHeadings) {
  var tableOutput = '<table border="1">';
  tableOutput += tableHeadings.map(makeTableCell).join(' ');
  tableOutput += itemList.map(makeCellRow);
  tableOutput += "</table>";
  return tableOutput;
}

function makeTableCell(string) {
  return "<td>" + string + "</td>";
}

function makeCellRow(item) {
  var newCell = "<tr>";
  newCell += makeTableCell(item.id);
  newCell += makeTableCell(item.name);
  newCell += makeTableCell(item.class);
  newCell += makeTableCell(item.stat);
  newCell += makeTableCell(makeShopButton(item.value, "buy", item.id));
  newCell += makeTableCell(makeShopButton(item.value, "sell", item.id));
  newCell += "</tr>";
  return newCell;
}

function makeShopButton(itemValue, transactType, itemId) {
  var buttonHTML = '<input type="button" name="' + itemValue + 
      '" value ="' + itemValue + 
      '" onClick="transact(' + itemId + ",'" + transactType + "')\"";

  if(itemValue > players[Player].wealth && transactType === "buy") {
    buttonHTML += ' disabled="disabled" '
  }

  buttonHTML += "/>";
  return buttonHTML;
}


function transact(itemId, transactType) {
  var httpRequest = Ajax('POST', 'shop/-1', false);

  httpRequest.send(requestString({itemId: itemId, action: transactType}));

  if(httpRequest.status == 200) { //200 is SUCCESS!
    updatePlayer();
    displayShop(scenery[players[Player].x][players[Player].y].id);
  }
}
