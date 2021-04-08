<?php
$globalVersion='20210408-04';
//header('Content-Type: application/javascript');
// quelque soit la conf apache, ce script ne DOIT PAS être mis dans le cache du navigateur
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: on, 01 Jan 1970 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header('Content-Type: application/javascript');
$complementUrl1='';
$protocol1='/';
$js1='js-'.$globalVersion.'.js';
$loch1='false'; // on s'en servira plus bas
$man1='manifest-'.$globalVersion.'.json.php';
if((isset($_SERVER['SCRIPT_URI']) && strpos($_SERVER['SCRIPT_URI'],'localhost')!==false)||(isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'],'localhost')!==false)){
 $complementUrl1='pwademo/';
 $protocol1='http://localhost/';
 $js1='js-'.$globalVersion.'.js';
 $loch1='true';
}
?>
var protocol1='<?php echo $protocol1;?>';
var complementUrl1='<?php echo $complementUrl1;?>';
var globalVersion='<?php echo $globalVersion;?>';
var js1='<?php echo $js1;?>';
var man1='<?php echo $man1;?>';
var loch1='<?php echo $loch1;?>';
var expectedCaches=['static-'+globalVersion];
this.addEventListener('install', function(event){
  self.skipWaiting();
  if(loch1){
   console.log('install');
  }
  event.waitUntil(
    caches.open(expectedCaches[0]).then(function(cache) {
      var tab1=[        
       protocol1+complementUrl1,
       protocol1+complementUrl1+js1,
       protocol1+complementUrl1+man1,
       protocol1+complementUrl1+'pwademo512x512.png',
       protocol1+complementUrl1+'favicon.ico'
      ];
      if(loch1){
       console.log(tab1);
      }
      return cache.addAll(tab1);
    })
  );
});

this.addEventListener('activate', 
 function(event) {
  if(loch1){
   console.log('activate');
  }
  clients.claim(); // now, navigator.serviceWorker.controller is not null anymore in the main script
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if(expectedCaches[0].indexOf(key) === -1) {
          var retu=caches.delete(key);
          return retu;
        }
      }));
    })
  );
});


this.addEventListener('fetch', 
 function(event) {
  var requestURL = new URL(event.request.url);
  if(loch1){
   console.log('fetch event.request=',requestURL,event.request,'\n');
  }
  if(event.request.method=='GET'){
    event.respondWith(
     caches.match(event.request, {ignoreVary: true})
      .then(function(response){
       var urlBase=protocol1+complementUrl1;
       if(response){ // Cache hit - return response
         return response;
       }
       if(loch1){
        console.log('no cache hit for url:',requestURL); // http://localhost/pwademo/
       }
       return fetch(event.request);
      }
     )
    );
   
  }else if(event.request.method=='POST'){
   try{
    if(navigator.onLine==false){
      var retour={
       status:'KO',
       message:'yerk, offline in service worker'
      };
      var responseOffline = new Response(
       JSON.stringify(retour), 
       {
        headers: { "Content-Type" : "application/json" }
       }
      );
      event.respondWith(responseOffline);
    }else{
     event.respondWith(
      fetch(event.request).catch(
       function(error){
        var retour={
         status:'KO',
         message:'yerk, offline'
        };
        var aaahh = new Response(
         JSON.stringify(retour), 
         {
          headers: { "Content-Type" : "application/json" }
         }
        );
        return aaahh;
       }
      )
     );
    }
   }catch(e){
    event.respondWith( fetch(event.request)  );
   }
  }else{
   event.respondWith( fetch(event.request)  );
  }
 }
);
//=============================================================================
// capture des messages
addEventListener('message', event => { // event is an ExtendableMessageEvent object
  if(event.data.loch1){
   console.log('The client sent me a message:' , event.data);
  }
  if(event.data.type=='OLD'){
  }else if(event.data.type=='NEW'){
    var expectedCaches1=['static-'+event.data.version];
    var js2='js-'+event.data.version+'.js';
    var man2='manifest-'+event.data.version+'.json.php';
    
<?php    
    if((isset($_SERVER['SCRIPT_URI']) && strpos($_SERVER['SCRIPT_URI'],'localhost')!==false)||(isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'],'localhost')!==false)){
     // on peut par exemple avoir une version décompressée du js en localhost
     echo '    js2=\'js-\'+event.data.version+\'.js\';'."\r\n";
    }
?>    
    // on essaie de charger le cache de la nouvelle version, si un élément ne peut pas être chargé, il ne faut pas
    // envoyer le message au js disant de recharger la page
    try{
     caches.open(expectedCaches1[0]).then(function(cache) {
       var tab1=[        
        protocol1+complementUrl1,
        protocol1+complementUrl1+js2,
        protocol1+complementUrl1+man2,
        protocol1+complementUrl1+'pwademo512x512.png',
        protocol1+complementUrl1+'favicon.ico'
       ];

       cache.addAll(tab1).then(() => {
        if(event.data.loch1){
         console.log('cache added :-), tab1=',tab1);
        }
        try{
         caches.keys().then(function(keyList) {
          if(navigator.onLine){
           keyList.map(function(key){
             if(expectedCaches1[0].indexOf(key) === -1) {
               var retu=caches.delete(key);
             }
           });
          }
         });
         if(navigator.onLine){
          // si tout s'est bien passé, on envoie un message au js pour déclencher un rechargement de page
          event.source.postMessage({type:"CACHE_UPDATED",version:event.data.version,loch1:event.data.loch1});
         }
        }catch(e){
         console.error(e);
        }        
       }).catch(error => console.error('Oops!', error));
     });
    }catch(e){
     console.error('cache not added',e);
    };
  }else{
   event.source.postMessage({type:"Hi client"});
  }
});