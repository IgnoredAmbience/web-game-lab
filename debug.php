<?php
// Taken from
// http://stackoverflow.com/questions/1159216/how-can-i-get-php-to-produce-a-backtrace-upon-errors/1159235#1159235
// for debugging purposes only

function process_error_backtrace($errno, $errstr, $errfile, $errline, $errcontext) {
  if(!(error_reporting() & $errno))
    return;
  switch($errno) {
  case E_WARNING      :
  case E_USER_WARNING :
  case E_STRICT       :
  case E_NOTICE       :
  case E_USER_NOTICE  :
    $type = 'warning';
    $fatal = false;
    break;
  default             :
    $type = 'fatal error';
    $fatal = true;
    header('HTTP/1.0 500 Internal Server Error');
    break;
  }
  $trace = array_reverse(debug_backtrace());
  array_pop($trace);
  if(php_sapi_name() == 'cli') {
    echo 'Backtrace from ' . $type . ' \'' . $errstr . '\' at ' . $errfile . ' ' . $errline . ':' . "\n";
    foreach($trace as $item)
      echo '  ' . (isset($item['file']) ? $item['file'] : '<unknown file>') . ' ' . (isset($item['line']) ? $item['line'] : '<unknown line>') . ' calling ' . $item['function'] . '()' . "\n";
  } else {
    echo '<p class="error_backtrace">' . "\n";
    echo '  Backtrace from ' . $type . ' \'' . $errstr . '\' at ' . $errfile . ' ' . $errline . ':' . "\n";
    echo '  <ol>' . "\n";
    foreach($trace as $item)
      echo '    <li>' . (isset($item['file']) ? $item['file'] : '<unknown file>') . ' ' . (isset($item['line']) ? $item['line'] : '<unknown line>') . ' calling ' . $item['function'] . '()</li>' . "\n";
    echo '  </ol>' . "\n";
    echo '</p>' . "\n";
  }
  if(ini_get('log_errors')) {
    $items = array();
    foreach($trace as $item)
      $items[] = (isset($item['file']) ? $item['file'] : '<unknown file>') . ' ' . (isset($item['line']) ? $item['line'] : '<unknown line>') . ' calling ' . $item['function'] . '()';
    $message = 'Backtrace from ' . $type . ' \'' . $errstr . '\' at ' . $errfile . ' ' . $errline . ': ' . join(' | ', $items);
    error_log($message);
  }
  if($fatal)
    exit(1);
}

function process_exception_backtrace($e) {
  header('HTTP/1.0 500 Internal Server Error');
  echo "Uncaught exception: " , $e->getMessage(), "\n";
  echo $e->getTraceAsString();
}

set_error_handler('process_error_backtrace');
set_exception_handler('process_exception_backtrace');
