<?php
class PortalHandler extends Handler {
  public function get($portalID) {
    $this->requireLogin();
    
    $user = $this->getUser();
    if($portal = Portal::getById($portalID, 'Portal')) {
      $user->changeMap($portal->dest_map);
      //echo json_encode(array($portal->dest_map,$portal->dest_x,$portal->dest_y));
      echo $portal->dest_map;
    }
  }
}
