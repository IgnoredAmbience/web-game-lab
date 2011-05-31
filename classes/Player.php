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

  public function move($moveType) { //N S E W or teleport
    //TODO add validation for tile edges; wrap or clip?
    if($moveType == "north"):
      $this->y += 1;
    elseif($moveType == "south"):
      $this->y -= 1;
    elseif($moveType == "east"):
      $this->x += 1;
    elseif($moveType == "west"):
      $this->x -= 1;
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

}
