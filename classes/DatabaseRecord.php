<?php
abstract class DatabaseRecord {
  const pk = 'id';

  public static function getById($id, $table = '') {
    global $database;

    if(function_exists('get_called_class')) {
      $table = get_called_class();
    } elseif(!is_subclass_of($table, 'DatabaseRecord')) {
      throw new Exception('Table name required');
    }
    $pk = constant($table . '::pk');

    $stmt = $database->prepare("SELECT * FROM $table WHERE \"$pk\" = ? LIMIT 1");
    $stmt->execute(array($id));

    $result = $stmt->fetchObject($table);

    if(!$result):
      throw new Exception('Not found');
    else:
      return $result;
    endif;
  }

  public static function getByField($field, $value, $table = '') {
    return self::getByFields(array($field => $value), $table);
  }

  public static function getByFields($array, $table = '') {
    global $database;

    if(function_exists('get_called_class')) {
      $table = get_called_class();
    } elseif(!@is_subclass_of($table, 'DatabaseRecord')) {
      throw new Exception('Table name required: '.$table);
    }

    foreach(array_keys($array) as $field) {
      if(!property_exists($table, $field)) {
        throw new Exception('Invalid field name: '.$field);
      }
      $params[] = "\"$field\" = ?";
    }
    $params = implode(' AND ', $params);


    $stmt = $database->prepare("SELECT * FROM $table WHERE $params");
    $stmt->execute(array_values($array));

    return $stmt->fetchAll(PDO::FETCH_CLASS, $table);
  }

  public function save() {
    // Returns number of rows inserted/updated
    global $database;
    $table = $this->tableName();
    $fields = get_object_vars($this);

    $pk = $this->pk();
    $pkv = $fields[$pk];
    unset($fields[$pk]);

    $cols = '"' . implode(array_keys($fields), '","') . '"';
    $vals = '(' . implode(array_fill(0, count($fields), ' ? '), ',') . ')';

    $i = 1;
    if(!$this->inDatabase()) {
      $stmt = $database->prepare("INSERT INTO $table ($cols) VALUES $vals RETURNING \"$pk\",$cols");
      foreach($fields as $v) {
        $stmt->bindValue($i++, $v);
      }
      $stmt->setFetchMode(PDO::FETCH_INTO, $this);
      $stmt->execute();

      $stmt->fetch(PDO::FETCH_INTO);
    } else {
      $stmt = $database->prepare("UPDATE $table SET ($cols) = $vals WHERE \"$pk\" = ?");
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

    $result = $database->query("DELETE FROM $table WHERE \"$field\" = {$this->$field}");
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
