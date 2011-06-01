<?php
class Player extends DatabaseRecord {
  public $id = -1;
  public $x;
  public $y;
  public $name;
  public $health;
  public $wealth;
  public $stealth = -1;
  public $shelf;
  public $mapId;

  public function move($moveType) { //N S E W or teleport
    //TODO add validation for tile edges; wrap or clip?
    $currentMap = Map::getById($this->mapId, "Map");

    if($moveType == "north"):
      $this->y = max($this->y - 1, 0);
    elseif($moveType == "south"):
      $this->y = min($this->y + 1, $currentMap->height);
    elseif($moveType == "east"):
      $this->x = min($this->x + 1, $currentMap->width);
    elseif($moveType == "west"):
      $this->x = max($this->x - 1, 0);
    endif;
  }

  public function login() {
    throw new Exception("Not yet implemented");
  }

  public function logout() {
    throw new Exception("Not yet implemented");
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
