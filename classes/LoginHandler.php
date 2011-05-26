<?php
class LoginHandler extends Handler {
  function post() {
    global $database;
    $name = trim($_POST['name']);
    if(!$name) $this->error();

    $stmt = $database->prepare('SELECT * FROM Player where name = ?');
    $stmt->execute(array($name));

    if(!$stmt->rowCount()) {
      $player = new Player();
      $player->name = $name;
      $player->save();
    } else {
      $player = $stmt->fetchObject('Player');
    }

    // Do stuff
    echo $player->name;
  }
}