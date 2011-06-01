<?php
class LoginHandler extends Handler {
  function post() {
    global $database;
    $name = trim($_POST['name']);
    if(!$name) $this->error();

    $p = Player::getByField('name', $name, 'Player');

    if(count($p)) {
      $p = $p[0];
    } else {
      $p = new Player();
      $p->name = $name;
    }

    $p->login();
    echo '<pre>';
    print_r($p);
    print_r($_SESSION);
    echo '</pre>';
  }

  function get() {
    ?>
    <form name="loginForm" action="login" method="post">
      User name: <input type="text" name="name" /> <br/>
      <input type="submit" name="submit">
    </form>
    <?php
    $p = $this->getUser();
    echo $p ? $p->name.' is currently playing in this session.' : 'Fresh session';

  }
}
