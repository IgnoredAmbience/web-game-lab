function displayShop() {
  var p = players[Player];
  if ((scenery[p.x][p.y]) && scenery[p.x][p.y].type == "shop") {
    var id = scenery[p.x][p.y].id;
    var httpRequest = Ajax('GET', "shop/"+id, false);
    httpRequest.send(null);

    var shopJSON = JSON.parse(httpRequest.responseText);

    var invJSON = players[Player].inventory;

    outputItems(mergeStockInventoryJSON(shopJSON, invJSON), "shopDisplay",
                ["Name", "Class", "In Shop", "On Player", "Stat", "Buy", "Sell"]);

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
      buildItemTable(jsonItems, tableHeadings);
}

function buildItemTable(itemList, tableHeadings) {
  var tableOutput = '<table>';
  tableOutput += tableHeadings.map(function(s) {return '<th>'+s+'</th>';}).join(' ');
  tableOutput += itemList.map(makeCellRow).join('');
  tableOutput += "</table>";
  return tableOutput;
}

function makeTableCell(string) {
  return "<td>" + string + "</td>";
}

function makeCellRow(item) {
  var newCell = "<tr>";
  newCell += makeTableCell(item.name);
  newCell += makeTableCell(item.class);
  newCell += makeTableCell(item.shopCount);
  newCell += makeTableCell(item.lootCount);
  newCell += makeTableCell(item.stat);
  newCell += makeTableCell(makeShopButton(item, "buy"));
  newCell += makeTableCell(makeShopButton(item, "sell"));
  newCell += "</tr>";
  return newCell;
}

function makeShopButton(item, transactType) {
  var buttonHTML = '<input type="button" name="' + item.value +
      '" value ="' + item.value +
      '" onClick="transact(' + item.id + ",'" + transactType + "')\"";

  var tooExpensive = item.value > players[Player].wealth && transactType === "buy";
  var outOfStock   = item.shopCount == 0 && transactType === "buy";
  var notInLoot    = item.lootCount == 0 && transactType === "sell";

  if (tooExpensive || outOfStock || notInLoot) {
      buttonHTML += ' disabled="disabled" ';
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

function mergeStockInventoryJSON(stock, inventory) {
  var toReturn = stock;

  for(var i = 0; i < stock.length; i++) {
    toReturn[i].shopCount = toReturn[i].count;
    toReturn[i].lootCount = 0;
    delete toReturn[i].count;
  }

  for(var i = 0; i < inventory.length; i++) {
    var inShop = false;
    for(var j = 0; j < stock.length && !inShop; j++) {
      if(toReturn[j].id == inventory[i].id) {
        toReturn[j].lootCount = inventory[i].count;
        inShop = true
      }
    }

    if(!inShop) {
      var newItem = inventory[i];
      newItem.lootCount = inventory[i].count;
      newItem.shopCount = 0;
      toReturn.push(newItem);
    }

  }

  return toReturn;
}
