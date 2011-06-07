<?php
class LogoutHandler extends Handler {
  public function post() {
    if(isset($_SESSION['userId'])) {
      $p = Player::getById($_SESSION['userId'], 'Player');
      $p->logout();
      unset($_SESSION['userId']);
    }
  }
  public function get() {
    $this->post();
    LoginHandler::get();
  }
}
