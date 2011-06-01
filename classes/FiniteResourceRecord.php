<?php
abstract class FiniteResourceRecord extends DatabaseRecord {
  const COUNT_FIELD = 'count';

  public function save() {
    $field = static::COUNT_FIELD;
    if(!$this->$field) {
      $this->delete();
    } else {
      parent::save();
    }
  }
}
