<?php
header('Content-Type: application/json; charset=utf-8');//
// quelque soit la conf apache, ce script ne DOIT PAS etre mis dans le cache du navigateur
header("Cache-Control: no-cache, max-age=0");
header("Pragma: no-cache");
header("Expires: on, 01 Jan 1970 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
$domain1='https://pwademo.example.com';
$starturl='https://pwademo.example.com';
$scope='https://pwademo.example.com';
//echo __FILE__ . ' ' . __LINE__ . ' __LINE__ = <pre>' . var_export( $_SERVER , true ) . '</pre>' ; exit(0);
//echo $_SERVER['SCRIPT_URI']; exit();
if((isset($_SERVER['SCRIPT_URI']) && strpos($_SERVER['SCRIPT_URI'],'localhost')!==false)||(isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'],'localhost')!==false)){
 $domain1='http://localhost/pwademo';
 $starturl='http://localhost/pwademo';
 $scope='http://localhost/pwademo';
}
?>
{
 "name"         : "pwademo",
 "short_name"   : "pwademo" ,
 "description"  : "pwademo",
 "start_url"    : "<?php echo $starturl;?>/",
 "scope"        : "<?php echo $scope;?>/",
 "display"      : "standalone",
 "theme_color"  : "#99D9EA",
 "background_color"  : "#EEE",
 "icons"  : [
  {
   "src"    : "<?php echo $domain1;?>/pwademo192x192.png" ,
   "sizes"  : "192x192",
   "purpose": "maskable",
   "type"   : "image/png"
  },
  {
   "src"   : "<?php echo $domain1;?>/pwademo512x512.png" ,
   "sizes" : "512x512",
   "type"  : "image/png"
  }
 ],
 "orientation":"any",
 "version":"20210408-04" 
}
