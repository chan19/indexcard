(function(){
	var count = 0;
	Dropdown = function(oConfig){
		oConfig = oConfig || {};
		this.init(oConfig);
	}
	Dropdown.prototype = {
		init: function(oConfig){
			oConfig.id = oConfig.id || "_dropdown" + count++;
			this._options = oConfig.list;
			this._defaultText = oConfig.defaultText || "Select an Option";
			this._classList = oConfig.class || [];
			this._setHandlers(oConfig);
			this._createNode(oConfig);
			this._attachEvents();
			this._addGlobalListeners();
			if(oConfig.value){
				this.setValue(oConfig.value);
			}
		},
		_owner: null,
		_value: null,
		_options: {},
		_handlers: {
			change: function(){
				
			}
		},
		_setHandlers: function(oConfig){
			this._handlers = {
				change: oConfig.onChange || function(){}
			};
		},
		attachOnChange: function(fn){
			this._setHandlers({
				onChange: fn
			});
		},
		setOptions: function(aList){
			this._options = aList;
			this._node.find(".dropDownOptionContainer").empty().append(this._getOptionsHtml(aList));
			this.setValue(oList[0].key);
			return this;
		},
		getOptions: function(){
			return this._options;
		},
		getCore: function(){
			return appManager;
		},
		_getIndexOfKey: function(sValue){
			var a = this.getOptions();
			var sel = -1;
			if(sValue != -1){
				for(var i = 0; i<a.length; i++){
				if(a[i].key +"" == sValue+""){
					sel = i;
					break;
				}
			}
			}
			return sel;
		},
		setValue: function(sKey, bSuppressHandlerCall){
			var a = this.getOptions();
			var i = this._getIndexOfKey(sKey);
			var sText = (i == -1 )? this._defaultText : a[i].value;
			this._node.find(".dropDownValue").text(sText.length < 25? sText : (sText.substr(0, 25) + "..."));
			this._value = sKey;
			if(!bSuppressHandlerCall){
				this._handlers.change(sKey, i, sText);	
			}
			return this;
		},
		getValue: function(){
			return this._value;
		},
		_getOptionsHtml: function(aList){
			var html = "";
			var trimmedText = "";
			aList.forEach(function(o,i){
				trimmedText = o.value.length < 25? o.value : (o.value.substr(0, 25) + "...");
				html += "<div class='dropDownOption' data-value='"+o.key+"' data-index="+i+"><div>"+trimmedText + "</div>" +
						"<span>" + o.value + "</span>" +
				"</div>";
			});
			return html;
		},
		getHtml: function(sId, aList){
			return "<div id='"+ sId + "' class='dropDown'><div class='dropDownValue'>" + this._defaultText +"</div><div class='dropDownArrow'></div>" +
					"<div class='dropDownOptionContainer' style='display:none'>" + this._getOptionsHtml(aList) +
					"</div></div>";
		},
		getNode: function(){
			return this._node;
		},
		_createNode: function(o){
			this._node = jQuery(this.getHtml(o.id, o.list));
			return this;
		},
		render: function(sId){
			jQuery("#" + sId).append(this._node);
			return this;
			
		},
		_addGlobalListeners: function(){
			var that = this;
		},
		_attachEvents: function(){
			var that = this;
			var optionsContainer = this._node.find(".dropDownOptionContainer");
			this._node.find(".dropDownValue,.dropDownArrow").click(function(){
				optionsContainer.toggle();
			});
			this._node.on("click", ".dropDownOption",function(){
				var sel = this.attributes["data-value"].value;
				var index = this.attributes["data-index"].value;
				that.setValue(sel);
				optionsContainer.hide();
			});
		}
	}
})();