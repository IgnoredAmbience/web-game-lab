#!/usr/bin/php
<pre>
<?php
if(isset($_GET['kill'])) {
  system('pkill -U `whoami`');
}

$grep = '';
if(isset($_GET['grep'])) $grep = ' -u `whoami`';

exec("ps f $grep", $output);
foreach($output as $line) {
  echo htmlspecialchars($line), "\n";
}
?>
</pre>
