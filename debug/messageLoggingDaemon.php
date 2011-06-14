#!/usr/bin/php
<?php
/* This script is designed to loop infinitely,
 * logging all messages into a logfile */
ignore_user_abort(true);
require('classes/Notification.php');

$n = new Notification();
$id = $n->register_listener();
echo "Listener #$id";

$q = msg_get_queue(Notification::key);

$fp = fopen('data.txt', 'w');

while(true) {
  msg_receive($q, $id, $type, 1000, $msg, true, 0, $error);
  if(!$msg) {
    $msg = "Got error code $error";
  } else {
    $msg = json_encode($msg);
  }
  $line = date('c').": $msg\n";
  fwrite($fp, $line);
  echo $line;
}

