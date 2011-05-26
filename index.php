#!/usr/bin/php
<?php
function __autoload($name) {
  $file = "classes/$name.php";
  if(file_exists(dirname(__FILE__) . "/$file")) {
    require($file);
  }
}

$application = new Application(array(
  array('/', 'MainHandler'),
  array('login', 'LoginHandler'),
  array('player/(\d+)', 'PlayerHandler')
), '/project/2010/271/g1027127(/web)?');

$database = new PDO('pgsql:host=db;port=5432;dbname=tw1509',
                    'tw1509',
                    'WxZy6ewRn7',
                    array(PDO::ATTR_PERSISTENT => true)
                   );

$application->serve();
