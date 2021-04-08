<?php
define('REFNAME','20210408-04'); // la version est composée de la date et d'un chiffre 01 .. 99
                                 // si ce chiffre est pair, c'est une version de production
define('CRLF',"\r\n");
$isLocalhst1=false; // c'est important d'avoir un fonctionnement en localhost et un fonctionnement en prod
if((isset($_SERVER['SCRIPT_URI']) && strpos($_SERVER['SCRIPT_URI'],'localhost')!==false)||(isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'],'localhost')!==false)){
 $isLocalhst1=true;
}
//===========================================================================================
// si on reçoit un appel de type POST
if(isset($_POST)&&sizeof($_POST)>0&&isset($_POST['data'])){
 $ret=array('status' => 'KO');
 $data=@json_decode($_POST['data'],true);
 if($data!==NULL){
  if($data['fonction']=='chk1'){ // si la fonction demandée est un "checkversion" , on retourne la version courante sur le serveur
   $ret['version']=REFNAME;      // remarque: comme cet appel est passé toutes les heures, on peut en profiter pour faire passer
   $ret['status']='OK';          // un message d'avertissement concernant le date de maj de la version future prévue.
  }
 }
 header('Content-Type: application/json');
 echo json_encode($ret);
 exit(0);
}
//===========================================================================================
header('Vary: User-Agent');
header("Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
if(!ob_start("ob_gzhandler")) ob_start();
$ht1='';
$ht1.='<!DOCTYPE html>'.CRLF;
$ht1.='<html lang="fr">'.CRLF;
$ht1.='<head>'.CRLF;
$ht1.='<meta charset="utf-8" />'.CRLF;
$ht1.='<title>pwademo</title>'.CRLF;
$ht1.='<meta name="mobile-web-app-capable" content="yes" />'.CRLF;
$ht1.='<meta name="apple-mobile-web-app-capable" content="yes" />'.CRLF;
$ht1.='<meta name="apple-mobile-web-app-title" content="pwademo" />'.CRLF;
$ht1.='<meta name="apple-touch-fullscreen" content="yes" />'.CRLF;
$ht1.='<meta name="viewport" content="width=device-width, initial-scale=1" />'.CRLF;
$ht1.='<meta name="description" content="pwademo" />'.CRLF;
$ht1.='<meta name="author" content="Hugues" />'.CRLF;
$ht1.='<meta name="theme-color" content="#99D9EA" />'.CRLF;
if($isLocalhst1){
 $ht1.='<link rel="manifest" href="http://localhost/pwademo/manifest-'.REFNAME.'.json.php" />'.CRLF; // le fichier manifest est versionné
}else{
 $ht1.='<link rel="manifest" href="https://pwademo.example.com/manifest-'.REFNAME.'.json.php" />'.CRLF; // le fichier manifest est versionné
}
$ht1.='<link rel="apple-touch-icon" sizes="512x512" href="pwademo512x512.jpg" />'.CRLF;
$ht1.='<link rel="shortcut icon" href="favicon.ico" />'.CRLF;
$ht1.='<style>'.CRLF;
$ht1.='*{-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;padding: 0;}'.CRLF;
$ht1.='html,body{height: 100%;margin:0;padding:0;border:0;}'.CRLF;
$ht1.='body{background-color:#fff;color:#333;font-family: arial, sans-serif;font-size:16px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;text-size-adjust:100%;width:100%;position:absolute;top:-1px;touch-action:manipulation;}'.CRLF;
$ht1.='label{border:2px #b6bbe6 outset;padding:10px 3px;border-radius:7px;cursor:pointer;box-shadow:1px 1px 5px #ccc;}'.CRLF;
$ht1.='td{line-height:2.5em;}'.CRLF;
$ht1.='h1,h2{text-align:center;font-size:1.7em;color:blue;}'.CRLF;
$ht1.='h3{text-align:center;font-size:1.5em;}'.CRLF;
$ht1.='hr{width:80%;margin:7px auto;}'.CRLF;
$ht1.='input[type="radio"]{display: none;}'.CRLF;
$ht1.='input[type="radio"] + div {height: 20px;width: 20px;display: inline-block;cursor: pointer;vertical-align: middle;background: #FFF;border: 1px solid #d2d2d2;border-radius: 100%;}'.CRLF;
$ht1.='input[type="radio"] + div:hover {border-color: #c2c2c2;}'.CRLF;
$ht1.='input[type="radio"]:checked + div{background:lime;}'.CRLF;
$ht1.='#container{z-index:0;background: linear-gradient(rgb(225, 255, 255), rgb(177, 216, 245));color:##0f0fe4;}'.CRLF;
$ht1.='button{border-radius:7px;font-size:1em;padding:0;margin:0;cursor:pointer;outline:none;box-shadow:1px 1px 5px #ccc;}'.CRLF;
$ht1.='button:active{border-radius:0px;box-shadow:1px 1px 3px #f00;background:red;}'.CRLF;
$ht1.='</style>'.CRLF;
$ht1.='</head>'.CRLF;
$ht1.='<body>'.CRLF;
$ht1.='<div id="description">'.CRLF;
// on met toutes les icones svg ici avec un display:none
$ht1.='<svg id="mySVG" style="display:none;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'.CRLF;
$ht1.='<g id="bac1"><path stroke="blue" stroke-width="12" fill-opacity="1" fill="none" d="M 30 20 A35 35 0 1 0 70 20  M 68 41 L 66 19 L 90 20"></path></g>'.CRLF;
$ht1.='</svg>'.CRLF;
$ht1.='</div>'.CRLF;
$ht1.='<div id="container" style=""></div>'.CRLF;
$ht1.='<script>'.CRLF;
$ht1.='var glob1=null;'.CRLF;
$ht1.='var init1={"objName":"glob1","version":"'.REFNAME.'","loch1":'.($isLocalhst1?'true':'false').'}'.CRLF;
$ht1.='</script>'.CRLF;
$ht1.='<script src="/pwademo/js-'.REFNAME.'.js"></script>'.CRLF; // le fichier js est versionné
$ht1.='</body></html>';
echo $ht1;