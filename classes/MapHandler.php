<?php
class MapHandler extends Handler {
  public function get() {
    global $database;
    $stmt = $database->query('
      SELECT p.relname as type, tile.*
      FROM pg_class p, tile
      WHERE tile.tableoid = p.oid');

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  }
}

