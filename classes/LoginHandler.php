<?php
class LoginHandler extends Handler {
  private function do_login() {
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

    $current_player = $this->getUser();
    if($current_player && $p != $current_player) {
      $current_player->logout();
    }

    $p->login();
    $_SESSION['userId'] = $p->id;

    return $p;
  }

  public function post() {
    $this->do_login();
    $this->get();
  }

  public function post_xhr() {
    echo json_encode($this->do_login());
  }

  function get() {
    ?>
    <form name="loginForm" action="login" method="post">
      User name: <input type="text" name="name" /> <br/>
      <input type="submit" name="submit">
    </form>
    <?php
    $p = $this->getUser();
    echo $p ? $p->name.' is currently playing in this session. <a href="logout">Logout</a>' : 'Fresh session';

  }
}
