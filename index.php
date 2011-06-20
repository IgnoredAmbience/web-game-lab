#!/usr/bin/php
<?php
require('config.php');
include('debug.php');

function __autoload($name) {
  $file = "classes/$name.php";
  if(file_exists(dirname(__FILE__) . "/$file")) {
    require($file);
  }
}

$application = new Application(array(
  array('/',            'MainHandler'),

  array('map',          'MapHandler'),
  array('map/(\d+)?',   'MapHandler'),

  array('login',        'LoginHandler'),
  array('logout',       'LogoutHandler'),

  array('player',       'PlayerHandler'),
  array('player/(\d+)', 'PlayerHandler'),
  array('player/move',  'MoveHandler'),

  array('poll',         'PushHandler'),
  array('chat',         'ChatHandler'),

  array('shop/(\d+)',     'ShopHandler'),
  array('portal/(\d+)',     'PortalHandler'),

  array('attack',     'AttackHandler')
), $config['base_path']);

$database = new PDO($config['db'], $config['db_u'], $config['db_p'],  array(PDO::ATTR_PERSISTENT => true));
$database->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );

session_save_path('sessions');
session_start();

$application->serve();
