<?php
class Shop extends Tile {
  public $id   = -1;
  public $name;

  public function sellItem() {
    throw new Exception("Not yet implemented");
  }

  public function buyItem() {
    throw new Exception("Not yet implemented");
  }
}
