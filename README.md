# pwademo ...
... est un petit programme pwa ( progressive web app ) affichant la date, l'heure et deux mois de calendrier

Le programme vérifie toutes les heures si une nouvelle version de pwa est disponnible quand l'utilisateur est en ligne.

Si c'est le cas alors le cache est mis à jour et la page est rechargée.


Pourquoi avoir utilisé cette methode de vérification de version de pwa ? 
Typiquement, pour cette application de calendrier, il suffit d'imaginer qu'elle est ouverte 24h/24 sur l'écran
d'un ordinateur sans aucune action de la part de l'utilisateur.
Si il y a une mise à jour, il n'y a aucun moyen de savoir qu'une nouvelle version est disponible.
C'est donc l'application qui doit vérifier de façon autonome l'existance d'une mise-à-jour.
