        const boundary='foo_bar_baz'
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        var fileName='warrior4.ijson';
        var fileData="["+localStorage.backup+"]";
        var contentType='text/plain'
        var metadata = {
          'name': fileName,
          'mimeType': contentType,
		  'parents': ["1eJJJgPhWc9OAnkLwoJPMspVT_YXTsqVE"]
        };

        var multipartRequestBody =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n\r\n' +
          fileData+'\r\n'+
          close_delim;

          console.log(multipartRequestBody);
          var request = window.gapi.client.request({
            'path': 'https://www.googleapis.com/upload/drive/v3/files',
            'id': '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/related; boundary=' + boundary + ''
            },
            'body': multipartRequestBody});
        request.execute(function(file) {
          console.log(file)
        });
		
		
		
		
		
	// to create folder.	
		
var request = gapi.client.request({
       'path': '/drive/v2/files/',
       'method': 'POST',
       'headers': {
           'Content-Type': 'application/json'        
       },
       'body':{
           "title" : "inkext",
           "mimeType" : "application/vnd.google-apps.folder",
       }
   });

   request.execute(function(resp) { 
       console.log(resp);
   });
   
   // get list of all files
      var request = gapi.client.request({
       'path': '/drive/v2/files/',
       'method': 'get',
       'headers': {
           'Content-Type': 'application/json'        
       },
       'body':{
       }
   });

   request.execute(function(resp) { 
   debugger;
   });
   
   
   
   
   
		/// google info
		
		function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
      }
		jQuery("body").append('<div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>');
s= '<meta name="google-signin-scope" content="profile email"><meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com"><script src="https://apis.google.com/js/platform.js" async defer></script>';
jQuery("head").append(s);