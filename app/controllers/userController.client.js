'use strict';

(function () {

   var profileIdG = document.querySelector('#github-id') || null;
   var profileUsernameG = document.querySelector('#github-username') || null;
   var profileReposG = document.querySelector('#github-repos') || null;
   var displayNameG = document.querySelector('#github-name');
   var profileIdT = document.querySelector('#twitter-id') || null;
   var profileUsernameT = document.querySelector('#twitter-username') || null;
   var displayNameT = document.querySelector('#twitter-name'); 
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      console.log(data);
      if(userObject.github){
         if (userObject.github.displayName !== null) {
            updateHtmlElement(userObject.github, displayNameG, 'displayName');
         } else {
            updateHtmlElement(userObject.github, displayNameG, 'username');
         }
   
         if (profileIdG !== null) {
            updateHtmlElement(userObject.github, profileIdG, 'id');   
         }
   
         if (profileUsernameG !== null) {
            updateHtmlElement(userObject.github, profileUsernameG, 'username');   
         }
   
         if (profileReposG !== null) {
            updateHtmlElement(userObject.github, profileReposG, 'publicRepos');   
         }
      }
      if(userObject.twitter){
         if (userObject.twitter.displayName !== null) {
            updateHtmlElement(userObject.twitter, displayNameT, 'displayName');
         } else {
            updateHtmlElement(userObject.twitter, displayNameT, 'username');
         }
   
         if (profileIdT !== null) {
            updateHtmlElement(userObject.twitter, profileIdG, 'id');   
         }
   
         if (profileUsernameT !== null) {
            updateHtmlElement(userObject.twitter, profileUsernameT, 'username');   
         }
      }
      

   }));
})();
