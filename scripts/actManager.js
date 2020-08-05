(function(){
	ActManager = function(){
		this._init();
	}
	ActManager.prototype = {
		
		_init: function(){
			this._createNode();
			this._attachEvents();
			this._addGlobalListeners();
			return this;
		},
		getCore: function(){
			return appManager;
		},
		_actConfig: {
			"3_ACT": [{
				key: "1",
				value: "ACT 1"
				},{
					key: "2A",
					value: "ACT 2A"
				},{
					key: "2B",
					value: "ACT 2B"
				},{
					key: "3",
					value: "ACT 3"
				}]
		},
		_curAct: "3_ACT",
		getAct: function(sAct){
			return this._actConfig[sAct];
		},
		getCurrentAct: function(){
			return this._actConfig[this._curAct];
		},
		addAct: function(sAct, aAct){
			this._actConfig[sAct] = aAct;
			return this;
			
		},
		open: function(aData){
			jQuery("#blocker").show();
			this._node.show();
			return this;
		},
		hide: function(){
			this._node.hide();
			jQuery("#blocker").hide();
			return this;
		},
		_getActsList: function(){
			
		},
		getHtml: function(){
			var acts = this.getActs();
			var tmp = "";
			return "<div id='actManager' style='display:none'>" +
					"<div class='actManagerLeftPanel'></div>" +
					"<div class='actManagerBody'><div class='editorLabel'>Plot point title</div><input id='actName'></div>" +
				"</div>";
		},
		_createNode: function(){
			var that = this;
			this._node = jQuery(this.getHtml());
			return this;
		},
		render: function(sId){
			jQuery("#" + sId).append(this._node);
			return this;
		},
		_attachEvents: function(){
			this._node.find(".actDialogClose").click(this.hide.bind(this));
		},
		_addGlobalListeners: function(){
			var that = this;
			appManager.listenTo("escPress", function(data){
				that.hide();
			});
		},
		getDataToSave: function(){
			var acts = this.getActs();
			var aData = [];
			acts.forEach(function(){
				
			});
			return {
				
			}
		}
		
	}
})();