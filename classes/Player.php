<?php
class Player extends DatabaseRecord {
  public $id = -1;
  public $x = 0;
  public $y = 0;
  public $name;
  public $lastActive = 'now';
  public $sessionId = '';
  public $health = 10;
  public $wealth = 0;
  public $stealth = 0;
  public $shelf = 1;
  public $mapId = 1;

  public function move($moveType) { //N S E W or teleport
    //TODO add validation for tile edges; wrap or clip?
    $currentMap = Map::getById($this->mapId, "Map");

    $x = $this->x;
    $y = $this->y;

    if($moveType == "north"):
      $this->y--;
    elseif($moveType == "south"):
      $this->y++;
    elseif($moveType == "east"):
      $this->x++;
    elseif($moveType == "west"):
      $this->x--;
    endif;

    if($this->x < 0 || $this->x >= $currentMap->width ||
       $this->y < 0 || $this->y >= $currentMap->height) {
      $this->x = $x;
      $this->y = $y;
      return false;
    } else {
      $this->save();

      $this->notifyOthers(array('type'=>'move', 'player'=>(array) $this, 'move'=>$moveType));
      return true;
    }
  }

  public function login() {
    $this->sessionId = session_id();
    $this->ping();
    $n = new Notification();
    $n->broadcast(array('type'=>'login', 'player'=> (array) $this));
  }

  public function logout() {
    $this->lastActive = '-infinity';
    $this->sessionId = '';
    $this->save();

    $n = new Notification();
    $n->broadcast(array('type'=>'logout', 'player'=> (array) $this));
  }

  public function ping() {
    $this->lastActive = 'now';
    $this->save();
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

  public function attackedBy($attacker) {
    // Change our own stats
    $this->health -= $attacker->shelf;
    $this->save();
    // Notify client of stat change
    $this->notify(array('type' => 'statChange', 'player' => (array) $this));
  }

  public function notify($array, $except=false) {
    $n = new Notification();
    $n->broadcast($array, $this->sessionId, $except);
  }

  public function notifyOthers($array) {
    $this->notify($array, true);
  }
}
