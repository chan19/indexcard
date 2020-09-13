appManager = {
	init: function(oData){
		var that = this;
		this._version = 1;
		this._initIoManager();
		this._attachEvents();
		var oData = this._getProcessedData(this._ioManager.readFromBackup());
		this.setProperties(oData);
		this._initBeat();
		this._initOverview();
		this._initTagPopup(oData.tags);
		this._initCardManager(oData.cards);
		this._initActDialog();
		setInterval(this.refreshLastSavedTime.bind(this), 60000);
	},
	_data: {},
	_eventListeners: {},
	_initIoManager: function(){
		this._ioManager = new IoManager({
			read: {
				id: "openFile",
				pseudo: "fileuploadmask",
				onRead: this.onFileFetch.bind(this)
			},
			write: {
				id: "saveFile",
				onWrite: function(){
					console.log("filesaved");
				},
				dataGetter: this.getDataToSave.bind(this)
			}
		});
		
	},
	_initOverview: function(){
		this._overviewManager = new Overview("overViewContainer");
	},
	_initBeat: function(){
		this.beat = new Beat();
		jQuery("#rightPanel").append(this.beat.getNode());
	},
	_initTagPopup: function(aTag){
		this.tagPopup = new TagPopup({
			tags: aTag
		});
		this.tagPopup.render("testArea");
	},
	_initActDialog: function(){
		this.actDialog = new ActDialog();
		this.actDialog.render("testArea");
	},
	_initCardManager: function(aCard){
		this.cardManager = new CardManager(aCard);
		if(aCard && aCard.length){
			this.cardManager.setCardData(aCard);
		} else{
			this.cardManager.addNewCard(0);
		}
		return this;
	},
	_getProcessedData: function(oData){
		return {
			time: oData.time || Date.now(),
			version: oData.version || 1,
			cards: oData.cards || [],
			fileName: oData.fileName || "Untitled File",
			tags: oData.tags || []
		}
	},
	setProperties: function(oData){
		this.setLastSavedTime(oData.time);
		this.setVersion(oData.version);
		this.setFileName(oData.fileName, true);
		
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
	setData: function(oData, bSuppressBackup){
		this.setLastSavedTime(oData.time);
		this.setVersion(oData.version);
		this.setFileName(oData.fileName, true);
		this.cardManager.setCardData(oData.cards);
		//this.cardManager.setBeatsToCards(oData.beats);
		this.fireEvent("dataChange", { beats: oData.beats, tags: oData.tags, suppressBackup: bSuppressBackup});
	},
	onFileFetch: function(oData){
			this.setData(oData, true);
	},
	createNewFile: function(){
		var data = this._getProcessedData({});
		this.setData(data);
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
			fileId: Date.now(),
			beats: this.beat.getDataToSave()/*,
			acts: this.actDialog.getDataToSave()*/
		};
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
	openBackupConfirmationWindow: function(){
		jQuery("#backupConfirmationWindow").show();
		jQuery("#blocker").show();
	},
	closeBackupConfirmationWindow: function(){
		jQuery("#backupConfirmationWindow").hide();
		jQuery("#blocker").hide();
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
			that.closeBackupConfirmationWindow();
			that._ioManager.save(that.createNewFile.bind(that));
		});
		jQuery("#backupConfirmationWindow .closeButton").click(function(){
			that.closeBackupConfirmationWindow();
		});
		jQuery("#fileName").focusout(function(){
			that.setFileName(this.innerText, false);
			that.fireEvent("dataChange");
		});
		jQuery("#fileName").on("keydown", function(e){
			if(e.keyCode == 13){
				jQuery(this).blur();//.focusout();
				return false;
			}
			return (e.keyCode == 8) || (e.keyCode==46) || this.innerText.length<40;
		});
		jQuery("#viewIcon").click(function(){
			var oData = that.cardManager.getCardData();
			that._overviewManager.open({
				fileName: that.getFileName(),
				cards: oData
			});
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
		jQuery("#beatButton").click(function(){
			that.cardManager.fadeCards(false);
			if(masterButtonPane.hasClass("buttonActive")){
				if(jQuery(this).hasClass("isPressed")){
					jQuery(this).removeClass("isPressed");
					that.beat.hide();
					masterButtonPane.removeClass("buttonActive");
				} else {
					jQuery(this).addClass("isPressed");
					that.beat.show();
					that.cardManager.fadeCards(true);
					actButton.removeClass("isPressed");
					emoButton.removeClass("isPressed");
				}
				
			} else {
				masterButtonPane.addClass("buttonActive")
				jQuery(this).addClass("isPressed");
				that.beat.show();
				that.cardManager.fadeCards(true);
				
			}
			
		});
		jQuery("#actButton").click(function(){
			that.cardManager.fadeCards(false);
			that.beat.hide();
			if(masterButtonPane.hasClass("buttonActive")){
				if(jQuery(this).hasClass("isPressed")){
					jQuery(this).removeClass("isPressed");
					masterButtonPane.removeClass("buttonActive");
				} else {
					jQuery(this).addClass("isPressed");
					//something
					beatButton.removeClass("isPressed");
					emoButton.removeClass("isPressed");
				}
				
			} else {
				masterButtonPane.addClass("buttonActive")
				jQuery(this).addClass("isPressed");
			}
			that.actDialog.open();
			
		});
		jQuery("#emoButton").click(function(){
			that.cardManager.fadeCards(false);
			that.beat.hide();
			if(masterButtonPane.hasClass("buttonActive")){
				if(jQuery(this).hasClass("isPressed")){
					jQuery(this).removeClass("isPressed");
					that.beat.hide();
					masterButtonPane.removeClass("buttonActive");
				} else {
					jQuery(this).addClass("isPressed");
					//something
					actButton.removeClass("isPressed");
					beatButton.removeClass("isPressed");
				}
				
			} else {
				masterButtonPane.addClass("buttonActive")
				jQuery(this).addClass("isPressed");
			}
			
		});
		jQuery("#menuIcon").click(function(){
			jQuery("#leftPanel").toggleClass("isVisible");
		});
	},
	onMasterPaneButtonPress: function(sButton, oButton){
		
	},
	onDrop: function(e, oClone, oCard, originalOffset){
		var oTargetCard = this.cardManager.getCardAtMousePosition( e.clientX + window.scrollX, e.clientY + window.scrollY);
		
		var fromPos = oCard.getProperty("index");
		var toPos;
		var scrollX1 = window.scrollX;
		var scrollY1 = window.scrollY;
		var cardContainer = jQuery("#contentArea");
		var cardContainerH = cardContainer.height();
		console.log(cardContainerH);
		if(e.target.hasAttribute("delete-area")){
			oClone.remove();
			this.cardManager.deleteCard(fromPos);
			
		} else if(oTargetCard && ((toPos = oTargetCard.getProperty("index")) != fromPos)){
			cardContainer.height(cardContainerH + "px");
			window.scrollTo(scrollX1,scrollY1)
			this.cardManager.moveCardToIndex(oCard,fromPos, toPos, oClone, function(){
				window.scrollTo(scrollX1,scrollY1);
				cardContainer.css("height", "");
				oClone.remove();
			});
			
		} else {
			oClone.animate(originalOffset, 300, function(){
				oClone.remove();
			});
		}
		console.log(fromPos,toPos);
		return 
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
		
		function drag(e){
			oClone.css({
				top: e.originalEvent.clientY - originY -originScrollY,
				left: e.originalEvent.clientX - originX- originScrollX
			});
			//console.log("x is " + e.originalEvent.movementX, " Y is "+e.originalEvent.movementY);
		}
		function drop(e){
			jQuery(window).off("mousemove", drag);
			jQuery(window).off("mouseup", drop);
			that.onDrop(e.originalEvent, oClone, oCard, offset);
			jQuery("#deleteZone").removeClass("isVisible");
		}
		jQuery(window).on("mousemove", drag);
		jQuery(window).on("mouseup", drop);
	},
	onBeatItemClick: function(oCurrentBeats){
		if(oCurrentBeats){
			this.cardManager.fadeCards(true);
			this.cardManager.setBeatsToCards(oCurrentBeats);
		} else {
			
		}
	},
	getThemes: function(){
		//["#7a9fd8","#e91e63","#009688","#fbb043","#673AB7"];
		return ["blue", "red", "green", "orange", "violet"];
	},
	openPopup: function(oCard, aTag){
		this.tagPopup.open(aTag, oCard);
	},
	sanitizeHtml: function(s){
		s = s || "";
		return s.replace(/\<(\/)?(div|a|p|script|style|img|span|iframe|frame|button|input|textarea)\>/gi, "").replace(/\r|\n/gi, "<br>");
	},
	getConfirmation: function(sText, fnOk, fnCancel){
		jQuery("#confirmationWindow").show();
	}
}