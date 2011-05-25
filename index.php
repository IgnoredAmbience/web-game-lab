#!/usr/bin/php
<?php
require('toro.php');

function __autoload($name) {
  $file = "classes/$name.php";
  if(file_exists(dirname(__FILE__) . "/$file")) {
    include_once $file;
  }
}

$application = new Application(array(
  array('/', 'MainHandler'),
  array('player/(\d+)', 'PlayerHandler')
), '/~tw1509/web');

$application->serve();
