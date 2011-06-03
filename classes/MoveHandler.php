<?php

class MoveHandler extends Handler {
  function get() {
  ?>
    <form name="moveForm" action="move" method="post">
      <Input name="moveButton" type="submit" value="north" />
      <Input name="moveButton" type="submit" value="east" />
      <Input name="moveButton" type="submit" value="west" />
      <Input name="moveButton" type="submit" value="south" />
    </form>
  <?php
  }

  function post() {
    $this->requireLogin();

    $user = $this->getUser();
    $moveType = $_POST['moveButton'];

    if(!$user) {
      throw new Exception("No User found");
    }

    if(($moveType == "north") ||
       ($moveType == "south") ||
       ($moveType == "east" ) ||
       ($moveType == "west" )) {
      $user->move($moveType);
    }
    else {
      throw new Exception("unknown move type: ".$moveType);
    }

    echo $_POST['moveButton'];
    echo "(",$user->x,",",$user->y,")";
  }
}