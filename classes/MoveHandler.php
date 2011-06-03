<?php

class MoveHandler extends Handler {
  function get() {
  ?>
    <form name="moveForm" action="move" method="post">
      <Input name="moveType" type="submit" value="north" />
      <Input name="moveType" type="submit" value="east" />
      <Input name="moveType" type="submit" value="west" />
      <Input name="moveType" type="submit" value="south" />
    </form>
  <?php
  }

  public function post() {
    $this->requireLogin();

    $user = $this->getUser();
    $moveType = $_POST['moveType'];

    if(($moveType == "north") ||
       ($moveType == "south") ||
       ($moveType == "east" ) ||
       ($moveType == "west" )) {
      $user->move($moveType);
    }
    else {
      throw new Exception("unknown move type: ".$moveType);
    }

    echo json_encode(array('moveType'=>$moveType, 'x'=>$user->x, 'y'=>$user->y));
  }
}
