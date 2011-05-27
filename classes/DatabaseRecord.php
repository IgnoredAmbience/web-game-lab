<?php
abstract class DatabaseRecord {
  const pk = 'id';

  public function save() {
    // Returns number of rows inserted/updated
    global $database;
    $table = $this->tableName();
    $fields = get_object_vars($this);

    $pk = $this->pk();
    $pkv = $fields[$pk];
    unset($fields[$pk]);

    $cols = '(' . implode(array_keys($fields), ',') . ')';
    $vals = '(' . implode(array_fill(0, count($fields), ' ? '), ',') . ')';

    $i = 1;
    if(!$this->inDatabase()) {
      $stmt = $database->prepare("INSERT INTO $table $cols VALUES $vals");
      foreach($fields as $v) {
        $stmt->bindValue($i++, $v);
      }
      $stmt->execute();
    } else {
      $stmt = $database->prepare("UPDATE $table SET $cols = $vals WHERE $pkv = ?");
      foreach($fields as $v) {
        $stmt->bindValue($i++, $v);
      }
      $stmt->bindValue($i, $pkv);
      $stmt->execute();
    }

    return $stmt->rowCount();
  }

  public function delete() {
    // Returns number of rows deleted
    global $database;
    if(!$this->inDatabase()) return;

    $table = $this->tableName();
    $field = $this->pk();

    $result = $database->query("DELETE FROM $table WHERE $field = {$this->$field}");
    return $result->rowCount();
  }

  private function inDatabase() {
    // Only checks for content of PK
    $field = $this->pk();
    return ($this->$field >= 0);
  }

  private function tableName() {
    return get_class($this);
  }

  private function pk() {
    // Assumes that PK is unique identifier
    // that contains no information about the record
    return constant(get_class($this) . '::pk');
  }
}
