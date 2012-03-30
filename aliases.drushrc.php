<?php
$aliases['dev'] = array(
  'root' => '/var/www/domains/busstop.ch/public_html',
  'uri' => 'http://busstop.ch.azdev.nine.ch/',
  'remote-host' => 'azdev.nine.ch',
  'remote-user' => 'busstop_ch',
 'path-aliases' => array(
   '%dump-dir' => '/var/www/domains/busstop.ch/',
 ),
 'command-specific' => array (
       'sql-sync' => array (
         'no-cache' => TRUE,
       ),
     ),
);

