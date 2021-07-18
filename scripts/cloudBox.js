var cloudBox = (function() {
    var PZQ = "936055039321-js5svf8q8f6tn7tvb6sa5fcu4iea7kg7.apps.googleusercontent.com";
    var QWT = "AIzaSyBhT9jHbwPFEBYowrafuYD3_rM6UN1Nk_Y";
    var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];
    var SCOPES = "https://www.googleapis.com/auth/drive.file";
    var authorizeButton, signoutButton;
	var bCloudModeIsActive = false;
    function initClient() {
        gapi.client.init({
            apiKey: QWT,
            clientId: PZQ,
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
        setCloudMode(isSignedIn);
    }

    function handleAuthClick(event) {
        appManager.setBusy(true);
        var x = gapi.auth2.getAuthInstance().signIn().then(function() {
            setCloudMode(true);
            appManager.setBusy(false);
        });
        console.log("auth click");
    }
    function handleSignoutClick(event) {
        appManager.setBusy(true);
        gapi.auth2.getAuthInstance().signOut().then(function() {
            setCloudMode(false);
            appManager.setBusy(false);
        });
        console.log("sign out");
    }

    function setCloudMode(bLoggedIn) {
        if (bLoggedIn) {
			bCloudModeIsActive = true;
            var oData = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();	
            appManager.setCloudMode(true,{
                name: oData.getGivenName() + " " + oData.getFamilyName(),
                email: oData.getEmail(),
                img: oData.getImageUrl()
            });

        } else {
			bCloudModeIsActive = false;
            appManager.setCloudMode(false);
        }
    }

    var driveItems = {};
    return {
        init: function(oConfig) {
			this._addGlobalListeners();
            authorizeButton = document.getElementById('authorize_button');
            signoutButton = document.getElementById('signout_button');
			

        },
        onClientLoad: function() {
            gapi.load('client:auth2', initClient);
            this._attachEvents();
        },
        _segregateFilesAndFolders: function(oItems) {
			driveItems = {
				folder: [],
				file: []
			}
            oItems.forEach(function(o) {
                if (!o.explicitlyTrashed) {
                    // ignore if deleted
                    if (o.mimeType == "application/vnd.google-apps.folder") {
                        driveItems.folder.push(o);
                    } else {
                        driveItems.file.push(o);
                    }
                }
            });
        },
        _fetchItemsFromCloud: function(fnS) {
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
        _getItem: function(sType, fnS, bForceFetch) {
            var that = this;
            if (sType == "file" || sType == "folder") {
                if (!bForceFetch && driveItems[sType]) {
                    fnS(driveItems[sType]);
                } else {
                    this._fetchItemsFromCloud(function(aItem) {
                        that._segregateFilesAndFolders(aItem);
                        fnS(driveItems[sType]);
                    });
                }

            }

        },
		_updateFileTitleInCache: function(sId, sTitle){
			var files = driveItems.file || [];
			for(var i = 0; i < files.length; i++){
				if(files[i].id == sId){
					files[i].title = sTitle;
					break;
				}
			}
		},
        getFolders: function(fnS) {
            fnS = fnS || function() {};
            this._getItem("folder", fnS);
        },
        getFiles: function(fnS, bForceFetch) {
            fnS = fnS || function() {};
            this._getItem("file", fnS, bForceFetch);
        },
        getFolder: function(sId) {},
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
                oFileData = oFileData || [];
                fnS(oFileData);
            });
        },
        loadFile: function(sId, fnS) {
            this.getFile(sId, function(o) {
				var oData = o[0];
				oData.id =sId;
				appManager.setFileId(sId);
                appManager._ioManager.saveToBackUp(oData);
				appManager.setData(oData, true);
                fnS();
            });
        },
        getUserProfile: function(fnS) {
            try {
                var oData = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                fnS({
                    name: oData.getGivenName() + " " + oData.getFamilyName(),
                    email: oData.getEmail(),
                    img: oData.getImageUrl()
                });
            } catch (e) {
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
        createFile: function(aData, fnS) {
            appManager.setBusy(true);
            var that = this;
            this.getFolders(function(aFolder) {
                if (aFolder.length) {
                    that._createFile(aFolder[0].id, aData, function(o) {
                        appManager.setBusy(false);
                        fnS(o);
                    });
                } else {
                    that.createFolder(function(oResp) {
                        that._createFile(oResp.id, aData, function(o) {
                            appManager.setBusy(false);
                            fnS(o);
                        });
                    });
                }
            });
        },
		updateFile: function(sId, aData, fnS, fnE){
			var boundary = 'foo_bar_baz'
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";
            var fileData = JSON.stringify(aData);
            var contentType = 'text/plain';
            var metadata = {
                'name': appManager.getFileName() + ".ijson",
				'title' : appManager.getFileName() + ".ijson",
                'mimeType': contentType
            };

            var multipartRequestBody = delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + fileData + '\r\n' + close_delim;
            var request = window.gapi.client.request({
                'path': 'https://www.googleapis.com/upload/drive/v2/files/' + sId,
                //  'id': '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
                'method': 'PUT',
				'params': {
                    'uploadType': 'multipart'
                },
                'headers': {
                    'Content-Type': 'multipart/related; boundary=' + boundary + ''
                },
                'body': multipartRequestBody
            });

            request.execute(function(o) {
				if(o.error){
					fnE("File could not be updated.<br>" + o.error.message);
				} else {
					fnS(o);					
				}
            });			
		},
        _createFile: function(sFolderId, aData, fnS, fnE) {
            var boundary = 'foo_bar_baz'
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";
            var fileData = JSON.stringify(aData);
            var contentType = 'text/plain';
            var metadata = {
                'name': appManager.getFileName() + ".ijson",
                'mimeType': contentType,
                'parents': [sFolderId]
            };

            var multipartRequestBody = delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + fileData + '\r\n' + close_delim;
            var request = window.gapi.client.request({
                'path': 'https://www.googleapis.com/upload/drive/v3/files',
                //  'id': '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
                'method': 'POST',
                'params': {
                    'uploadType': 'multipart'
                },
                'headers': {
                    'Content-Type': 'multipart/related; boundary=' + boundary + ''
                },
                'body': multipartRequestBody
            });

            request.execute(function(o) {
				if(o.error){
					fnE("File could not be created.<br>" + o.error.message);
				} else {
					fnS(o);					
				}
            });
        },
		save: function(bSuppressBusy){
			var that = this;
			var oData = appManager.getDataToSave();
			var aData = [oData];
			if(bCloudModeIsActive){
				var fileId = appManager.getFileId();
				appManager.setBusy(!bSuppressBusy);
				if(fileId){
					this.updateFile(fileId, aData, function(){
						appManager.setBusy(false);
						if(!bSuppressBusy){
							appManager.showSuccess("File has been updated");
						}
						that._updateFileTitleInCache(fileId, appManager.getFileName());
						that.refreshFiles();

					}, function(e){
						appManager.setBusy(false);
						appManager.showFailure(e);
					});					
				} else {
					this.createFile(aData, function(o){
						appManager.setBusy(false);
						if(!bSuppressBusy){
							appManager.showSuccess("File has been successfully created");
						}
						appManager.setFileId(o.id);
						appManager.fireEvent("dataChange");
						that.refreshFiles(true);
					}, function(e){
						appManager.setBusy(false);
						appManager.showFailure(e);
					});
				}				
			}
		},
        _fetchFileHtml: function(aFile) {
            var html = "";
            aFile.forEach(function(oFile, i) {
                html += ("<div class='cloudBoxFileItem' data-fileId='" + oFile.id + "'>" + "<div class='cloudBoxFileItemName'>" + oFile.title.replace(".ijson", "") + "</div>" + "<div class='cloudBoxFileItemDate'>Last Modified - " + (new Date(oFile.modifiedDate)).toLocaleString() + "</div>" + "</div>");
            });
            return html;
        },
		refreshFiles: function(bForceFetch){
			var that = this;
			appManager.setBusy(true);
            this.getFiles(function(aFile) {
                appManager.setBusy(false);
                jQuery("#cloudBox").find(".cloudBoxContainer").html(that._fetchFileHtml(aFile));
            }, bForceFetch);			
		},
		open: function(){
            jQuery("#cloudBox").show();
			this.getCore().fireEvent("dialogOpen", {
				id: "cloudBox",
				closeHandler: this.close.bind(this)
			});
			this.refreshFiles();
		},
		close: function(bSuppressEvent){
            jQuery("#cloudBox").hide();
			if(!bSuppressEvent){
				this.getCore().fireEvent("dialogClose", {
					id: "cloudBox"
				});				
			}
		},
        _attachEvents: function() {
            var that = this;
            jQuery("#cloudBox").on("click", ".cloudBoxFileItem", function() {
				that.close();
				appManager.setBusy(true);
                var fileId = this.attributes["data-fileId"].value;
                that.loadFile(fileId, function() {
					appManager.setBusy(false);
                });
            });
		    jQuery("#closeCloudBox").click(function(){
			  that.close();
			});
        },
		_addGlobalListeners: function(fDataGetter){
			var that = this;
			this.getCore().listenTo("dataChange", function(oParam){
				if(!oParam ||(oParam && !oParam.suppressBackup)){
					console.log("cloudbox save");
					that.save(true);
				}
			});
		},
		getCore: function(){
			return appManager;
		}
    };
}
)();
