<?php
/* Inter-process communication class for instantaneous notifications with minimal overhead */
class Notification {
  private $key;
  private $queue;
  private $sema;
  private $idMap;
  private $listenerId = 0;

  public function __construct() {
    $this->key = ftok(__FILE__, 'g');
    $this->queue = msg_get_queue($this->key);
    $this->sema = sem_get($this->key+1);
    $this->idMap = shm_attach($this->key+2);
  }

  public function __destruct() {
    $this->deregister_listener();
  }

  public function register_listener($uid = TRUE) {
    // Registers this thread as a listener
    if($this->listenerId) return $this->listenerId;
    sem_acquire($this->sema);
      $v = @shm_get_var($this->idMap, 0);
      if($v === FALSE) {
        $v = array(1 => $uid);
        $i = 1;
      } else {
        $c = count($v);
        for($i = 1; $i <= $c+1; $i++) {
          if(!isset($v[$i]) || !$v[$i]) {
            $v[$i] = $uid;
            break;
          }
        }
      }
      $this->listenerId = $i;
      shm_put_var($this->idMap, 0, $v);
    sem_release($this->sema);

    $this->clear();
    return $i;
  }

  public function disconnect_listener($listenerId, $uid, $disconnect_msg) {
    /* Disconnects the $listenerId iff it is for $uid */
    sem_acquire($this->sema);
      $v = @shm_get_var($this->idMap, 0);
      if(isset($v[$listenerId]) && $v[$listenerId] === $uid) {
        $this->send($listenerId, $disconnect_msg);
      }
    sem_release($this->sema);
  }

  public function deregister_listener() {
    if($this->listenerId) {
      sem_acquire($this->sema);
        $v = @shm_get_var($this->idMap, 0);
        unset($v[$this->listenerId]);
        shm_put_var($this->idMap, 0, $v);
      sem_release($this->sema);
    }
  }

  private function get_listeners() {
    return @shm_get_var($this->idMap, 0);
  }

  public function stat_q() {
    return msg_stat_queue($this->queue);
  }

  public function cleanup_all() {
    $this->listenerId = 0;
    msg_remove_queue($this->queue);
    shm_remove($this->idMap);
    sem_remove($this->sema);
  }

  public function broadcast($msg, $checkVal='', $except=false) {
    sem_acquire($this->sema);
      $v = $this->get_listeners();
      if(!is_array($v)) return;
      foreach($v as $qid => $val) {
        if($val && (!$checkVal || ($except xor ($checkVal == $val)))) {
          $this->send($qid, $msg);
        }
      }
    sem_release($this->sema);
  }

  public function send($id, $msg) {
    msg_send($this->queue, $id, $msg);
  }

  public function receive() {
    msg_receive($this->queue, $this->listenerId, $type, 1000, $msg);
    return $msg;
  }

  public function clear() {
    // Empties the specified queue of messages
    while(msg_receive($this->queue, $this->listenerId, $type, 1000, $msg, true, MSG_IPC_NOWAIT)) {}
  }
}
