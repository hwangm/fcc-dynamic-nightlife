'use strict';

(function () {

   var profileId = document.querySelector('#google-id') || null;
   var profileUsername = document.querySelector('#google-username') || null;
   var googleName = document.querySelector('#google-name'); 
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
