(function(){
	var cardId = 0;
	IndexCard = function(oConfig, nIndex){
		this._init(oConfig, nIndex);
	}

	IndexCard.prototype = {
		_props: ["id", "title","content","index", "color", "statusText", "tags", "meta", "notes", "act", "pgTarget", "beat"],
		getCore: function(){
			return appManager;
		},
		_init: function(oConfig, nIndex){
			var oData;
			if(oConfig && oConfig.data){
				oData = this._prepareData(oConfig.data);
				this._setIsDirty("title", true);
				this._setIsDirty("content", true);
			} else {
				oData =this._getDefaultData(nIndex);
				this._setIsDirty("title", false);
				this._setIsDirty("content", false);
			}
			this._setProperties(oData);
			if(oConfig.editable === false){
				this._isEditable = false;
			}
			if(oConfig.size){
				this._size = oConfig.size.toUpperCase();
			}
			if(oConfig.showIndex === false){
				this._showIndex = false;
			}
			this._setHandlers(oConfig);
			this._createNode();
		},
		_handler: {
			"add": function(){
				
			},
			"delete": function(){
				
			},
			"click" : function(){
				
			},
			"popout" : function(){
				
			}
		},
		_isDirty: {
			title: false,
			content: false
		},
		generateId: function(){
			return Date.now();
		},
		_isFocus: false,
		_isEditable: true,
		_size: "default",
		_showIndex: true,
		_setIsDirty: function(sProp, bIsDirty){
			this._isDirty[sProp] = bIsDirty;
			return this;
		},
		_getIsDirty: function(sProp){
			return this._isDirty[sProp];
		},
		_setHandlers: function(oConfig){
			this._handler = {
				"add" : oConfig.onAddNew,
				"delete" : oConfig.onDelete,
				"click" : oConfig.onClick,
				"popout" : oConfig.onPopout
			}
		},
		setEditable: function(bEditable){
			var node = this.getNodeReference();
			node.find(".indexCardTitle").attr("contentEditable", bEditable);
			node.find(".indexCardContent").attr("contentEditable", bEditable);
			node[bEditable? "addClass" : "removeClass"]("isEditable");
			this._isEditable = bEditable;
			return this;
		},
		getEditable: function(){
			return this._isEditable;
		},
		getSize: function(){
			return this._size;
		},
		setSize: function(s){
			this._size = s;
			this.getNodeReference().addClass("size" + s.toUpperCase());
		},
		_setProperties: function(oData){
			var that = this;
			this._id = oData.id || this.generateId();
			this._title = oData.title;
			this._content = oData.content;
			this._index = oData.index;
			this._color = oData.color || "blue";
			this._statusText = "";
			this._tags = oData.tags || [];
			this._meta = oData.meta || "{}";
			this._notes = oData.notes || [];
			this._act = oData.act || "-1";
			this._pgTarget = oData.pgTarget || "1";
			this._beat = oData.beat || "NONE";
		},
		_setHandler: function(sName, fHandler){
			this._handler [sName] = fHandler || function(){};
			return this;
		},
		_getHandler: function(sName){
			return this._handler [sName];
		},
		_createBeatSelector: function(){
			return new Dropdown({
				id: "beat_"+this.getProperty("id"),
				defaultText: "Choose Beat",
				list: appManager.getConfig("beat"),
				value: this.getProperty("beat")
			});
		},
		_createNode: function(){
			var oData = this.getData();
			var fOnAddNew = this._getHandler("add");
			var sHtml = this.getHtml(oData);
			this._node = jQuery(sHtml);
			this._beatCard = this._createBeatSelector();
			this._node.find(".beatCard").append(this._beatCard.getNode().get(0));
			this._attachEvents(this._node);
			return this._node;
		},
		_getColorPickerHtml: function(){
			var aThemes = this.getCore().getThemes();
			var sHtml = "";
			aThemes.forEach(function(sColor){
				sHtml += "<div class='colorCode "+ sColor + "' data-color='"+ sColor + "'></div>"
			});
			return "<div class='colorPicker'><div class='colorPickerContainer'>"+ sHtml +"</div>"+
			"<div class='colorPickerPopupArrow'></div></div>" ;
		},
		getHtml: function(oData){
			var isEditable = this.getEditable();
			var isEditableClass = isEditable? "isEditable" : "";
			var size = this.getSize();
			var indexNumberStyle = this._showIndex ? " " : "display:none";
			var sizeClass = (size == "default") ? "" : "size" + size.toUpperCase();
			var actClass = (oData.act!= "-1") ? "_act"+oData.act : "_actNone";
			var html = "<div id='card_"+oData.id+"' class='indexCard " + isEditableClass + " "+ sizeClass + " "+oData.color + " "+ actClass+"'>"+
						"<div class='indexCardTitle' contentEditable=" + isEditable + ">" + 
							this.getCore().sanitizeHtml(oData.title) + "</div>" +
						"<div class='icon info'></div>" +
						"<div class='indexCardBg'></div>" +
						"<textarea class='indexCardContent' contentEditable=" + isEditable + ">" + oData.content + "</textarea>" +
						"<div class='indexCardNumber' style='" + indexNumberStyle + "'>#" + (oData.index + 1 )+ "</div>" +
						"<div class='indexCardPgTarget'>" + oData.pgTarget + ((oData.pgTarget) > 1 ? " PAGES" : " PAGE") + "</div>" +
						"<div class='indexCardAct'>" + (((oData.act == "undefined") || (oData.act == -1) )? "" : "ACT " + oData.act) + "</div>" +
						"<div class='indexCardFooter'>" +
						"<div class='indexCardColumn'><div class='icon currentColor'></div></div>" +
						"<div class='indexCardColumn'><div class='icon tag'></div></div>" +
						"<div class='indexCardColumn'><div class='icon move'></div></div>"+
						"<div class='indexCardColumn'><div class='icon popout'></div></div>"+
						"<div class='indexCardColumn'><div class='icon addCard'></div></div>" +
						"</div>" + this._getColorPickerHtml()+
						"<div class='cardMask'></div><div class='statusBox'></div>" +
						"<div class='indexCardNotes'>" + (oData.notes[0] ? this.getCore().sanitizeHtml(oData.notes.join("<br>")) : "No notes to display") + "</div>" +
						"<div class='beatCard'></div>"+
					"</div>";
			return html;
		},
		getProperty: function(sProp){
			return this["_" + sProp];
		},
		setProperty: function(sProp, val, bRender){
			var propertyClass;
			var tmp;
			if(this._props.indexOf(sProp) > -1){
				if(bRender){
					if(sProp == "color"){
						this._node.removeClass(this.getProperty("color")).addClass(val);
					} else if(sProp == "statusText"){
						this._node.find(".statusBox").text(val);
					} else if(sProp == "notes"){
						this._node.find(".indexCardNotes").html( (val && val[0]) ? this.getCore().sanitizeHtml(val.join("<br>")) : "No notes to display");
					} else if(sProp == "act"){
						tmp = this.getProperty("act");
						this._node.removeClass("_act" + (tmp == "-1" ? "None" : tmp)).addClass("_act" + (val==-1 ? "None" : val));
						this._node.find(".indexCardAct").html(((val == undefined) || (val == -1))? "" : "ACT " + val);
					} else if(sProp == "pgTarget"){
						this._node.find(".indexCardPgTarget").html(((val == undefined) || (val == -1))? "" : (val > 1 ? val + " PAGES" : val + " PAGE"));
					}else if(sProp == "beat"){
						this._beatCard.setValue(val, true); // second parameter true, so that the onchange handler of the selector isn't called.
					}else if(sProp == "content"){
						this._node.find(".indexCardContent").val(val);
					}else {
						this._node.find(".indexCard" + (sProp == "title"? "Title" : "Number")).html(this.getCore().sanitizeHtml(val));
					}
					
				}
			this["_" + sProp] = val;
			this.getCore().fireEvent("dataChange");				
			}
			return this;
		},
		getNode: function(bUnsetCss){
			return bUnsetCss? this._node.css({top: "", left: "", opacity: ""}) : this._node;
		},
		getNewNode: function(){
			return this._createNode();
		},
		getNodeReference: function(){
			return this._node;
		},
		getData: function(){
			return {
				title: this._title,
				content: this._content,
				index: this._index,
				color: this._color,
				statusText: this._statusText,
				id: this._id,
				tags: this._tags,
				meta: this._meta,
				notes: this._notes,
				act: this._act,
				pgTarget: this._pgTarget,
				beat: this._beat
			}
		},
		show: function(){
			this._node.show();
			return this;
		},
		hide: function(){
			this._node.hide();
			return this;
		},
		setFocus: function(bIsFocus){
			this._node[bIsFocus ? "addClass" : "removeClass"]("inFocus");
			this._isFocus = bIsFocus;
			return this;
		},
		getFocus: function(){
			return this._isFocus;
		},
		toggleFocus: function(){
			this._node.toggleClass("inFocus");
			return this;
		},
		setHightLight: function(){
			jQuery(".indexCard").removeClass("cardHighlight");
			this.getNodeReference().addClass("cardHighlight");
		},
		hasText: function(sText){
			sText = sText.toLowerCase();
			var titleLower = this._title.toLowerCase();
			var contentLower = this._content.toLowerCase();
			var tagsLower = (this._tags + "").toLowerCase();
			return ((titleLower.search(sText) > -1 ) || 
						(contentLower.search(sText) > -1 ) || (this._color.search(sText) > -1 ))
						||(tagsLower.search(sText) > -1);
		},
		_attachEvents: function(oNode){
			var that = this;
			var bIndex = this._index;
			var colorPicker = oNode.find(".colorPicker");
			var currentColor = "blue";
			
			var fOnAddNew = this._getHandler("add");
			var fOnDelete = this._getHandler("delete");
			var fOnClick = this._getHandler("click");
			var fOnPopout = this._getHandler("popout");
			var notesPane = oNode.find(".indexCardNotes");
			
			oNode.find(".indexCardTitle").focusout(function(){
				that._setIsDirty("title", true);
				that._onTitleChange(this.innerText, false);
				oNode.find(".icon.info").css({display:""});
				
			}).focusin(function(){
				if(that._getIsDirty("title")){
					
				} else {
					that._setIsDirty("title");
					that.setProperty("title", "", true);
				}
				oNode.find(".icon.info").css({display:"none"});
			});
			oNode.find(".indexCardTitle,.indexCardContent").on("paste", function(e){
				
				
			});
			
			oNode.find(".indexCardContent").focusout(function(){
				that._onContentChange(this.value);
			}).focusin(function(){
				if(that._getIsDirty("content")){
					
				} else {
					that._setIsDirty("content", true);
					that.setProperty("content", "", true);
				}
			});
			oNode.find(".addCard").click(function(){
				fOnAddNew(bIndex + 1);
			});
			oNode.find(".delete").click(function(){
				fOnDelete(bIndex);
			});
			oNode.find(".move").mousedown(function(e){
				that.getCore().setDragStart(that,e)
			});
			oNode.find(".currentColor").click(function(){
				colorPicker.toggleClass("isVisible");
			});
			oNode.find(".popout").click(function(){
				fOnPopout(that);
			});
			oNode.find(".colorCode").click(function(){
				var color = this.getAttribute("data-color");
				that.setProperty("color", color, true);
				colorPicker.toggleClass("isVisible");
			});
			oNode.find(".cardMask").click(function(){
				//that.toggleFocus();
				fOnClick(that, bIndex);
			});
			oNode.find(".icon.tag").click(function(e){
				e.stopPropagation();
				that.getCore().openPopup(that, that.getProperty("tags"));
			});
			oNode.find(".icon.info").on("click", function(e){
				notesPane.toggleClass("isVisible");
			});
			this._beatCard.attachOnChange(function(key,index, value){
					that.setProperty("beat", key, false);
			});
			
		},
		_onTitleChange: function(sValue, bRender){
			this.setProperty("title", sValue, bRender);
		},
		_onContentChange: function(sValue, bRender){
			this.setProperty("content", sValue, bRender);
		},
		getClone: function(){
			var cloneHtml = this.getHtml(this.getData());
			var cloneNode = jQuery(cloneHtml);
			cloneNode.addClass("proxyCard");
			return cloneNode;
		},
		_getDefaultData: function(nIndex){
				return {
					id: this.generateId(),
					title: "", //"Type a title",
					content:"", //"Type description",
					index: nIndex || 0,
					color: "blue",
					statusText: "",
					tags: [],
					notes: [],
					meta: "{}",
					act: "1",
					pgTarget: "1",
					beat: "NONE"
				};
			
		},
		_prepareData: function(oData){
			var oDefaultData = this._getDefaultData();
			var cur;
			for(var each in oDefaultData){
				oData[each] = oData[each] || oDefaultData[each];
			}
			return oData;
		},
		isCoordinatesInside: function(eX, eY){
			var marginT = parseInt(this._node.css("margin-top"));
			var marginL = parseInt(this._node.css("margin-left"));
			var offset = this._node.offset();
			var h = this._node.height();
			var w = this._node.width();
			return ((eX <= offset.left + marginL + w) && (eY <= offset.top + h + marginT));
		}
	}	
})();