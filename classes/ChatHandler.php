<?php
class ChatHandler extends Handler {
  function get() {
?>
<form action="" method="post">
<input type="text" name="message" />
<input type="submit" />
</form>
<?php
  }

  function post() {
    $p = $this->getUser();

    $msg = ($p ? $p->name : 'Guest') . ' says "' .
      htmlspecialchars($_POST['message']) . '"';

    $n = new Notification();
    $n->broadcast(array('type'=>'chat', 'msg'=>$msg));
  }
}
