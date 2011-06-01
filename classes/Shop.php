<?php
class Shop extends Tile {
  public $id   = -1;
  public $name;

  public function sellItem() {
    throw new Exception("Not yet implemented");
  }

  public function buyItem() {
    throw new Exception("Not yet implemented");
  }

  public static function getShop($x, $y, $mapId) {
    global $database;
    $stmt = $database->prepare("SELECT * FROM Shop WHERE x = ? AND
                                                         y = ? AND mapId = ?");
    $stmt->execute(array($user->x, $user->y, $user->mapId));
    
    if(!$stmt->rowCount()) { //is there a shop here?
      return $stmt->fetchObject('Shop');
    }
    return null;
  }

}
