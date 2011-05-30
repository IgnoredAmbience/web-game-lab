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

    $player->login();
  }

  function get() {
    ?>
    <form name="loginForm" action="login" method="post">
      User name: <input type="text" name="name" /> <br/>
      <input type="submit" name="submit">
    </form>
    <?php
  }
}
