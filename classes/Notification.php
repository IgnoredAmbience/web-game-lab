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

  public function register_listener($uid = 0) {
    // Registers this thread as a listener
    if($this->listenerId) return $this->listenerId;
    sem_acquire($this->sema);
      $v = @shm_get_var($this->idMap, 0);
      if($v === FALSE) {
        $v = array(1 => TRUE);
        $i = 1;
      } else {
        $c = count($v);
        for($i = 1; $i <= $c+1; $i++) {
          if(!isset($v[$i]) || !$v[$i]) {
            $v[$i] = $uid ? $uid : TRUE;
            break;
          }
        }
      }
      $this->listenerId = $i;
      shm_put_var($this->idMap, 0, $v);
    sem_release($this->sema);
    return $i;
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

  public function get_listeners() {
    sem_acquire($this->sema);
      $v = @shm_get_var($this->idMap, 0);
    sem_release($this->sema);
    return $v;
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

  public function broadcast($msg) {
    $v = $this->get_listeners();
    if(!is_array($v)) return;
    foreach($v as $id => $val) {
      if($val) {
        $this->send($id, $msg);
      }
    }
  }

  public function send($id, $msg) {
    msg_send($this->queue, $id, $msg);
  }

  public function receive() {
    msg_receive($this->queue, $this->listenerId, $type, 1000, $msg);
    return $msg;
  }
}
