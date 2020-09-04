(function(){
	LargeEditor = function(oConfig){
		this.init(oConfig);
	
	}
	LargeEditor.prototype = {
		_isOpen: false,
		init: function(oConfig){
			this._createNode();
			this._attachEvents(oConfig.onSave, oConfig.onPrev, oConfig.onNext);
			this._addGlobalListeners();
		},
		_owner: null,
		_curColor: "blue",
		getCore: function(){
			return appManager;
		},
		getOwner: function(){
			return this._owner;
		},
		setOwner: function(o){
			this._owner = o;
			return this;
		},
		setData: function(o){
			var oData = this._getProcessedData(o);
			this._node.find(".largeEditorHeader").html(oData.header);
			this._node.find("#plotpointTitle").html(oData.title);
			this._node.find("#plotpointDesc").val(oData.desc);
			this._locationTypeSel.setValue(oData.locationType);
			this._timeSel.setValue(oData.time);
			this._actSel.setValue(oData.act);
			this._node.find("#largeEditorInp1").val(oData.location).trigger("change");
			this._node.find(".plotpointNote").val(oData.notes[0] || "");
			this._node.removeClass(this._curColor).addClass(oData.color);
			this._curColor = oData.color;
			this._locationType = oData.locationType;
			this._time = oData.time;
			return this;	
		},
		open: function(oCard){
			jQuery("#blocker").show();
			this._node.show();
			this._isOpen = true;
			this._owner = oCard;
			return this;
		},
		close: function(){
			var that = this;
			this._isOpen = false;
			this.setOwner(false);
			this._node.hide();
			jQuery("#blocker").hide();
			return this;
		},
		_getColorPickerHtml: function(){
			var aThemes = this.getCore().getThemes();
			var sHtml = "";
			aThemes.forEach(function(sColor){
				sHtml += "<div class='colorCode "+ sColor + "' data-color='"+ sColor + "'></div>"
			});
			return "<div class='colorContainer largeEditorFieldContainer'><div class='currentColor'></div>"+
					"<div class='colorPicker'><div class='colorPickerContainer'>"+ sHtml +"</div>"+
					"<div class='colorPickerPopupArrow'></div></div></div>" ;
		},
		_getDropdown: function(sId, oVal){
			var s = "";
			for(var each in oVal){
				s+= "<option value='" + each + "'>" + oVal[each] + "</option>";
			}
			return "<select id='" + sId + "' class='largeEditorSelect'>" + s + "</select>";
		},
		_getCustomDropdown: function(sId, aList, sDefaultText){
			var d = new Dropdown({
				id: sId,
				defaultText: sDefaultText,
				onChange: function(k,i, v){

				},
				list: aList
			});
			return d;
		},
		_getLocationBox: function(){
			return "<div class = 'largeEditorSearchBox largeEditorFieldContainer'><div class='placeholder'>Location (optional)</div><input id='largeEditorInp1'><div class='largeEditorSuggestionBox'></div></div>";
		},
		getHtml: function(){
			
			//var locationSel= "<select id='largeEditorSel1' class='largeEditorSelect'><option value=-1>INT/EXT</option><option value=0>INT</option><option value=1>EXT</option></select>";
			//var timeSel = "<select id='largeEditorSel2' class='largeEditorSelect'><option value=-1>DAY/NIGHT</option><option value=0>DAY</option><option value=1>NIGHT</option></select>";
			return "<div id='largeEditor' class='largeEditor'>" +
				"<div class='largeEditorHeader'></div>" +
				"<div class='largeEditorBody'>" +
					"<div class='largeEditorPanel'><div class='largeEditorFieldContainer field1'></div>" +  this._getLocationBox() +  "<div class='largeEditorFieldContainer field2'></div>" + 
						this._getColorPickerHtml() + "<div class='largeEditorFieldContainer field3'></div></div>" +
					"<div class='largeEditorPanel'>" + 
					"<div class='editorLabel'>Plot point title</div>" +
					"<div id='plotpointTitle' class='editorValue' contenteditable=true></div></div>" +
					"<div class='largeEditorPanel'>" + 
					"<div class='editorLabel'>Plot point description</div>" +
					"<textarea id = 'plotpointDesc' class='editorValue largeField' contenteditable=true></textarea></div>" +
					"<div class='largeEditorPanel'>" + 
					"<div class='editorLabel'>Additional Notes</div>" +
					"<textarea class='plotpointNote editorValue largeField' contenteditable=true></textarea></div>" +
				"</div>" +
				"<div class='largeEditorFloatingIcon prev'><</div><div class='largeEditorFloatingIcon next'>></div>" +
				"<div class='largeEditorButtonPane'>" +
					"<div class='largeEditorIcon prev'><</div>" +
					"<div class='largeEditorIcon next'>></div>" +
					"<button class='largeEditorButton cancel'>CANCEL</button>" +
					"<button class='largeEditorButton save'>SAVE</button>" +
				"</div>" +
			"</div>"
		},
		_createNode: function(){
			this._node = jQuery(this.getHtml());
			this._locationTypeSel= this._getCustomDropdown("largeEditorSel1",[{
				key: "0",
				value: "INT"
			},{
				key: "1",
				value: "EXT"
			}], "INT/EXT");
			this._timeSel = this._getCustomDropdown("largeEditorSel2", [{
				key: "0",
				value: "DAY"
			},{
				key: "1",
				value: "NIGHT"
			}], "DAY/NIGHT");
			this._actSel = this._getCustomDropdown("largeEditorSel3",[{
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
			},{
				key: "-1",
				value: "NONE"
			}], "ACT");
			this._node.find(".field1").append(this._locationTypeSel.getNode().get(0));
			this._node.find(".field2").append(this._timeSel.getNode().get(0));
			this._node.find(".field3").append(this._actSel.getNode().get(0));
			return this;
		},
		render: function(sId){
			jQuery("#" + sId).append(this._node);
			return this;
			
		},
		_attachEvents: function(fOnSave, fOnPrev, fOnNext){
			var that = this;
			var inputPlaceholder = this._node.find(".placeholder");
			var colorPicker =this._node.find(".colorPicker");
			this._node.find(".cancel").click(function(){
				that.close();
			});
			this._node.find(".save").click(function(){
				fOnSave.call(that, that._getValuesFromFields());
				that.close();
			});
			this._node.find(".prev").click(function(){
				fOnPrev.call(that, that._getValuesFromFields());
			});
			this._node.find(".next").click(function(){
				fOnNext.call(that, that._getValuesFromFields());
			});
			this._node.find(".currentColor").click(function(){
				colorPicker.toggleClass("isVisible");
			});
			this._node.find(".colorCode").click(function(){
				var color = this.getAttribute("data-color");
				that._node.removeClass(that._curColor).addClass(color);
				that._curColor = color;
				colorPicker.toggleClass("isVisible");
			});
			this._node.find("#largeEditorInp1").on("focusin", function(){
				inputPlaceholder.hide();
			}).on("focusout", function(){
				inputPlaceholder[(this.value== "") ? "show" : "hide"]();
			}).on("change",function(){
				inputPlaceholder[(this.value== "") ? "show" : "hide"]();
			});
			this._node.find(".largeField").on("keyup", function(e){
				if(e.keyCode == 13){
					var curPos = this.selectionStart;
					//console.log(this.value.substring(0,curPos));
					var aNum = this.value.substring(0, curPos).match(/(^|\n|\r)[0-9]+\./gi);
					var nextNum;
					if(aNum){
						nextNum = parseInt(aNum.pop()) + 1;
						this.value = this.value.substring(0,curPos-1) + "\n" + nextNum + ". " +
										this.value.substring(curPos, this.value.length);
						this.focus();
						this.setSelectionRange(curPos+3, curPos+3);
					}
				}
			});
		},
		_addGlobalListeners: function(){
			var that = this;
			var leftArrow = this._node.find(".prev");
			var rightArrow = this._node.find(".next");
			appManager.listenTo("escPress", function(data){
				that.close();
			});
			appManager.listenTo("leftArrowPress", function(data){
				//if(that._isOpen) leftArrow.trigger("click");
			});
			appManager.listenTo("rightArrowPress", function(data){
				//if(that._isOpen) rightArrow.trigger("click");
			});
		},
		_getValuesFromFields: function(){
			return {
				title:this._node.find("#plotpointTitle")[0].innerText,
				content:this._node.find("#plotpointDesc")[0].value,
				color: this._curColor,
				notes: [this._node.find(".plotpointNote")[0].value],
				act: this._actSel.getValue(),
				meta: {
					locationType: this._locationTypeSel.getValue(),
					time: this._timeSel.getValue(),
					location: this._node.find("#largeEditorInp1").val()
				}
			}
		},
		_getProcessedData: function(o){ 
			var that = this;
			var meta = o.meta || {
				locationType: -1,
				time: -1,
				location: ""
			};
			var locationType = meta.locationType;
			var time = meta.time;
			var tmp;
			var aNote = o.notes || [];
			var aNote2 = [];
			
			aNote.forEach(function(sNote, i){
				aNote2[i] = sNote ? sNote.replace(/<br>/gi, "\n") :  "" ;//that.getCore().sanitizeHtml(sNote || "");
			});
			
			if(locationType == undefined){
				tmp = (((o.title+"").toUpperCase().match(/^((INT|EXT)(\.|\-| |\n|\r))|((\.|\-| )(INT|EXT))/gi)) + "");
				locationType = (tmp == "null") ? -1 : (tmp.search("INT") > -1 ? "0" : "1");
			}
			if(time == undefined){
				tmp = ((o.title+"").toUpperCase().match(/((\.|\-| )(DAY|NIGHT))/gi) + "");
				time = (tmp == "null") ? -1 : (tmp.search("DAY") > -1 ? "0" : "1");
			}
			return {
				header: (o.index + 1) + ". " + (o.title.length > 60? o.title.substr(0,60) + "..." : o.title),
				title: o.title,
				desc: o.content, //this.getCore().sanitizeHtml(o.content),
				color: o.color,
				locationType: locationType + "",
				time: time+ "",
				notes: aNote2,
				location: meta.location || "",
				act: o.act || "-1"
			};
		}
	}
})();