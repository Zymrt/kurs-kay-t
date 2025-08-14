<?php
$uri = getenv('DB_URI') ?: 'PASTE-AYNI-URI-BURAYA';
try {
  $manager = new MongoDB\Driver\Manager($uri);
  $cmd = new MongoDB\Driver\Command(['ping' => 1]);
  $cursor = $manager->executeCommand('kurs-kayit-db', $cmd);
  $res = current($cursor->toArray());
  var_dump($res);
} catch (Throwable $e) {
  echo "ERR: ".$e->getMessage().PHP_EOL;
}
