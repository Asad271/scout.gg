<?php
// LibreSpeed Configuration
$config = array(
    "title" => "Scout.gg Speed Test",
    "message" => "Test your internet speed for gaming",
    "finish_url" => "",
    "server" => array(
        array(
            "name" => "Scout.gg Server",
            "server" => "http://localhost:8080",
            "dlURL" => "/garbage.php",
            "ulURL" => "/empty.php",
            "pingURL" => "/empty.php",
            "jitterURL" => "/empty.php",
            "getIPURL" => "/getIP.php"
        )
    ),
    "enable_logging" => false,
    "enable_debug" => false
);
?>
