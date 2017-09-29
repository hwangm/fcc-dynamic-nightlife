'use strict';

(function () {

   var profileIdT = document.querySelector('#twitter-id') || null;
   var profileUsernameT = document.querySelector('#twitter-username') || null;
   var displayNameT = document.querySelector('#twitter-name'); 
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      if (displayName !== null){
         updateHtmlElement(userObject.google, displayName, 'displayName');
      }
   }));
})();
