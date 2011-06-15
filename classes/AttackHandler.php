<?php

class AttackHandler extends Handler {
  public function post() {
    global $database;
    $this->requireLogin();

    $user = $this->getUser();

    // Get all players in range
    $stmt = $database->prepare('
      SELECT * FROM Player
      WHERE ("x" > ?) AND ("x" < ?)
        AND ("y" > ?) AND ("y" < ?)
        AND ("lastActive" > CURRENT_TIMESTAMP - interval \'2 minutes\')
    ');
    $stmt->execute(array($user->x-2,$user->x+2,$user->y-2,$user->y+2));
    $attackees = $stmt->fetchAll(PDO::FETCH_CLASS,"Player");

    // Broadcast attack happened
    $n = new Notification();
    $n->broadcast(array('type' => 'attack', 'player' => (array) $user));

    // Tell attackees that they were attacked
    foreach ($attackees as &$attackee) {
      if ($attackee != $user)
        $attackee->attackedBy($user);
    }
  }
}
