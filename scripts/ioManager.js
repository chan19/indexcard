function IoManager(oConfig){
	this._init(oConfig);
}
IoManager.prototype = {
	_init: function(oConfig){
		this._creatDownloadTarget();
		this._initRead(oConfig.read);
		this._initWrite(oConfig.write);
		this._addGlobalListeners(oConfig.write.dataGetter);
	},
	getCore: function(){
		return appManager;
	},
	_creatDownloadTarget: function(){
		this._downloadTarget = jQuery(document.createElement("a"));
	},
	save: function(oData, sFileName){
		this.saveToBackUp(oData)
		var sBlobUrl = this._getBlobUrl(oData);
		this._download(sBlobUrl, sFileName);
	},
	_getBlobUrl: function(oData){
		var sText = this._toText([oData]);
		var bFile = new Blob([sText],{type: "text/plain"});
		return URL.createObjectURL(bFile);
	},
	_toText: function(aCards){
		return JSON.stringify(aCards);
	},
	_getDownloadTarget: function(){
		return this._downloadTarget;
	},
	_download: function(sBlobUrl, sFileName){
		sFileName = sFileName || "myIndexCard";
		var dTarget = this._getDownloadTarget();
		var e = new MouseEvent("click");
		dTarget.attr("download", sFileName + ".iJson");
		dTarget.attr("href", sBlobUrl);
		dTarget.get(0).dispatchEvent(e);
	},

	_initWrite: function(oConfig){
		var id = oConfig.id;
		var fCallback = oConfig.onWrite;
		var dataGetter = oConfig.dataGetter;
		var that = this;
		jQuery("#"+id).on("click", function(){
			var oData = dataGetter();
			that.save(oData, oData.fileName);
			
		});
		/*setInterval(function(){
			var oData = dataGetter();
			that.saveToBackUp(oData);
		}, 20000);*/
	},
	saveToBackUp: function(oData){
		localStorage.backup = JSON.stringify(oData);
		return this;
	},
	readFromBackup: function(){
		var sBackup = localStorage.backup || "{}";
		return JSON.parse(sBackup);
	},
	_initRead: function(oConfig){
		var id = oConfig.id;
		var fCallback = oConfig.onRead;
		var sData;
		var aData;
		var reader = new FileReader();
		var that = this;
		reader.onload = function(){
			sData = reader.result;
			aData = JSON.parse(sData);
			fCallback(aData[0]);
			that.saveToBackUp(aData[0])
		}
		
		jQuery("#"+id).on("change", function(e){
			var input = e.target;
			if(input){
				reader.readAsText(input.files[0]);
			}
		});
		
	},
	_addGlobalListeners: function(fDataGetter){
		var that = this;
		this.getCore().listenTo("dataChange", function(){
			that.saveToBackUp(fDataGetter());
		});
	}
}