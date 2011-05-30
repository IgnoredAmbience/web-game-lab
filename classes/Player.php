<?php
class Player extends DatabaseRecord {
  public $id            = -1;
  public $x             = 0;
  public $y             = 0;
  public $name          = "";
  public $health        = 0;
  public $wealth        = 0;
  public $stealth       = 0;
  public $shelf         = 0;

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
    else:
      throw new Exception("unknown move type");
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
