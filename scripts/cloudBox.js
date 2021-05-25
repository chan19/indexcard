var cloudBox = (function() {
			    var CLIENT_ID = "936055039321-js5svf8q8f6tn7tvb6sa5fcu4iea7kg7.apps.googleusercontent.com";
                var API_KEY = "AIzaSyBhT9jHbwPFEBYowrafuYD3_rM6UN1Nk_Y";
                var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];
                var SCOPES = "https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/drive.appdata";
				var authorizeButton, signoutButton ;             
                function initClient() {
                    gapi.client.init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES
                    }).then(function() {
                        // Listen for sign-in state changes.
                        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                        // Handle the initial sign-in state.
                        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                        authorizeButton.onclick = handleAuthClick;
                        signoutButton.onclick = handleSignoutClick;
                    });
                }

                function updateSigninStatus(isSignedIn) {
                    if (isSignedIn) {
                        authorizeButton.style.display = 'none';
                        signoutButton.style.display = 'block';
                        // write code to fetch files;
                    } else {
                        authorizeButton.style.display = 'block';
                        signoutButton.style.display = 'none';
                    }
                }

                function handleAuthClick(event) {
                    gapi.auth2.getAuthInstance().signIn();
                }
                function handleSignoutClick(event) {
                    gapi.auth2.getAuthInstance().signOut();
                }

    return {
		init: function(oConfig){
              authorizeButton = document.getElementById('authorize_button');
              signoutButton = document.getElementById('signout_button');				
				
		},
		onClientLoad: function(){
			 gapi.load('client:auth2', initClient);
		},
        getFolders: function() {
        },
        getFiles: function() {
            var request = gapi.client.request({
                'path': '/drive/v2/files/',
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': {}
            });

            request.execute(function(resp) {
                debugger ;
            });

        },
        getFolder: function(sId) {
        },
        getFile: function(sId) {
        },
        createFolder: function() {

            var request = gapi.client.request({
                'path': '/drive/v2/files/',
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': {
                    "title": "inkext",
                    "mimeType": "application/vnd.google-apps.folder",
                }
            });

            request.execute(function(resp) {
                console.log(resp);
            });

        },
        createFile: function(sFileName, oData, sFolderId) {

            var boundary = 'foo_bar_baz'
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";
            var fileName = 'warrior4.ijson';
            var fileData = "[" + localStorage.backup + "]";
            var contentType = 'text/plain';
            var metadata = {
                'name': sFileName,
                'mimeType': contentType,
                'parents': sFolderId || ["1eJJJgPhWc9OAnkLwoJPMspVT_YXTsqVE"]
            };

            var multipartRequestBody = delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + fileData + '\r\n' + close_delim;
            var request = window.gapi.client.request({
                'path': 'https://www.googleapis.com/upload/drive/v3/files',
                'id': '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
                'method': 'POST',
                'params': {
                    'uploadType': 'multipart'
                },
                'headers': {
                    'Content-Type': 'multipart/related; boundary=' + boundary + ''
                },
                'body': multipartRequestBody
            });

            request.execute(function(file) {
                console.log(file)
            });
        }

    };
}
)();
