<?php
class Player extends DatabaseRecord {
  public $id = -1;
  public $x = 0;
  public $y = 0;
  public $name;
  public $lastActive = 'now';
  public $health = 10;
  public $wealth = 0;
  public $stealth = 0;
  public $shelf = 1;
  public $mapId = 1;

  public function move($moveType) { //N S E W or teleport
    //TODO add validation for tile edges; wrap or clip?
    $currentMap = Map::getById($this->mapId, "Map");

    if($moveType == "north"):
      $this->y = max($this->y - 1, 0);
    elseif($moveType == "south"):
      $this->y = min($this->y + 1, $currentMap->height - 1);
    elseif($moveType == "east"):
      $this->x = min($this->x + 1, $currentMap->width - 1);
    elseif($moveType == "west"):
      $this->x = max($this->x - 1, 0);
    endif;

    $this->save();

    $n = new Notification();
    $n->broadcast(array('type'=>'move', 'player'=>$this, 'move'=>$moveType));
  }

  public function login() {
    $this->lastActive = 'now';
    $this->save();

    $n = new Notification();
    $n->broadcast(array('type'=>'login', 'player'=>$this));
  }

  public function logout() {
    $this->lastActive = '';
    $this->save();

    $n = new Notification();
    $n->broadcast(array('type'=>'logout', 'player'=>$this));
  }

  public function buyItem() {
    throw new Exception("Not yet implemented");
  }

  public function sellItem() {
    throw new Exception("Not yet implemented");
  }

  public function playerAsJSON() {
    return json_encode(get_object_vars());
  }

}
