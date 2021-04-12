//====================================================================================================================================================
//====================================================================================================================================================
// quelques tests initiaux, initailisation de variables et autres bizarreries liées aux différents environnements ( iphone , android, pc ... )
window.requestAnimFrame = (function(){ 
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function( callback ){
          window.setTimeout(callback,1000/60);
         };
})();
var sups1=false;
try{
// create options object with a getter to see if its passive property is accessed
var opts = Object.defineProperty && Object.defineProperty({}, 'passive', { get: function(){ sups1 = true ;}});
// create a throwaway element & event and (synchronously) test out our options
document.addEventListener('test', function() {}, opts);
///// Use our detect's results. passive applied if supported, capture will be false either way.
///// elem.addEventListener('touchstart', fn, sups1 ? { passive: true } : false); 
}catch(e1){}

var iel1=false;
if(sups1===true){ // support passive
 iel1={once:false,passive:true,capture:false}; // in event Listen
}

var glob_body=document.body;
glob_body.style.overflow='hidden';
glob_body.style.touchAction='none';
glob_body.style.msTouchAction='none';

var glob_container=document.getElementById('container');
var glob_description=document.getElementById('description');

//====================================================================================================================================================
//====================================================================================================================================================
// objet principal
function ks4(initObject){
 "use strict"; // très conseillé
// console.error(initObject);
 var loch1=initObject.loch1;
 var softVersion=initObject.version;

 var conf={
  bigSmall : 's'    , // big / small
  modPoLa1 : 'p'    , // portrait / landscape
  w1       : 1      , // largeur
  h1       : 1      , // hauteur
  tbm      : 45     , // taille des boutons
  str1     : ''     , // support Transform
  epbb     : 2        , // epaisseur bordure bouton
  brdBut   : 'plum'   , // couleur   bordure bouton
  sBoB     : 'outset' , // type      bordure bouton
  
  divDt1              : null , // div date
  divHo1              : null , // div heure
  cal0                : null , // div les calendriers
  cal1                : null , // calendrier
  cal2                : null , // calendrier 2
  ver1                : null , // version courante
  
 }
 
 var waitingTimeReload=1000*60*60; // toutes les 1 heures, on va vérifier s'il n'y a pas une nouvelle version
 var waitingTimeVersion=waitingTimeReload-28000; // précédent - 28 secondes car il faut que la version soit vérifiée avant que la page soit rechargée

 var dtStartLoad1=new Date();
 var dts=dtStartLoad1.getTime(); 
 
 if(loch1){ // en localhost
  waitingTimeReload=1000*60*10; // toutes les 10 minutes par exemple en localhost. pour la mise au point, on peut passer à toutes les minutes
  waitingTimeVersion=waitingTimeReload-28000; // précédent - 28 secondes
 }

 var usrAgt=window.navigator.userAgent.toLowerCase();
 
 // pour les vieux android, les fonctions translate sont réduites
 var ftranslt1='translate3d'; 
 var haut3dZ1=',1px'; 
 if(usrAgt.indexOf('android')>=0&&(usrAgt.indexOf('chrome/2')>0)){
  ftranslt1='translate'; haut3dZ1='';
 }
 
 // pour les ipads et les iphones, il y a des conditions spéciales !!!!
 var ipdOuIphn=false;
 var iphn=false;
 var ipad=false;

 if(usrAgt.indexOf('ipad')>=0||usrAgt.indexOf('iphon')>=0){
  ipdOuIphn=true;
  if(usrAgt.indexOf('iphon')>=0){
   iphn=true;
  }
  if(usrAgt.indexOf('ipad')>=0){
   ipad=true;
  }
 }
 var styleFilterSvg=' style="filter: drop-shadow(3px 3px 3px #7c7cff);"';
 if(ipdOuIphn==true){
  styleFilterSvg='';
 }
 //====================================================================================================================================================
 function redim1(){ // si il y a rotation de l'appareil, il faut éventuellement redimentionner les éléments
  glob_container.style.overflow='hidden';
//  glob_container.style.visibility='visible';
  glob_container.style.width='100%';
  glob_container.style.height='100%';
  var ziz1=glob_container.getBoundingClientRect();
  conf.w1=ziz1.width;
  conf.h1=ziz1.height;
  
  glob_container.style.width=conf.w1+'px';
  glob_container.style.height=conf.h1+'px';
  conf.modPoLa1='p';
  if(conf.w1>conf.h1) conf.modPoLa1='l';
  conf.tbm=45;
  conf.bigSmall='s'; // small
  conf.f1=conf.w1*conf.h1;
  if(conf.f1>305000){ // si on a une grand écran, on augmente la taille de la police par défaut ainsi que celle des boutons
   conf.tbm=70;
   conf.bigSmall='b'; // big
   document.body.style.fontSize='18px'; 
  }else{
   document.body.style.fontSize='18px';   
  }
  
  
  divDt1.style.top='0px';
  divDt1.style.height='31px';
  divDt1.style.width='100%';
  
  divHo1.style.top='31px';
  divHo1.style.height='31px';
  divHo1.style.width='100%';
  
  
  conf.cal0.style.top='64px';
  
 }
 
 //=====================================================================================================================
 // on capture les touchs pour qu'il n'y ait aucune action ( version iphone :-\ )
 function noTochi(e){
  try{e.stopPropagation();}catch(e1){}
  try{e.preventDefault();}catch(e1){}
 }
 
 //=====================================================================================================================
 // on capture les touchs pour qu'il n'y ait aucune action ( version autre )
 function noTouch(e){
  if(sups1===false){try{e.preventDefault();}catch(e1){}}
  try{e.stopPropagation();}catch(e1){}
 }
 
 //===============================================================================================================================
 function checkVersion(){
  if(loch1){
   console.log('fnt checkVersion');
  }
  // on va vérifier s'il y a une nouvelle version en exécutant un appel POST au serveur, seulement si on est "online"
  if(navigator.onLine===true){
   var r = new XMLHttpRequest(); // ajax
   r.open("POST",'index.php?chk1',true);
   r.timeout=6000;
   r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
   r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    try{
     var jsonRet=JSON.parse(r.responseText);
     if(jsonRet.status=='OK'){
      if(loch1){
       console.log('jsonRet',jsonRet,'softVersion=',softVersion);
      }
      if(jsonRet.version==softVersion){ // si le version courante de la PWA est égale à la version référencée sur le serveur, on envoie OLD au service worker
       if(navigator.serviceWorker.controller!==null){
        navigator.serviceWorker.controller.postMessage({type: 'OLD' , version : jsonRet.version , loch1 : loch1});
        if(loch1){
         console.log('postMessage OLD to sw');
        }
        setTimeout(checkVersion,waitingTimeVersion);
        return;
       }else{
        if(loch1){
         console.log('navigator.serviceWorker.controller===null');
        }
        setTimeout(checkVersion,waitingTimeVersion);
        return;
       }
      }else{
       if(navigator.serviceWorker.controller!==null){
        try{
         // si le version courante de la PWA est différende de la version référencée sur le serveur, on envoie NEW au service worker
         navigator.serviceWorker.controller.postMessage({type: 'NEW' , version : jsonRet.version , loch1 : loch1});
         if(loch1){
          console.log('postMessage NEW to sw');
         }
        }catch(e){
         console.error(e);
        }
        setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
        return;
       }else{
        if(loch1){
         console.log('navigator.serviceWorker.controller===null');
        }
        setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
        return;
       }
      }
     }else{
 //     console.error(r);
      setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
      return;
     }
    }catch(e){
     setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
 //    console.error(e,r);
     return;
    }
   };
   r.onerror=function(e){
    console.error('e=',e); /* whatever(); */    
    setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
    return;
   }
   r.ontimeout=function(e){
    console.error('e=',e); /* whatever(); */    
    setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
    return;
   }
   var data={
    fonction : 'chk1',
   }
   try{
    r.send('data='+encodeURIComponent(JSON.stringify(data)));
   }catch(e){
    setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
   }
  }else{
   setTimeout(checkVersion,waitingTimeVersion); // on reverifie plus tard
  }   
 }         
 //============================================================================================================================================
 //=========== partie fonctionnelle ( business ) de l'application =============================================================================
 //============================================================================================================================================
 function addDays(date, days) {
   const copy = new Date(Number(date))
   copy.setDate(date.getDate() + days)
   return copy
 } 
 //============================================================================================================================================
 // mise à jour de la date
 function majDate1(){
  var dt1=new Date();
  var jourDeLaSemaine='';
  switch(dt1.getDay()){
   case 0: jourDeLaSemaine='Dimanche'; break;
   case 1: jourDeLaSemaine='Lundi'; break;
   case 2: jourDeLaSemaine='Mardi'; break;
   case 3: jourDeLaSemaine='Mercredi'; break;
   case 4: jourDeLaSemaine='Jeudi'; break;
   case 5: jourDeLaSemaine='Vendredi'; break;
   case 6: jourDeLaSemaine='Samedi'; break;
  }
//  jourDeLaSemaine='Dimanche';
  var moisCourant='';
  switch(dt1.getMonth()){
   case 0 : moisCourant='Janvier'; break;
   case 1 : moisCourant='Février'; break;
   case 2 : moisCourant='Mars'; break;
   case 3 : moisCourant='Avril'; break;
   case 4 : moisCourant='Mai'; break;
   case 5 : moisCourant='Juin'; break;
   case 6 : moisCourant='Juillet'; break;
   case 7 : moisCourant='Août'; break;
   case 8 : moisCourant='Septembre'; break;
   case 9 : moisCourant='Octobre'; break;
   case 10: moisCourant='Novembre'; break;
   case 11: moisCourant='Décembre'; break;
  }
//  moisCourant='Septembre';
  var tt=jourDeLaSemaine+' '+(dt1.getDate()==1?dt1.getDate()+'er':dt1.getDate())+' ' +moisCourant+ ' ';
  conf.divDt1.innerHTML=tt; //+conf.w1+' '+conf.h1;
  
  majCalendriers(); // on met aussi à jour les calendriers
  
  // calcul du nombre de millisecondes entre maintenant et minuit pour savoir quand il il faut relancer cette fonction
  var nbMilisecondesParJour=1000*3600*24;
  var retrancher=1000*(dt1.getHours()*3600+dt1.getMinutes()*60+dt1.getSeconds())+dt1.getMilliseconds();
  var tim1=nbMilisecondesParJour-retrancher;
  tim1+=100; // on est certain que le mise à jour de la date se fera 100 millisecondes apres le changement de date
//  console.log('tim1='+tim1); // 46760173 vers 11h => 46760/3600=12.98 => maj dans 13h OK
  setTimeout(majDate1,tim1);
 }
 //============================================================================================================================================
 function majCalendriers(){
  
  conf.cal0.innerHTML='';
  var dt1=new Date();
  
  var dt2=new Date();
//  var dt2=new Date(2021,2,1); console.log('POUR LES TESTS 2021-04-15'); // attention, mois 0 = janvier
  dt2.setDate(1); // premier jour du mois
  var moisCourant=dt2.getMonth();
  var moisCrtTxt=(moisCourant+1<10?'0'+(moisCourant+1):''+(moisCourant+1));
  var joursASauter=0;
  switch(dt2.getDay()){
   case 0: joursASauter=6; break; // jourDeLaSemaine='Dimanche'; break;
   case 1: joursASauter=0; break; // jourDeLaSemaine='Lundi'; break;
   case 2: joursASauter=1; break; // jourDeLaSemaine='Mardi'; break;
   case 3: joursASauter=2; break; // jourDeLaSemaine='Mercredi'; break;
   case 4: joursASauter=3; break; // jourDeLaSemaine='Jeudi'; break;
   case 5: joursASauter=4; break; // jourDeLaSemaine='Vendredi'; break;
   case 6: joursASauter=5; break; // jourDeLaSemaine='Samedi'; break;
  }
  
  
  conf.cal1=document.createElement('table');
  conf.cal1.style.zIndex=300;
//  conf.cal1.style.borderCollapse='collapse';
  conf.cal1.style.fontSize='1em';
  conf.cal1.style.margin='0 auto';
  conf.cal0.appendChild(conf.cal1);
  var tr1=null;
  var td1=null;
  tr1=document.createElement('tr');
  conf.cal1.appendChild(tr1);
  
  
  for(var i=0;i<7;i++){
   td1=document.createElement('td');
   td1.style.border='1px blue solid';
   td1.style.padding='2px';
   td1.style.lineHeight='1.2em';
   td1.style.width='2.2em';
   td1.style.textAlign='center';
   switch(i){
    case 0: td1.innerHTML='Lun';break;
    case 1: td1.innerHTML='Mar';break;
    case 2: td1.innerHTML='Mer';break;
    case 3: td1.innerHTML='Jeu';break;
    case 4: td1.innerHTML='Ven';break;
    case 5: td1.innerHTML='Sam';td1.style.background='plum';break;
    case 6: td1.innerHTML='Dim';td1.style.background='plum';break;
   }
   tr1.appendChild(td1);
  }
  var goonMois=true;
  var numeroColonne0=0;
  for(var i=0;i<31&&goonMois;i++){
   if(i>0){
    dt2=addDays(dt2,1);
   }
   if(moisCourant==dt2.getMonth()){
//    console.log('courant='+dt2);
    if(i==0){
     tr1=document.createElement('tr');
     conf.cal1.appendChild(tr1);
     for(var j=0;j<joursASauter;j++){
      td1=document.createElement('td');
      td1.style.border='1px blue solid';
      td1.style.lineHeight='1.2em';
      td1.style.width='2.2em';
      td1.style.textAlign='center';
      tr1.appendChild(td1);
      td1.innerHTML='&nbsp;';
      numeroColonne0++;
     }
    }
    if(numeroColonne0==0){
     tr1=document.createElement('tr');
     conf.cal1.appendChild(tr1);
    }
    td1=document.createElement('td');
    td1.style.border='1px blue solid';
    td1.style.lineHeight='1.2em';
    td1.style.width='2.2em';
    td1.style.textAlign='center';
    if(dt1.getDate()==dt2.getDate()){
     td1.style.color='red';
     td1.style.background='yellow';
     td1.style.fontWeight='bold';
     td1.style.borderRadius='7px';
     td1.style.boxShadow='0px 0px 4px blue';
     td1.style.border='1px blue outset';
    }else{
     if(dt2.getDay()==6 || dt2.getDay()==0 ){
      td1.style.background='plum';
     }      
    }
    tr1.appendChild(td1);
    td1.innerHTML=dt2.getDate();
    numeroColonne0++;
    if(numeroColonne0==7){
     numeroColonne0=0;
    }
   }else{
    goonMois=false;
   }
  }
  
  
  
  if(moisCourant==dt2.getMonth()){
   dt2=addDays(dt2,1);
  }
  moisCourant=dt2.getMonth();
  var moisSuivantTxt=(moisCourant+1<10?'0'+(moisCourant+1):''+(moisCourant+1));
  
//  console.log('prochain='+dt2 );
  
  var joursASauter=0;
  switch(dt2.getDay()){
   case 0: joursASauter=6; break; // jourDeLaSemaine='Dimanche' ; break ;
   case 1: joursASauter=0; break; // jourDeLaSemaine='Lundi'    ; break ;
   case 2: joursASauter=1; break; // jourDeLaSemaine='Mardi'    ; break ;
   case 3: joursASauter=2; break; // jourDeLaSemaine='Mercredi' ; break ;
   case 4: joursASauter=3; break; // jourDeLaSemaine='Jeudi'    ; break ;
   case 5: joursASauter=4; break; // jourDeLaSemaine='Vendredi' ; break ;
   case 6: joursASauter=5; break; // jourDeLaSemaine='Samedi'   ; break ;
  }
  
  conf.cal2=document.createElement('table');
  conf.cal2.style.zIndex=300;
//  conf.cal1.style.borderCollapse='collapse';
  conf.cal2.style.fontSize='1em';
  conf.cal2.style.margin='0 auto';
  conf.cal0.appendChild(conf.cal2);
  var tr1=null;
  var td1=null;
  tr1=document.createElement('tr');
  conf.cal2.appendChild(tr1);
  td1=document.createElement('td');
  td1.style.border='1px blue solid';
  td1.style.lineHeight='1.0em';
  td1.style.montSize='0.9em';
  td1.style.textAlign='center';
  td1.colSpan='7';
  tr1.appendChild(td1);
  var moisSuivant='';
  switch(dt2.getMonth()){
   case 0: moisSuivant='Janvier'; break;
   case 1: moisSuivant='Février'; break;
   case 2: moisSuivant='Mars'; break;
   case 3: moisSuivant='Avril'; break;
   case 4: moisSuivant='Mai'; break;
   case 5: moisSuivant='Juin'; break;
   case 6: moisSuivant='Juillet'; break;
   case 7: moisSuivant='Août'; break;
   case 8: moisSuivant='Septembre'; break;
   case 9: moisSuivant='Octobre'; break;
   case 10: moisSuivant='Novembre'; break;
   case 11: moisSuivant='Décembre'; break;
  }
  
  
  td1.innerHTML='mois prochain : '+moisSuivant+' ' +dt2.getFullYear();
  
  tr1=document.createElement('tr');
  conf.cal2.appendChild(tr1);
  var goonMois=true;
  var numeroColonne0=0;
  for(var i=0;i<31&&goonMois;i++){
   if(i>0){
    dt2=addDays(dt2,1);
   }
   if(moisCourant==dt2.getMonth()){
    if(i==0){
     tr1=document.createElement('tr');
     conf.cal2.appendChild(tr1);
     for(var j=0;j<joursASauter;j++){
      td1=document.createElement('td');
      td1.style.border='0px blue solid';
      td1.style.lineHeight='1.2em';
      td1.style.width='2.2em';
      td1.style.textAlign='center';
      tr1.appendChild(td1);
      td1.innerHTML='&nbsp;';
      numeroColonne0++;
     }
    }
    if(numeroColonne0==0){
     tr1=document.createElement('tr');
     conf.cal2.appendChild(tr1);
    }
    td1=document.createElement('td');
    td1.style.border='1px blue solid';
    td1.style.lineHeight='1.2em';
    td1.style.width='2.2em';
    td1.style.textAlign='center';
    if(dt2.getDay()==6 || dt2.getDay()==0 ){
     td1.style.background='plum';
    }      
    
    tr1.appendChild(td1);
    td1.innerHTML=dt2.getDate();
    numeroColonne0++;
    if(numeroColonne0==7){
     numeroColonne0=0;
    }
   }else{
    goonMois=false;
   }
  }  
 }
 //============================================================================================================================================
 // mise à jour des heures:minutes toutes les minutes
 function majHeure1(){
  var dt1=new Date();

  var tt='';
  tt+=dt1.getHours()+'h';
  tt+=(dt1.getMinutes()<10?'0'+dt1.getMinutes():dt1.getMinutes());
  conf.divHo1.innerHTML=tt; //+conf.w1+' '+conf.h1;
 
  // calcul du nombre de millisecondes entre maintenant et la prochaine minute pour savoir quand il il faut relancer cette fonction

  var nbMilisecondesParMinutes=1000*60;
  var retrancher=1000*dt1.getSeconds()+dt1.getMilliseconds();
  var tim1=nbMilisecondesParMinutes-retrancher;
  tim1+=20; // on est certain que le mise à jour de l'heure se fera 20 millisecondes apres le changement de minutes
//  console.log('tim1='+tim1); // 
  setTimeout(majHeure1,tim1);
 }
 
 //============================================================================================================================================
 // initialisation de l'environnement. cette fonction n'est appelée qu'une seule fois
 function init(){
  // initialisation de l'environnement de travail
  glob_container.style.width='100%';
  glob_container.style.height='100%';
  glob_container.style.border='0px red solid';
  glob_container.style.left=0;
  glob_container.style.top=0;
  glob_container.style.position='absolute';
  glob_container.style.backgroundColor='#fbfbfb';
  glob_container.innerHTML='';
  glob_container.style.outline='none';
  glob_container.style.WebkitTapHighlightColor='transparent';
  glob_container.style.userSelect='none';
  glob_container.style.touchAction='none';
  
  if(true==ipdOuIphn){
   glob_container.addEventListener('touchstart'  , noTochi, false );
   glob_container.addEventListener('touchcancel' , noTochi, false );
  }else{
   glob_container.addEventListener('touchstart' , noTouch, iel1 );
   glob_container.addEventListener('mousedown'  , noTouch, iel1 );
  }
  
  var prefixes=['transform','WebkitTransform','MozTransform','OTransform','msTransform'];
  var div = document.createElement('div');
  for(var i=0;i<prefixes.length;i++) {
   if(div && div.style[prefixes[i]]!==undefined){
    conf.str1=prefixes[i];
    break;
   }
  }
  if(usrAgt.indexOf('msie 9')>0){ // finalement, ie 9 n'aime pas les transform !!!
   conf.str1='';
  }
  
  
  var dt1=new Date();
  var ts1=dt1.getTime()+1;
  
  
  conf.divDt1=document.createElement('div');
  conf.divDt1.style.zIndex=300;
  conf.divDt1.style.position='absolute';
  conf.divDt1.id='divDt1';
//  conf.divDt1.style.backgroundColor='rgb(225, 255, 255)';
  conf.divDt1.style.background='linear-gradient(rgb(225, 255, 255), rgb(177, 216, 245))';
  conf.divDt1.style.opacity=1;
  conf.divDt1.style.fontSize='1.8em';
  conf.divDt1.style.width='100%';
  conf.divDt1.style.padding='0px';
  conf.divDt1.style.textAlign='center';
  conf.divDt1.style.whiteSpace='nowrap';
  conf.divDt1.style.lineHeight='1em';
  glob_container.appendChild(conf.divDt1);


  conf.divHo1=document.createElement('div');
  conf.divHo1.style.zIndex=300;
  conf.divHo1.style.position='absolute';
  conf.divHo1.id='divHo1';
//  conf.divHo1.style.backgroundColor='rgb(225, 255, 255)';
  conf.divHo1.style.background='linear-gradient(rgb(225, 255, 255), rgb(177, 216, 245))';
  conf.divHo1.style.opacity=1;
  conf.divHo1.style.fontSize='1.8em';
  conf.divHo1.style.width='100%';
  conf.divHo1.style.padding='0px';
  conf.divHo1.style.textAlign='center';
  conf.divHo1.style.whiteSpace='nowrap';
  conf.divHo1.style.lineHeight='1em';
  glob_container.appendChild(conf.divHo1);



  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
  
  conf.cal0=document.createElement('div');
  conf.cal0.id='cal0';
  conf.cal0.style.top='64px';
  conf.cal0.style.position='absolute';
  conf.cal0.style.width='100%';
  glob_container.appendChild(conf.cal0);
  
  conf.ver1=document.createElement('div');
  conf.ver1.style.backgroundColor='transparent';
  conf.ver1.style.position='absolute';
  conf.ver1.style.bottom='0px';
  conf.ver1.style.right='0px';
  conf.ver1.style.height='1em';
  conf.ver1.style.fontSize='0.5em';
  conf.ver1.style.color='#888';
  conf.ver1.title=softVersion;
  var now1=new Date();
  
  conf.ver1.innerHTML=softVersion.substr(2)+'-'+now1.getDate()+'d'+now1.getHours()+'h'+now1.getMinutes();
  glob_container.appendChild(conf.ver1);

  redim1();
  majDate1();
  majHeure1();
  setTimeout(checkVersion,10000); // on attend 10 secondes avant de faire la première vérification de la version car
                                  // il faut un peu de temps pour que l'event install dans le sw soit appelé et on commence par faire un claim()
 }
 //============================================================================================================================================
 //============================================================================================================================================
 //============================================================================================================================================

 window.addEventListener('resize', function(){
  glob_container.style.overflow='hidden';
  setTimeout(redim1,100);
 }, false);
 
 //============================================================================================================================================
 
 init();
 
 //============================================================================================================================================
 return {
  hello     : function(){return _hello();},
  nop       : function(){/*nothing to do*/}
 }; 
}
window.addEventListener('load',function(){glob1=new ks4(init1);});
var swChain='/sw-'+init1.version+'.js.php';
if(init1.loch1){
 swChain='/pwademo/sw-'+init1.version+'.js.php';
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.register(swChain).then(function(reg){
  // message reçu du service worker
  navigator.serviceWorker.addEventListener('message', event => {
    if(event.data.loch1){
     console.log('\n\n===================\nevent received from sw\nevent=',event,'\n\nevent.data=',event.data,'\n=============\n');
    }
    // si on reçoit un message "CACHE_UPDATED" provenant du sw , il faut recharger la page
    if('CACHE_UPDATED'===event.data.type){
     swChain='/sw-'+event.data.version+'.js.php';
     if(event.data.loch1){
      swChain='/pwademo/sw-'+init1.version+'.js.php';
     }
     try{
      navigator.serviceWorker.register(swChain).then(function(reg){
       setTimeout(
        function(){
         if(event.data.loch1){
          console.log('Reload page');
         }
         document.location=String(document.location);
        },
        1000
       );
      });
      
     }catch(e){
      console.error(e)
     }
     navigator.serviceWorker.register(swChain)
    }
  });

  navigator.serviceWorker.ready.then( registration => {
//    registration.active.postMessage("Hi service worker");
  });  
 }).catch(function(error){
 });
};
