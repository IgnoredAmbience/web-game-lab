#!/usr/bin/php
<pre>
<?php
if(isset($_GET['kill'])) {
  system('pkill -U `whoami`');
}

$grep = '';
if(isset($_GET['grep'])) $grep = '|grep `whoami`';

exec("ps auxf$grep", $output);
foreach($output as $line) {
  echo htmlspecialchars($line), "\n";
}
?>
</pre>
