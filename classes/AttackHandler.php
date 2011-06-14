<?php

class AttackHandler extends Handler {
  public function post() {
    $this->requireLogin();

    $user = $this->getUser();

    // Get all players in range
    $attackees = Player::getByMultipleFields(array( array("x" => $user->x-1,"y" => $user->y-1),
                                                    array("x" => $user->x-1, "y" => $user->y),
                                                    array("x" => $user->x-1, "y" => $user->y+1),
                                                    array("x" => $user->x, "y" => $user->y-1),
                                                    array("x" => $user->x, "y" => $user->y),
                                                    array("x" => $user->x, "y" => $user->y+1),
                                                    array("x" => $user->x+1, "y" => $user->y-1),
                                                    array("x" => $user->x+1, "y" => $user->y),
                                                    array("x" => $user->x+1, "y" => $user->y+1)
                                                  ),"Player");

    // Broadcast attack happened
    $n = new Notification();
    $n->broadcast(array('type' => 'attack', 'player' => (array) $this));

    // Tell attackees that they were attacked
    foreach ($attackees as &$attackee) {
      $attackee->attackedBy($this);
    }
  }
}
