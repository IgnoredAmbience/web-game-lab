<?php
abstract class DatabaseRecord {
  const pk = 'id';

  public static function getById($id) {
    global $database;

    $table = get_called_class();
    $pk = static::pk;

    $stmt = $database->prepare("SELECT * FROM $table WHERE $pk = ? LIMIT 1");
    $stmt->execute(array($id));

    $result = $stmt->fetchObject($table);

    if(!$result):
      throw new Exception('Not found');
    else:
      return $result;
    endif;
  }

  public static function getByField($field, $value) {
    global $database;

    $table = get_called_class();

    $stmt = $database->prepare("SELECT * FROM $table WHERE $field = ?");
    $stmt->execute(array($value));

    return $stmt->fetchAll(PDO::FETCH_CLASS, $table);
  }

  public function save() {
    // Returns number of rows inserted/updated
    global $database;
    $table = get_called_class();
    $fields = get_object_vars($this);

    $pk = static::pk;
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
    $field = static::pk;

    $result = $database->query("DELETE FROM $table WHERE $field = {$this->$field}");
    return $result->rowCount();
  }

  private function inDatabase() {
    // Only checks for content of PK
    $field = static::pk;
    return ($this->$field >= 0);
  }
}
