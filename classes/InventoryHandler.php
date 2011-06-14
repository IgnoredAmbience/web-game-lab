<?php
class InventoryHandler extends Handler {
  function get() {
    
    $user = $this->getUser();
    global $database;

    //name stat vlaue count
    $stmt = $database->prepare('SELECT i.name, i.stat, l.count, i.value
                                FROM Item i, PlayerLoot l 
                                WHERE l."playerId" = ? AND l."itemId" = i.id;');

    $stmt->execute(array($user->id));

    $playerLoot = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($playerLoot);

  }
}