<?php
class Handler {
  protected $xhr = false;
  protected $mobile = false;

  public function __construct($xhr, $mobile) {
    $this->xhr = $xhr;
    $this->mobile = $mobile;

    if($this->xhr) {
      header('Content-type: application/json');
      header('Pragma: no-cache');
      header('Cache-Control: no-cache, must-revalidate');
      header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    }
  }

  public function __call($name, $arguments) {
      header('HTTP/1.0 404 Not Found');
      echo '<h1>404 Not Found</h1>';
      echo "Function $name not found in " . get_class($this) . '<br/> Passed parameters: <pre>';
      print_r($arguments);
      echo '</pre>';
      exit;
  }

  public function error() {
    header('HTTP/1.0 500 Internal Server Error');
    echo '<h1>500</h1>';
    exit;
  }

  public function getUser() {
    global $database;
    if(isset($_SESSION['userId'])) {
      try {
        $p = Player::getById($_SESSION['userId'], 'Player');
        if($p->id <= 0) {
          return NULL;
        } else {
          return $p;
        }
      } catch (Exception $e) {
        return NULL;
      }
    } else {
      return NULL;
    }
  }

  public function requireLogin() {
    if(!isset($_SESSION['userId'])) {
      if($this->xhr) {
        header('HTTP/1.1 401 Unauthorized');
      } else {
        $this->redirect("login");
      }
      exit;
    }
  }

  public function redirect($redirectURL) {
    global $config;
    header("Location: ".$config['base_path']."/".$redirectURL);    
  }
}
