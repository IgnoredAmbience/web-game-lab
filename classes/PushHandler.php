<?php
class PushHandler extends Handler {
  /* Also, be aware of the 30 second script execution timeout! */
  private $separator = 'multipart-separator-';

  function put() {
    global $db;
    $p = $this->getUser();
    if($p) $p->ping();
    $this->initiate();

    ignore_user_abort(true);
    $sid = session_id();

    $n = new Notification();
    if(isset($_SESSION['pollId']) && $_SESSION['pollId']) {
      $n->disconnect_listener($_SESSION['pollId'], $sid, array('type'=>'disconnect'));
    }

    $_SESSION['pollId'] = $id = $n->register_listener($sid);
    $n->broadcast(array('type'=>'ping', 'listener'=>$id, 'sid'=>$sid, 'pid'=>getmypid()));

    // Close resources
    session_write_close();
    $db = null;

    // We abort the script, on session death, we will be blocked on death,
    // so have potentially lost one message for a user
    // TODO: Look into recovering this message
    //
    // connection_status() returns 0 whilst still connected
    while(!connection_status()) {
      $msg = $n->receive();
      if($msg) {
        $this->send_packet(json_encode($msg), 'application/json');
        if(is_array($msg) && isset($msg['type']) && $msg['type'] == 'disconnect') {
          break;
        }
      }
    }
    $n->deregister_listener();
    $n->broadcast(array('type'=>'pong', 'listener'=>$id, 'sid'=>$sid, 'pid'=>getmypid()));
  }

  private function initiate() {
    $this->separator .= rand();
    header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
    header("Expires: Thu, 01 Jan 1970 00:00:00 GMT"); // Date in the past
    header("Content-type: multipart/x-mixed-replace; boundary={$this->separator}");
  }

  private function send_packet($string, $content_type='text/plain') {
    echo "--{$this->separator}\n";
    echo "Content-type: $content_type\n\n";
    echo "$string\n";
    echo "--{$this->separator}\n";
    flush();
  }
}

