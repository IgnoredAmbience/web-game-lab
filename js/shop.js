function displayShop() {
  var p = players[Player];
  if ((scenery[p.x][p.y]) && scenery[p.x][p.y].type == "shop") {
    var id = scenery[p.x][p.y].id;
    var httpRequest = Ajax('GET', "shop/"+id, false);
    httpRequest.send(null);

    outputItems(httpRequest.responseText);
    document.getElementById("shopDisplay").style.visibility = "visible"; 
  }
  else {
    document.getElementById("shopDisplay").style.visibility = "hidden"; 
  }
}

function outputItems (jsonItems) {
  document.getElementById("shopDisplay").innerHTML =
      buildItemTable(JSON.parse(jsonItems));
}

function buildItemTable(itemList) {
  var tableOutput = '<table border="1">';
  tableOutput += ["itemID", "Name", "itemClass", "Stat", "Buy", "Sell"].map(makeTableCell).join(' ');
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
  newCell += makeTableCell(makeShopButton(item.value, "buy"));
  newCell += makeTableCell(makeShopButton(item.value, "sell"));
  newCell += "</tr>";
  return newCell;
}

function makeShopButton(itemValue, transactType, itemId) {
    var buttonHTML = '<input type="button" name="' + itemValue + '" value ="' +
        itemValue + '" onClick="transact(' + itemId + "," + transactType + ')" />';
    return buttonHTML;
}


function transact(itemId, transactType) {
  var httpRequest = Ajax('POST', 'login', false);
  httpRequest.send(requestString({itemId: itemId, action: transactType}));

  if(httpRequest.status != 200) { //200 is SUCCESS!
      if (transactType === "buy") {
          p.setShelf(itemId);
      }
      return;
  }
  else {
      alert("Stop fucking with the data sent to the server");
  }
}
