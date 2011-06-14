#!/usr/bin/php
<?php
require('classes/Notification.php');

$q = msg_get_queue(Notification::key);

while(msg_receive($q, 0, $type, 1000, $msg, true, MSG_IPC_NOWAIT, $error)) {
  $msg = json_encode($msg);
  echo "$type ($error): $msg<br>";
}

