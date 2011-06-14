<?php
class PushHandler extends Handler {
  /* Also, be aware of the 30 second script execution timeout! */
  private $separator = 'multipart-separator-';

  function put() {
    global $db;
    $p = $this->getUser();
    if($p) $p->ping();
    $this->initiate();

    // Close resources
    session_write_close();
    $db = null;

    ignore_user_abort(true);

    $n = new Notification();
    $n->register_listener();
    $n->broadcast(array('type'=>'ping'));

    // We abort the script, on session death, we will be blocked on death,
    // so have potentially lost one message for a user
    // TODO: Look into recovering this message
    //
    // connection_status() returns 0 whilst still connected
    while(!connection_status()) {
      $msg = $n->receive();
      if($msg) {
        if(is_array($msg) && isset($msg['type']) && $msg['type'] == 'disconnect') {
          break;
        } else {
          $this->send_packet(json_encode($msg), 'application/json');
        }
      }
    }
  }

  public function get() {
    $n = new Notification();
    print_r($n->get_listeners());
    print_r($n->stat_q());
  }

  private function initiate() {
    $this->separator .= rand();
    header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
    header("Expires: Thu, 01 Jan 1970 00:00:00 GMT"); // Date in the past
    header("Content-type: multipart/x-mixed-replace; boundary={$this->separator}");
    ob_implicit_flush(true);
  }

  private function send_packet($string, $content_type='text/plain') {
    echo "--{$this->separator}\n";
    echo "Content-type: $content_type\n\n";
    echo "$string\n";
    echo "--{$this->separator}\n";
  }
}

