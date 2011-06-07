<?php
class LogoutHandler extends Handler {
  public function get() {
    if(isset($_SESSION['userId'])) {
      $p = Player::getById($_SESSION['userId'], 'Player');
      $p->logout();
      unset($_SESSION['userId']);
    }
    LoginHandler::get();
  }
}
