<?php
// This file is a slimmed-down version of the Toro framework
// http://toroweb.org/

class Application {
    private $_handler_route_pairs = array();

    public function __construct($handler_route_pairs) {
        foreach ($handler_route_pairs as $pair) {
            $this->_handler_route_pairs[] = $pair;
        }
    }

    public function serve() {
        $request_method = strtolower($_SERVER['REQUEST_METHOD']);
        $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '/';
        $discovered_handler = NULL;
        $regex_matches = array();
        $method_arguments = NULL;

        foreach ($this->_handler_route_pairs as $handler) {
            list($pattern, $handler_name) = $handler;

            if ($path_info == $pattern) {
                $discovered_handler = $handler_name;            
                $regex_matches = array($path_info, preg_replace('/^\//', '', $path_info));
                $method_arguments = $this->get_argument_overrides($handler);
                break;
            }
            else {
                $pattern = str_replace('/', '\/', $pattern);                
                
                if (preg_match('/^\/' . $pattern . '\/?$/', $path_info, $matches)) {
                    $discovered_handler = $handler_name;
                    $regex_matches = $matches;
                    $method_arguments = $this->get_argument_overrides($handler);
                    break;
                }
            }
        }

        if ($discovered_handler && class_exists($discovered_handler)) {
            unset($regex_matches[0]);
            $handler_instance = new $discovered_handler();

            if (!$method_arguments) {
                $method_arguments = $regex_matches;
            }

            // XHR (must come first), iPad, mobile catch all
            if ($this->xhr_request() && method_exists($discovered_handler, $request_method . '_xhr')) {
                header('Content-type: application/json');
                header('Pragma: no-cache');
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                $request_method .= '_xhr';
            }
            else if ($this->mobile_request() && method_exists($discovered_handler, $request_method . '_mobile')) {
                $request_method .= '_mobile';
            }

            call_user_func_array(array($handler_instance, $request_method), $method_arguments);
        }
        else {
            header('HTTP/1.0 404 Not Found');
            echo '404 Not Found';
            exit;
        }
    }

    private function get_argument_overrides($handler_route) {
        if (isset($handler_route[2]) && is_array($handler_route[2])) {
            return $handler_route[2];
        }
        return NULL;
    }

    private function xhr_request() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
    }

    private function mobile_request() {
        return strstr($_SERVER['HTTP_USER_AGENT'], 'iPhone') || strstr($_SERVER['HTTP_USER_AGENT'], 'iPod') || strstr($_SERVER['HTTP_USER_AGENT'], 'Android') || strstr($_SERVER['HTTP_USER_AGENT'], 'webOS');
    }
}

class Handler {
    public function __construct() { }

    public function __call($name, $arguments) {
        header('HTTP/1.0 404 Not Found');
        echo '404 Not Found';
        exit;
    }
}
