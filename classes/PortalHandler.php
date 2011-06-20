<?php
class PortalHandler extends Handler {
  public function get($portalID) {
    if($portal = Portal::getById($portalID, 'Portal')) {
      //echo json_encode(array($portal->dest_map,$portal->dest_x,$portal->dest_y));
      echo $portal->dest_map;
    }
  }
}
