#!/usr/bin/php
<pre>
<?php
$id = intval($_GET['kill']);
if($id) system("kill $id");

$grep = '';
if(isset($_GET['grep'])) $grep = '|grep tw1509';

exec("ps auxf$grep", $output);
foreach($output as $line) {
  echo htmlspecialchars($line), "\n";
}
?>
</pre>
