#!/usr/bin/php
<pre>
<?php
if(isset($_GET['kill'])) {
  $id = intval($_GET['kill']);
  system("ipcrm -m $id");
}
system('ipcs');
?>
</pre>
