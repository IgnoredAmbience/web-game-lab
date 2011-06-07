<?php
class PlayerHandler extends Handler {
  function get($id = 0) {
    if(!$id) {
      // Return currently logged-in user
      $this->requireLogin();
      $p = $this->getUser();
    } else {
      $p = Player::getById($id, 'Player');
    }
    if(!$p) {
      $this->error404();
    } else {
      echo json_encode($p);
    }
  }
}
