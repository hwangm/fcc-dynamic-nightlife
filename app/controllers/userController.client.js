'use strict';

(function () {

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
      if(userObject.twitter){
         if (userObject.twitter.displayName !== null) {
            updateHtmlElement(userObject.twitter, displayNameT, 'displayName');
         } else {
            updateHtmlElement(userObject.twitter, displayNameT, 'username');
         }
   
         if (profileIdT !== null) {
            updateHtmlElement(userObject.twitter, profileIdT, 'id');   
         }
   
         if (profileUsernameT !== null) {
            updateHtmlElement(userObject.twitter, profileUsernameT, 'username');   
         }
      }
      

   }));
})();
