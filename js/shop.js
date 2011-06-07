function displayShop(id) {

  var httpRequest = Ajax('GET', "shop/"+id, false);
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  httpRequest.send(null);

  outputItems(httpRequest.responseText);
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
    tableOutput += "<td>" + item.name  + "</td>";
    tableOutput += "<td>" + item.class + "</td>";
    tableOutput += "<td>" + item.stat  + "</td>";
    tableOutput += "<td>" + "<input type=\"button\" name=\"" + item.value + "\" value=\""+item.value+"\"/> </td>";
    tableOutput += "<td>" + "<input type=\"button\" name=\"" + item.value + "\" value=\""+item.value+"\"/> </td>";
    tableOutput += "</tr>";
  }
  tableOutput += "</table>";

  return tableOutput;
}
