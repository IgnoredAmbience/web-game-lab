<?php
class PushHandler extends Handler {
  /* Also, be aware of the 30 second script execution timeout! */
  private $separator = 'multipart-separator-';

  function get() {
  // Demo script
?>
<div id="count">Unloaded</div>
<script>
  var r = new XMLHttpRequest();
  r.multipart = true;
  r.open('PUT', 'poll', false);
  r.onload = function(evt) {
    document.getElementById('count').innerHTML += '('+r.responseText+')';
  }
  r.send(null);
</script>
<?php
  }

  function put() {
    $this->initiate();

    for($i = 0; $i < 10; $i++) {
      $this->send_packet($i);
      sleep(1);
    }
  }

  private function initiate() {
    $this->separator .= rand();
    header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
    header("Expires: Thu, 01 Jan 1970 00:00:00 GMT"); // Date in the past
    header("Content-type: multipart/x-mixed-replace; boundary={$this->separator}");
  }

  private function send_packet($string, $content_type='text/plain') {
    echo "Content-type: $content_type\n\n";
    echo "$string\n";
    echo "--{$this->separator}\n";
    flush();
  }
}

