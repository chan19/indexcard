appManager = (function(){
	var oConfig = {};
	oConfig.beat= [ {
						"key": -1,
						"value": "NONE"
		
					}, {"key": "BEAT0",
						"value": "Opening"
					}, {
						"key": "BEAT1",
						"value": "Introduce Protag"
					}, {
						"key": "BEAT2",
						"value": "Introduce Antag"
					}, {
						"key": "BEAT3",
						"value": "Introduce Stakes"
					}, {
						"key": "BEAT4",
						"value": "Inciting incident"
					}, {
						"key": "BEAT5",
						"value": "Call to hero"
					}, {
						"key": "BEAT6",
						"value": "Second Act"
					}, {
						"key": "BEAT7",
						"value": "Plot B"
					}, {
						"key": "BEAT8",
						"value": "New Characters"
					}, {
						"key": "BEAT9",
						"value": "Mid Point"
					}, {
						"key": "BEAT10",
						"value": "Low point"
					}, {
						"key": "BEAT11",
						"value": "Climax"
					}, {
						"key": "BEAT12",
						"value": "Beginning of the End"
					}, {
						"key": "BEAT13",
						"value": "Finale"
					}];

	
	
	return {
		init: function(oData){
			var that = this;
			this._version = 1;
			this.initDevice();
			this._initIoManager();
			this._initBeat();
			this._initOverview();
			this._initTagPopup();
			this._initCardManager();
			this._attachEvents();
			this._attachListeners();
			this.setInitialData();
			setInterval(this.refreshLastSavedTime.bind(this), 60000);
		},
		_data: {},
		_eventListeners: {},
		setInitialData: function(){
			var oBackupData = this._ioManager.readFromBackup();
			if(oBackupData == null){
				this.createNewFile();
			} else {
				var oData = this._getProcessedData(oBackupData);
				this.setData(oData, true);
			}
		},
		initDevice: function(){
			this.setIsTouchDevice(navigator.maxTouchPoints > 0 ? true : false);
		},
		setIsTouchDevice: function(bIsTouch){
			this._isTouchDevice = bIsTouch;
			jQuery("body").addClass(bIsTouch? "touchDevice" : "nonTouchDevice");
			return this;
		},
		getIsTouchDevice: function(){
			return this._isTouchDevice;
		},
		_initIoManager: function(){
			var that = this;
			this._ioManager = new IoManager({
				read: {
					id: "openFileTrigger",
					pseudo: "openFile",
					onRead: function(oData){
						that.setData(oData, true);
					}
				},
				write: {
					id: "saveFileTrigger",
					onWrite: function(){
						console.log("filesaved");
					},
					dataGetter: this.getDataToSave.bind(this)
				}
			});
			
		},
		getConfig: function(s){
			return oConfig[s];
		},
		_initOverview: function(){
			this._overviewManager = new Overview("overViewContainer");
		},
		_initBeat: function(){
			this.beat = new Beat(oConfig.beat);
			jQuery("#testArea").append(this.beat.getNode());
		},
		_initTagPopup: function(aTag){
			this.tagPopup = new TagPopup({
				tags: aTag
			});
			this.tagPopup.render("testArea");
		},
		_initCardManager: function(){
			this.cardManager = new CardManager();
			/*if(aCard && aCard.length){
				this.cardManager.setCardData(aCard);
			} else{
				this.cardManager.addNewCard(0);
			}*/
			return this;
		},
		_getProcessedData: function(oData){
			oData = oData || {};
			return {
				time: oData.time || Date.now(),
				version: oData.version || 1,
				cards: oData.cards || [],
				fileName: oData.fileName || "Untitled file",
				id: oData.id || "",
				tags: oData.tags || []
			}
		},
		setLastSavedTime: function(iTime){
			this._time = iTime || Date.now();
			this.refreshLastSavedTime(this._time);
			return this._time;
		},
		getLastSavedTime: function(){
			return this._time || Date.now();
		},
		refreshLastSavedTime: function (){
			//x is current time, y is saved time;
			var lastSavedTime = this.getLastSavedTime();
			var d = Date.now() - lastSavedTime;
			var oLastSaved = new Date(lastSavedTime);
			var s = "";
			var t = "";
			if(d < 10000) {
				s = "now";
			} else if(d < 60000){
				t = Math.floor(d/1000);
				s = t + "seconds ago";
			} else if(d < 3600000){
				t = Math.floor(d/60000);
				s = (t == 1) ? "a minute ago" : t + " minutes ago";
			} else if(d < 86400000){
				t = Math.floor(d/3600000);
				s = (t == 1) ? "a hour ago" : t + " hours ago";
			} else if(d < 2592000000){
				t = Math.floor(d/86400000);
				s = (t == 1) ? "a day ago" : t + " days ago";
			} else if(d < 31104000000){
				t = Math.floor(d/2592000000);
				s = (t == 1) ? "a month ago" : t + " months ago";
			} else {
				t = Math.floor(d/31104000000);
				s = (t == 1) ? "a year ago" : t +  "years ago";
			}
			jQuery("#time .value").html(s);
			jQuery("#time .detailedValue").html(oLastSaved.toDateString() + " " + oLastSaved.toLocaleTimeString());
		},
		getVersion: function(){
			return this._version || 0;
		},
		setVersion: function(iVersion){
			this._version = iVersion || ++this._version;
			jQuery("#version .value").html(this._version);
			return this._version;
		},
		setTotalTargetPageCount: function(n){
			if(Number(n) > 1){
				jQuery("#pageCount .value").html(n + " pages");
			} else {
				jQuery("#pageCount .value").html(n + " page");
			}
			
		},
		setFileName: function(sVal, bRender){
			this._fileName = sVal || "Untitled File";
			if(bRender){
				jQuery("#fileName").html(this._fileName);
			}
			return this._fileName;
		},
		getFileName: function(){
			return this._fileName;
			
		},
		setFileId: function(sId){
			this._fileId = sId;
		},
		getFileId: function(){
			return this._fileId;
		},
		setData: function(oData, bSuppressBackup){
			this.tagPopup.setAllTags(oData.tags);
			this.setLastSavedTime(oData.time);
			this.setVersion(oData.version);
			this.setFileName(oData.fileName, true);
			this.setFileId(oData.id);
			this.cardManager.setCardData(oData.cards);
			this.fireEvent("dataChange", { beats: oData.beats, tags: oData.tags, suppressBackup: bSuppressBackup});
		},
		_isCloudMode: false,
		setCloudMode: function(bOn, oUserInfo){
			this._isCloudMode = bOn;
			if(oUserInfo){
				this.updateUserInfo(oUserInfo);
				this.loadLatestFileFromCloud();
			} else{
				this.updateUserInfo({
				    name: "Guest User",
				    email: "",
				    img: "icons/user.png"
				});			
			}
			;
			
			// remove this later
			if(!!window.location.search == false){
				this._isCloudMode = false;
			}
		},
		getCloudMode: function(){
			return this._isCloudMode;
		},
		updateUserInfo: function(o){
				jQuery("#user").css("background-image","url("+o.img+ ")");
				jQuery("#userInfoPane .userName").html(o.name);
				jQuery("#userInfoPane .userInfoBody").html(o.email);
				jQuery("#userInfoPane").hide();
		},
		onFileFetch: function(oData){
				this.setData(oData, true);
		},
		createNewFile: function(){
			var data = this._getProcessedData({});
			this.setData(data, true);
			this.openFileTitleDialog();
		},
		getDataToSave:function(){
			var aData = this.getCurrentData();
			aData.time = this.setLastSavedTime();
			aData.version = this.setVersion();
			return aData;
		},
		getCurrentData: function(){
			var aCards = this.cardManager.getCardData();
			var iTime = this.getLastSavedTime();
			var iVersion = this.getVersion();
			var fileName = this.getFileName();
			return {
				cards: aCards,
				time: iTime,
				version: iVersion,
				fileName: fileName,
				tags: this.tagPopup.getAllTags(),
				id: this.getFileId(),
				beats: this.beat.getDataToSave()
			};
		},
		loadFile: function(sId, fnS){
			var that = this;
			this.setBusy(true);
			cloudBox.getFile(sId, function(o) {
				var oData = o[0];
				oData.id =sId;
				that.setFileId(sId);
			    that._ioManager.saveToBackUp(oData);
				that.setData(oData, true);
				that.setBusy(false);
			    if(fnS){
					fnS();
				}
			});	
			
		},
		loadFileFromCloudIfLatest: function(sId, fnS){
			var that = this;
			this.setBusy(true);
			var localVersion = this.getVersion();
			cloudBox.getFile(sId, function(o) {
				var oData = o[0];
				oData.id =sId;
				that.setBusy(false);
				if(oData.version > localVersion){
					that.setFileId(sId);
					that._ioManager.saveToBackUp(oData);
					that.setData(oData, true);
				} else if(oData.version < localVersion){
					appManager.fireEvent("dataChange");
				}
				if(fnS){
					fnS();
				}
			});	
			
		},
		loadLatestFileFromCloud: function(){
			this.loadFileFromCloudIfLatest(this.getFileId());
		},
		getData: function(sKey){
			var aData = this.getCurrentData();
			return sKey? aData[sKey] : aData;
		},
		listenTo: function(sEvent, fn){
			this._eventListeners[sEvent] = this._eventListeners[sEvent] || [];
			this._eventListeners[sEvent].push(fn);
		},
		fireEvent: function(sEvent, oData){
			var aListeners = this._eventListeners[sEvent] || [];
			aListeners.forEach(function(c){
				c(oData);
			});
		},
		openFileTitleDialog: function(){
			var sVal = this.getFileName();
			jQuery("#fileTitleDialog").show().find(".inputBar").val(sVal).focus();
			this.fireEvent("dialogOpen", {
				id: "fileTitle",
				closeHandler: this.closeFileTitleDialog.bind(this)
			});
		},
		closeFileTitleDialog: function(bSuppressEvent){
			jQuery("#fileTitleDialog").hide();
			if(!bSuppressEvent){
				this.fireEvent("dialogClose", {
				id: "fileTitle"
				});
			}
		},
		openBackupConfirmationWindow: function(){
			jQuery("#backupConfirmationWindow").show();
			this.fireEvent("dialogOpen", {
				id: "backupConfirmation",
				closeHandler: this.closeBackupConfirmationWindow.bind(this)
			});
		},
		closeBackupConfirmationWindow: function(bSuppressEvent){
			jQuery("#backupConfirmationWindow").hide();
			if(!bSuppressEvent){
				this.fireEvent("dialogClose", {
				id: "backupConfirmation"
				});
			}
		},
		openVersionConflictWindow: function(){
			jQuery("#versionConflictWindow").show();
			this.fireEvent("dialogOpen", {
				id: "versionConflict",
				closeHandler: function(){}
			});
		},
		closeVersionConflictWindow: function(bSuppressEvent){
			jQuery("#versionConflictWindow").hide();
			if(!bSuppressEvent){
				this.fireEvent("dialogClose", {
				id: "versionConflicts"
				});
			}
		},
		
		setBusy: function(bIsBusy){
			jQuery("#busy")[bIsBusy? "show" : "hide"]();
		},
		_attachEvents: function(){
			var masterButtonPane = jQuery("#masterButtonPane");
			var beatButton = jQuery("#beatButton");
			var actButton = jQuery("#actButton");
			var emoButton = jQuery("#emoButton");
			var that = this;
			var body = jQuery("body");
			jQuery("#createNewFile").click(function(){
				that.openBackupConfirmationWindow();
			});
			
			jQuery("#createBackupBeforeNew").click(function(){
				that._ioManager.save(that.createNewFile.bind(that));
				that.closeBackupConfirmationWindow();
			});
			jQuery("#createNewWithoutBackup").click(function(){
				that.createNewFile();
				that.closeBackupConfirmationWindow();
			});
			jQuery("#loadLatestFromCloud").click(function(){
				that.closeVersionConflictWindow();
			});
			jQuery("#loadcurrentFromHere").click(function(){
				that.closeVersionConflictWindow();
			});
			jQuery("#backupConfirmationWindow .closeButton").click(function(){
				that.closeBackupConfirmationWindow();
			});
			jQuery("#fileName").click(function(){
				that.openFileTitleDialog();
			});
			jQuery("#fileTitleDialog .inputBar").on("keydown", function(e){
				if(e.keyCode == 13){
					jQuery("#fileTitleSave").click();
					return false;
				}
				return (e.keyCode == 8) || (e.keyCode==46) || this.value.length<40;
			});
			jQuery("#fileTitleSave").click(function(){
				that.setFileName(jQuery("#fileTitleDialog .inputBar").val(), true);
				that.closeFileTitleDialog();
				that.fireEvent("dataChange");
			});
			jQuery("#fileTitleCancel").click(function(){
				that.closeFileTitleDialog();
			});
			jQuery("#viewIcon").click(function(){
				var oData = that.cardManager.getCardData();
				that._overviewManager.open({
					fileName: that.getFileName(),
					cards: oData
				});
			});
			var userInfoPane = jQuery("#userInfoPane");
			var savePane  = jQuery("#savePane");
			var loadPane  = jQuery("#loadPane");
			
			jQuery("#loadFromLocal").click(function(){
				loadPane.hide();
				that._ioManager._fireRead();
			});
			jQuery("#loadFromCloud").click(function(){
				loadPane.hide();
				cloudBox.open();
			});
			jQuery("#saveToCloud").click(function(){
				savePane.hide();
				cloudBox.save();
			});
			jQuery("#saveToLocal").click(function(){
				savePane.hide();
				that._ioManager._fireWrite();
			});
			
			jQuery("#saveFile").click(function(){
				if(that.getCloudMode()){
					savePane.toggle();
					userInfoPane.hide();
					loadPane.hide();					
				} else {
					that._ioManager._fireWrite();
				}
			});
			jQuery("#openFile").click(function(){
				if(that.getCloudMode()){
					savePane.hide();
					userInfoPane.hide();
					loadPane.toggle();					
				} else {
					that._ioManager._fireRead();
				}
			});
			jQuery("#user").click(function(){
				savePane.hide();
				userInfoPane.toggle();
				loadPane.hide();
			});
			jQuery("#searchContainer .searchBar").on("input", function(){
				that.cardManager.onSearch(this.value);
			});
			window.onkeydown = function(e){
				if(e.keyCode == 27){
					that.fireEvent("escPress");
				}else if(e.keyCode == 37){
					that.fireEvent("leftArrowPress");
				} else if(e.keyCode == 39){
					that.fireEvent("rightArrowPress");
				}
			}
			var configureBeatButton = jQuery("#configureBeat");
			jQuery("#beatButton").click(function(){
				var body = jQuery("body");
				if(body.hasClass("showBeats")){
					body.removeClass("showBeats");
					configureBeatButton.hide();
					that.cardManager.setShowBeatSelector(false);
				
				} else {
					body.addClass("showBeats");
					that.cardManager.setShowBeatSelector(true);
				}
			});

			jQuery("#actButton").click(function(){
				var body = jQuery("body");
				if(body.hasClass("showActColors")){
					body.removeClass("showActColors");
					that.cardManager.setShowActSelector(false);
				} else {
					body.addClass("showActColors");
					that.cardManager.setShowActSelector(true);
				}
			});
			jQuery("#pageMeterButton").click(function(){
				var body = jQuery("body");
				if(body.hasClass("showPageMeter")){
					that.cardManager.setShowPageMeter(false);
					body.removeClass("showPageMeter");
				} else {
					body.addClass("showPageMeter");
					that.cardManager.setShowPageMeter(true);
				}
			});
			jQuery("#menuIcon").click(function(){
				jQuery("#leftPanel").toggleClass("isVisible");
			});
			configureBeatButton.click(function(){
				that.beat.show();
			});
		},
		_attachListeners: function(){
			var openDialogRegister = {};
			var baseLocationUrl = window.location.origin+window.location.pathname; 
			this.listenTo("dialogOpen", function(oParam){
				openDialogRegister[oParam.id] = oParam.closeHandler;
				if(window.location.hash){
					//window.location.replace(baseLocationUrl + "#view");
				} else {
					window.location.hash = "view";
				}
				jQuery("#blocker").show();
				console.log("opening -- " + oParam.id);
			});
			this.listenTo("dialogClose", function(oParam){
				delete openDialogRegister[oParam.id];
				console.log("closing -- " + oParam.id);
				if(Object.keys(openDialogRegister).length == 0){
					window.location.hash = "";			
				}
			});
			window.onhashchange = function(e){
				if(window.location.hash == ""){
					for(var each in openDialogRegister){
						console.log("closing through hash -- " + each);
						openDialogRegister[each](true);
						delete openDialogRegister[each];
					}
					jQuery("#blocker").hide();
				}
			}
		},
		onMasterPaneButtonPress: function(sButton, oButton){
			
		},
		onDrop: function(oPos, oClone, oCard, originalOffset, bIsDelete){
			var oTargetCard = this.cardManager.getCardAtMousePosition( oPos.x + window.scrollX, oPos.y + window.scrollY);
			
			var fromPos = oCard.getProperty("index");
			var toPos;
			var scrollX1 = window.scrollX;
			var scrollY1 = window.scrollY;
			var cardContainer = jQuery("#contentArea");
			var cardContainerH = cardContainer.height();
		
			if(bIsDelete){
				oClone.remove();
				this.cardManager.deleteCard(fromPos);
				
			} else if(oTargetCard && ((toPos = oTargetCard.getProperty("index")) != fromPos)){
				cardContainer.height(cardContainerH + "px");
				window.scrollTo(scrollX1,scrollY1);
				this.cardManager.moveCardToIndex(oCard,fromPos, toPos, oClone, scrollY1, function(){
					window.scrollTo(scrollX1,scrollY1);
					cardContainer.css("height", "");
					oClone.remove();
				});
				
			} else {
				oClone.animate(originalOffset, 300, function(){
					oClone.remove();
				});
			}
			return 
		},
		setTouchDragStart: function(oCard, prevEvent){
			var that =this;
			this._isDragStart = true;
			var offset = oCard.getNodeReference().offset();
			var oClone = oCard.getClone().css({
				top: offset.top - window.scrollY,
				left: offset.left - window.scrollX
			});
			var originY = prevEvent.touches[0].clientX-offset.top;
			var originX = prevEvent.touches[0].clientY-offset.left;
			var originScrollX = window.scrollX;
			var originScrollY = window.scrollY;
			var $html = jQuery("html");
			var canceScroll = true;
			var cloneNode = oClone[0];
			function scrollIfScrollZone(){
				if(cloneNode && (screen.availHeight - cloneNode.getBoundingClientRect().top) < 40){
					$html.animate({scrollTop: window.scrollY + 50},300);
					setTimeout(function(){
						scrollIfScrollZone();
					}, 305);
				}
			}
			
			function drag(e){
				e.preventDefault();
				e.stopPropagation();
				curX = e.touches[0].clientX;
				curY = e.touches[0].clientY;
				oClone.css({
					top: curY - originY -originScrollY,
					left: curX - originX- originScrollX
				});
				scrollIfScrollZone();
				//console.log("x is " + e.originalEvent.movementX, " Y is "+e.originalEvent.movementY);
			}
			function drop(e){
				jQuery(window).off("touchmove", drag);
				jQuery(window).off("touchend", drop);
				that.onDrop({
					x: curX,
					y: curY
					
				}, oClone, oCard, offset, false);
			}
			var curX = originX, curY = originY;
			jQuery(window).trigger("touchstart");
			jQuery(window).on("touchmove", drag);
			jQuery(window).on("touchend", drop);
		},		
		setDragStart: function(oCard, prevEvent){
			var that =this;
			this._isDragStart = true;
			var offset = oCard.getNodeReference().offset();
			var oClone = oCard.getClone().css({
				top: offset.top - window.scrollY,
				left: offset.left - window.scrollX
			});
			jQuery("#testArea").append(oClone);
			jQuery("#deleteZone").addClass("isVisible");
			
			var originY = prevEvent.originalEvent.clientY-offset.top;
			var originX = prevEvent.originalEvent.clientX-offset.left;
			var originScrollX = window.scrollX;
			var originScrollY = window.scrollY;
			var $html = jQuery("html");
			var canceScroll = true;
			var cloneNode = oClone[0];
			var cardHeight = oClone.height();
			var scrollThreshold = cardHeight + 20;
			
			var curDragId = Date.now();
			var bScrollEnable = true;
			function scrollIfScrollZone(dragId){
				var pTop = oClone.position().top;
				if(bScrollEnable && (curDragId == dragId)){
					console.log(window.innerHeight , pTop);
					if(window.innerHeight - pTop < scrollThreshold){
						console.log("scroll");
						bScrollEnable = false;
						$html.animate({scrollTop: window.scrollY + cardHeight},1000, function(){
							bScrollEnable = true;
							scrollIfScrollZone(curDragId);
						});
					} else if(pTop < 60){
						console.log("scroll up");
						bScrollEnable = false;
						$html.animate({scrollTop: window.scrollY - cardHeight},1000, function(){
							bScrollEnable = true;
							scrollIfScrollZone(curDragId);
						});						
					}
					
				}
			}
			
			function drag(e){
				var pTop = oClone.position().top;
				oClone.css({
					top: e.originalEvent.clientY - originY -originScrollY,
					left: e.originalEvent.clientX - originX- originScrollX
				});
				curDragId = Date.now();
				/*if((window.innerHeight - pTop < scrollThreshold) || pTop < 60){
					setTimeout(function(){
						scrollIfScrollZone(curDragId);
					}, 1100);
				}*/
				//console.log("x is " + e.originalEvent.movementX, " Y is "+e.originalEvent.movementY);
			}
			function drop(e){
				curDragId =Date.now();
				bScrollEnable = false;
				var bIsDelete = e.target.hasAttribute("delete-area");
				jQuery(window).off("mousemove", drag);
				jQuery(window).off("mouseup", drop);
				
				that.onDrop({
					x: e.originalEvent.clientX,
					y: e.originalEvent.clientY
					
				}, oClone, oCard, offset, bIsDelete);
				jQuery("#deleteZone").removeClass("isVisible");
			}
			jQuery(window).on("mousemove", drag);
			jQuery(window).on("mouseup", drop);
		},
		getThemes: function(){
			//["#7a9fd8","#e91e63","#009688","#fbb043","#673AB7"];
			return ["blue", "red", "green", "orange", "violet", "white"];
		},
		openPopup: function(oCard, aTag){
			this.tagPopup.open(aTag, oCard);
		},
		sanitizeHtml: function(s){
			s = s || "";
			return s.replace(/\<(\/)?(div|a|p|script|style|img|span|iframe|frame|button|input|textarea)\>/gi, "").replace(/\r|\n/gi, "<br>");
		},
		showSuccess: function(sMsg){
			sMsg = sMsg || "Success";
			jQuery("#messageToast").html(sMsg).removeClass("fail").show().addClass("success");
			setTimeout(function(){
				jQuery("#messageToast").hide();
			}, 3000);
		},
		showFailure: function(sMsg){
			sMsg = sMsg || "Fail";
			jQuery("#messageToast").html(sMsg).removeClass("success").show().addClass("fail");
			setTimeout(function(){
				jQuery("#messageToast").hide();
			}, 3000);
		}
	}
})();