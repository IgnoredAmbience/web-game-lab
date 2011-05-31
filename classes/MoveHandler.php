<?php

class MoveHandler extends Handler {
  function get() {
  ?>
    <form name="moveForm" action="move" method="post">
      <Input name="moveButton" type="submit" value="north" />
      <Input name="moveButton" type="submit" value="east" />
      <Input name="moveButton" type="submit" value="west" />
      <Input name="moveButton" type="submit" value="S" />
    </form>
  <?php
  }

  function post() {
    $user = getUser();

    if(($moveType == "north") ||
       ($moveType == "south") ||
       ($moveType == "east" ) ||
       ($moveType == "west" )) {
      $user->move($moveType);
    }
    else:
      throw new Exception("unknown move type");
    endif;

    echo $_POST['moveButton'];
    echo array($user->x,$user->y);
  }
}