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

    $user = getUser();
    $itemId = json_decode($_POST['item']);
    $action = $_POST['action'];

    //Look up the item being bought
    if(!$shop = Shop::getByFields(array("x"=>$user->x, "y"=>$user->y,
					    "mapId" => $user->mapId))) {
      return;
    }

    if(!$item = Item::getById($itemId, 'Item')) {
      return;
    }

    $shopStock = ShopStock::getByFields(array("shopId"=>$shop->id,
					      "itemId"=>$item->id)));

    if ($action == "buy") {

      if(!$shopStock) {
	return;
      }

      if($player->wealth >= $item->value) {
	$player->wealth -= $item->value;
	$shopStock[0]->count--;
	$player->save();
	$shopStock[0]->save();
      }
    }
    elseif($action == "sell") {
      if(!$loot = PlayerLoot::getByFields(array("playerId"=>$user->id,
						"itemId"=>$item->id))) {
	return;
      }

      if(!$loot->count) {
	return;
      }

      if(!$shopStock) {
	$shopStock[0] = new ShopStock();
	$shopStock[0]->shopId = $shop->id;
	$shopStock[0]->itemId = $item->id;
	$shopStock[0]->count = 0;
      }
	$player->wealth += $item->value;
	$shopStock[0]->count++;
	$player->save();
	$shopStock[0]->save();

	//TODO, remove item from loot when selling stuff
    }
  }

  function get() {
    $user = $this->getUser();
    
?>
    <form action="" method="foo">
       <input type="submit" /> 
    </form>
<?php

    if($shop = Shop::getByFields(array("x"=>$user->x, "y"=>$user->y,
				       "mapId" => $user->mapId), 'Shop')) { 
      if($shopStock = ShopStock::getByField("shopId",$shop->id,"ShopStock")) {
	foreach($shopStock as $shopItem) {
	  $items[] = Item::getById($shopItem->itemId, "Item");
	}
	return json_encode($items);
      }
    } //deliberately = and not == or ===
  }


}
