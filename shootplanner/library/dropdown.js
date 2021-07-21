(function(){
	var count = 0;
	Dropdown = function(oConfig){
		oConfig = oConfig || {};
		this.init(oConfig);
	}
	Dropdown.prototype = {
		init: function(oConfig){
			oConfig.id = oConfig.id || "_dropdown" + count++;
			this.id = oConfig.id;
			this._editable = (oConfig.editable === undefined) ? true : !!oConfig.editable;
			this._options = oConfig.list || [];
			this._defaultText = oConfig.defaultText || "Select an Option";
			this._classList = oConfig.class || [];
			this._autofit  = oConfig.autofit || false;
			this._setHandlers(oConfig);
			this._createNode(oConfig);
			this._attachEvents();
			this._addGlobalListeners();
			if(oConfig.value){
				this.setValue(oConfig.value);
			}
			if(oConfig.visible !== undefined){
				this.setVisible(oConfig.visible);
			}
		},
		_owner: null,
		_value: null,
		_editable: true,
		_isVisible: true,
		_options: {},
		_isOpen: false,
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
		setOptions: function(aList, sKey){
			this._options = aList;
			this._node.find(".dropDownOptionContainer").empty().append(this._getOptionsHtml(aList));
			if(sKey){
				this.setValue(sKey);
			} else {
				this.setValue(null);
			}
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
		setEditable: function(bEditable){
			this._editable = !!bEditable;
			if(bEditable){
				this._node.removeClass("noneditable").addClass("editable");
			} else {
				this._node.removeClass("editable").addClass("noneditable");
			}
			return this;
		},
		getEditable: function(){
			return this._editable;
		},
		setValue: function(sKey, bSuppressHandlerCall){
			if( sKey == null || sKey == undefined){
					var sText = this._defaultText;
					this._node.find(".dropDownValue").text(sText);
					this._value = null;
					if(!bSuppressHandlerCall){
						this._handlers.change(sKey, i, sText);	
					}
					this._node.find(".dropDownOption").each(function(i,o){
						o.className = "dropDownOption";
					});					
			} else {
				var a = this.getOptions();
				var i = this._getIndexOfKey(sKey);
				if(i!= -1){
					var sText = a[i].value;
					this._node.find(".dropDownValue").text(sText.length < 25? sText : (sText.substr(0, 25) + "..."));
					this._value = sKey;
					if(!bSuppressHandlerCall){
						this._handlers.change(sKey, i, sText);	
					}
					this._node.find(".dropDownOption").each(function(i,o){
						if(o.dataset.value == sKey){
							o.className = "dropDownOption selected";
						} else {
							o.className = "dropDownOption";
						}
					});				
				}				
			}

			return this;
		},
		getValue: function(){
			return this._value;
		},
		setVisible: function(bVisible){
			this._visible = bVisible;
			this._node[bVisible ? "show" : "hide"]();
			return this;
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
			var editableClass = this._editable ? "editable" : "noneditable";
			var autofitClass = this._autofit ? "autofit" :"";
			return "<div id='"+ sId + "' class='dropDown " + editableClass+ " " + autofitClass+"'><div class='dropDownValue'>" + this._defaultText +"</div><div class='dropDownArrow'></div>" +
					"<div class='dropDownOptionContainer' style='display:none'>" + this._getOptionsHtml(aList) +
					"</div></div>";
		},
		getNode: function(){
			return this._node;
		},
		_createNode: function(o){
			this._node = jQuery(this.getHtml(this.id, this._options));
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
			var closeHandler = function(){
				jQuery(window).off("click");
				optionsContainer.hide();
				that._isOpen = false;
			}
			this._node.find(".dropDownValue,.dropDownArrow").click(function(e){
				if(that.getEditable()){
					that._isOpen = !that._isOpen;
					optionsContainer.toggle();
					e.stopPropagation();
					if(that._isOpen){
						var selected = optionsContainer.find(".selected.dropDownOption");
						if(selected.length){
							optionsContainer.scrollTop(optionsContainer.scrollTop()+selected.position().top);
						}
						jQuery(window).on("click", closeHandler);
					}
				}
			});
			this._node.on("click", ".dropDownOption",function(e){
				e.stopPropagation();
				jQuery(window).off("click");
				that._isOpen = false;
				var sel = this.attributes["data-value"].value;
				var index = this.attributes["data-index"].value;
				that.setValue(sel);
				optionsContainer.hide();
			});
		}
	}
})();