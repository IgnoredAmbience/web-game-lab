#!/usr/bin/php
<pre>
<?php
$id = intval($_GET['kill']);
if($id) system("kill $id");
exec('ps auxf | grep index.php', $output);
foreach($output as $line) {
  echo htmlspecialchars($line), "\n";
}
?>
</pre>
