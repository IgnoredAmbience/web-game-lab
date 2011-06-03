function displayShop() {
  var sample = '[{"name":"helloooo","value":"12","itemClass":"sword","statValue":"+30"},{"name":"wibble","value":"19","itemClass":"axe","statValue":"-12"}]';
  outputItems(sample);
}

function outputItems (jsonItems) {
  document.getElementById("shopDisplay").innerHTML =
      buildItemTable(JSON.parse(jsonItems));
}

function buildItemTable(itemList) {
  var tableOutput = "<table border=\"1\">"
  tableOutput += "<tr> <td> Name </td> <td> Item Class </td> <td> Stat </td> <td> Buy </td> <td> Sell </td> </tr>";

  for (var i in itemList) {
    item = itemList[i];
    tableOutput += "<tr>";
    tableOutput += "<td>" + item.name + "</td>";
    tableOutput += "<td>" + item.itemClass + "</td>";
    tableOutput += "<td>" + item.statValue + "</td>";
    tableOutput += "<td>" + "<input type=\"button\" name=\"" + item.value + "\" value=\""+item.value+"\"/> </td>";
    tableOutput += "<td>" + "<input type=\"button\" name=\"" + item.value + "\" value=\""+item.value+"\"/> </td>";
    tableOutput += "</tr>";
  }
  tableOutput += "</table>";

  return tableOutput;
}
