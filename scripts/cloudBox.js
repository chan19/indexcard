var cloudBox = (function() {
	var CLIENT_ID = "936055039321-js5svf8q8f6tn7tvb6sa5fcu4iea7kg7.apps.googleusercontent.com";
	var API_KEY = "AIzaSyBhT9jHbwPFEBYowrafuYD3_rM6UN1Nk_Y";
	var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];
	var SCOPES = "https://www.googleapis.com/auth/drive.file";
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
		refreshUserInfo(isSignedIn);
	}

	function handleAuthClick(event) {
		appManager.setBusy(true);
		var x = gapi.auth2.getAuthInstance().signIn().then(function(){
			refreshUserInfo(true);
			appManager.setBusy(false);
		});
		console.log("auth click");
	}
	function handleSignoutClick(event) {
		appManager.setBusy(true);
		gapi.auth2.getAuthInstance().signOut().then(function(){
			refreshUserInfo(false);
			appManager.setBusy(false);
		});
		console.log("sign out");
	}
	
	function refreshUserInfo(bLoggedIn){
			if(bLoggedIn){
				var oData = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
				appManager.refreshUserInfo({
						name: oData.getGivenName() + " " + oData.getFamilyName(),
						email: oData.getEmail(),
						img: oData.getImageUrl()
				});
				
			} else {
				appManager.refreshUserInfo({
					name: "Guest User",
					email: "",
					img: "icons/user.png"
				});
				
			}
	}
	
	var driveItems = {};
    return {
		init: function(oConfig){
              authorizeButton = document.getElementById('authorize_button');
              signoutButton = document.getElementById('signout_button');				
				
		},
		onClientLoad: function(){
			 gapi.load('client:auth2', initClient);
		},
		_segregateFilesAndFolders: function(oItems){
			driveItems.folder = driveItems.folder || [];
			driveItems.file = driveItems.file || [];
			oItems.forEach(function(o){
				if(!o.explicitlyTrashed){ // ignore if deleted
					if(o.mimeType == "application/vnd.google-apps.folder"){
						driveItems.folder.push(o);
					} else {
						driveItems.file.push(o);
					}					
				}
			});
		},
		_fetchItemsFromCloud: function(fnS){
			var request = gapi.client.request({
                'path': '/drive/v2/files/',
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': {}
            });

            request.execute(function(resp) {
                fnS(resp.items);
            });
		},
        _getItem: function(sType, fnS) {
			var that = this;
			if(sType == "file" || sType == "folder"){
				if(driveItems[sType]){
					fnS(driveItems[sType]);
				} else {
					this._fetchItemsFromCloud(function(aItem){
						that._segregateFilesAndFolders(aItem);
						fnS(driveItems[sType]);
					});
				}
				
			}

        },
		getFolders: function(fnS) {
			fnS = fnS || function(){};
			this._getItem("folder", fnS);
        },
		getFiles: function(fnS){
			fnS = fnS || function(){};
			this._getItem("file", fnS);
		},
        getFolder: function(sId) {
        },
        getFile: function(sId, fnS) {
			var request = gapi.client.request({
                'path': '/drive/v2/files/' + sId + "?alt=media",
                'method': 'get',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': {}
            });

            request.execute(function(oFileData) {
                fnS(oFileData);
            });
        },
		getUserProfile: function(fnS){
			try{
				var oData = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
				fnS({
					name: oData.getGivenName() + " " + oData.getFamilyName(),
					email: oData.getEmail(),
					img: oData.getImageUrl()
				});
			} catch(e){
				fnS({
					name: "Guest User",
					email: "",
					img: "icons/user.png"
				});
			}
		},
        createFolder: function(fnS) {
			driveItems.folder = driveItems.folder || [];
			driveItems.file = driveItems.file || [];
            var request = gapi.client.request({
                'path': '/drive/v2/files/',
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': {
                    "title": "Inkext app data",
                    "mimeType": "application/vnd.google-apps.folder",
                }
            });

            request.execute(function(resp) {
					driveItems.folder.push(resp);
					fnS(resp);
					//resp.id  is folder id;
            });

        },
		creatFile: function(oData){
			appManager.setBusy(true);
			var that = this;
			this.getFolders(function(aFolder){
				if(aFolder.length){
					that._createFile(oData, aFolder[0].id, function(){
						appManager.setBusy(false);
					});
				} else {
					that.createFolder(function(oResp){
						that._createFile(oData, oResp.id, function(){
							appManager.setBusy(false);
						});
					});
				}
			});
		},
        _createFile: function(oData, sFolderId, fnS) {

            var boundary = 'foo_bar_baz'
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";
            var fileName = 'warrior4.ijson';
            var fileData = JSON.stringify([appManager.getDataToSave()]);
            var contentType = 'text/plain';
            var metadata = {
                'name': appManager.getFileName()+".ijson",
                'mimeType': contentType,
                'parents': [sFolderId] || ["1eJJJgPhWc9OAnkLwoJPMspVT_YXTsqVE"]
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
                fnS();
            });
        }

    };
}
)();
