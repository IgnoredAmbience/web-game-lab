#!/usr/bin/php
<?php
require('toro.php');

function __autoload($name) {
  $file = $name . '.php';
  if(file_exists(dirname(__FILE__) . "/classes/$file")) {
    include_once $file;
  }
}

$application = new Application(
  array('/', 'MainHandler'),
  array('about', 'MainHandler')
);

$application->serve();
?>
