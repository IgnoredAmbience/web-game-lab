<?php
class ShopHandler extends Handler {
  function post() {
    // Stuff is either bought or sold
    // Stock levels changed to reflect that
    // This may or may not affect prices (server side calculation)

    // can a shop buy anything? yes, but it may not pay well
    // it can only sell what it has in stock

    // can it sell what players sold to it?
    // if so, any buy / sell action must update quickly

    // Either way, a shop action must immediately reflect stuff to client(s)

    // TODO, ON SUBMIT, 404s on "TRANSACT?"

    $this->requireLogin();

    $user = $this->getUser();
    $itemId = json_decode($_POST['itemId']);
    $action = $_POST['action'];

    //Look up the item being bought
    if(!$shop = Shop::getByFields(array("x"=>$user->x, "y"=>$user->y,
                                        'mapId' => $user->mapId),"Shop")) {
      throw new Exception("Shop does not exist");
      return;
    }
    else
      $shop = $shop[0]; //array returned by getByFields

    if(!$item = Item::getById($itemId, "Item")) {
      throw new Exception("Item not in database");
      return;
    }

    $shopStock = ShopStock::getByFields(array("shopId"=>$shop->id,
                                              "itemId"=>$item->id),"ShopStock");

    if ($action == "buy") {

      if(!$shopStock) { //item not stocked by shop
	throw new Exception("Not in stock here");
        return;
      }

      if($user->wealth < $item->value) { //player can't afford it
        return;
      }

      $user->wealth -= $item->value;
      $shopStock[0]->count--;
      $user->save();
      $shopStock[0]->save();

      if(!$loot = PlayerLoot::getByFields(array("playerId"=>$user->id,
                                                "itemId"=>$item->id), "PlayerLoot")) {
        $loot[0] = new PlayerLoot();
        $loot[0]->count    = 1;
        $loot[0]->playerId = $user->id;
        $loot[0]->itemId   = $item->id;
      }
      $loot[0]->count++;
      $loot[0]->save();
    }
    elseif($action == "sell") {
      if(!$loot = PlayerLoot::getByFields(array("playerId"=>$user->id,
                                                "itemId"=>$item->id),
                                          "PlayerLoot")) {
        throw new Exception("Player doesn't have the loot they're selling");
        
        return;
      }
      
      if(!$loot[0]->count) {
        return; //player doesn't have any of what they're trying to sell
      }
      
      if(!$shopStock) {
        $shopStock[0] = new ShopStock();
        $shopStock[0]->shopId = $shop->id;
        $shopStock[0]->itemId = $item->id;
        $shopStock[0]->count  = 0;
      }
      $user->wealth += $item->value;
      $shopStock[0]->count++;
      $user->save();
      $shopStock[0]->save();
      
      //Loot save should handle the case where count is 0
      $loot[0]->count--;
      $loot[0]->save();
    }
  }
  
  
  function get($shopId) {
    $user = $this->getUser();
    global $database;

    //name stat vlaue count
    $stmt = $database->prepare('SELECT i.id, i.name, i.stat, ss.count, i.value, i.class
                                FROM Item i, ShopStock ss 
                                WHERE ss."shopId" = ? AND ss."itemId" = i.id;');

    $stmt->execute(array($user->id));

    $playerLoot = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($playerLoot);
  }
  
}