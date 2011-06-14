<?php
class MapHandler extends Handler {
  public function get($mapId = 1) {
    global $database;
    $mapId = intval($mapId);

    try {
      $map = Map::getById($mapId, 'Map');
    } catch (Exception $e) {
      $this->error();
    }

    $stmt = $database->prepare('
      SELECT p.relname AS type, tile.id, tile.x, tile.y
      FROM pg_class p, tile
      WHERE tile.tableoid = p.oid AND tile."mapId" = ?');
    $stmt->execute(array($mapId));

    $map->tiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $database->query('
      SELECT * FROM player WHERE "lastActive" > CURRENT_TIMESTAMP - interval \'2 minutes\'
    ');
    $map->players = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($map);
  }
}

