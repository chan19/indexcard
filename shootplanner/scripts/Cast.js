var Cast = (function(){
	return {
			
		init: function(oConfig){
			var oData = oConfig.data || {};
			this.setData(oData);
			return this;
		},
		_isRendered: false,
		_props: ["id", "name", "actor", "contact", "notes"],

		getCore: function(){
			return appManager;
		},
		_data: [],
		setData: function(oData, bSuppressRender, bTriggerEvent){
			this._data = oData;
			if(this._isRendered){
				
			}
			return this;
		},
		getData: function(){
			return this._data;
		},
		setProperty: function(sProp, oData,bSuppressRender, bTriggerEvent ){
			
		},
		open: function(){
			this._node.show();
			jQuery("#blocker").show();
		},
		close: function(){
			this._node.hide();
			jQuery("#blocker").hide();
		},
		_getListHtml : function(oData){
			var html = "";
			var i = -1;
			var bShowNotes = false;
			for(var each in oData){
				cur = oData[each];
				i++;
				if(cur.notes){
					bShowNotes = true;
				}
				html += "<div class='castItem itemPane' data-id='" + cur.id + "' data-index='" + i + "'>"+
							"<input class='castItemTitle itemPaneHeader formDialogInput' value='" +cur.name + "'>" + 
							"<div class='itemPaneBody'>" +
								"<div class='castItemActor itemPaneRow'>" +
									//"<div class='itemRowLabel'>Actor</div>" + 
									"<input class='itemRowValue formDialogInput' readonly value='" + cur.actor+"'>" +
								"</div>" +
								"<div class='castItemContact itemPaneRow'>" +
									//"<div class='itemRowLabel'>Contact</div>" + 
									"<input class='itemRowValue formDialogInput' readonly value='" + cur.contact + "'>" + 
								"</div>" +
								"<div class='castItemNotes itemPaneRow' style='display:"+ (bShowNotes ? "initial" : "none")+ "'>" +
									"<div class='itemRowSingle'>" + (cur.notes || "") + "</div>"+ 
								"</div>" +
								"<div class='itemPaneRow edit'>edit</div>" +
							"</div>"+
						"</div>";
			}
			return html;
		},
		getHtml: function(oData){
			var html = "<div id='castDialog' class='formDialog'><div class='formDialogHeader'>Cast</div>" +
					"<div class='formDialogBody'>" + this._getListHtml(oData) + "</div>"+
					"<div class='formDialogFooter'><button id='castAdd' class='formDialogButton button'>Add new Character</button>" + "<button class='formDialogButton button closeButton'>Close</button></div></div>";
			return html;
		},
		refresh: function(){
			var html = this._getListHtml(this.getData());
			this.getNode().find(".formDialogBody").html(html);
			return this;
		},
		addEntry: function(oData){
			oData = oData || {
				id: "CAST_" + Date.now(),
				name: "",
				actor: "",
				contact: "",
				notes: ""
			};
			var data = this.getData();
			data[oData.id] = oData;
			this.setData(data);
			this.refresh();
			return this;
			
		},
		getNode: function(){
			if(!this._node){
				this._createNode();
			}
			return this._node;
		},
		setItemEditable: function(oListItemNode, bEditable){
			oListItemNode[bEditable ? "addClass" : "removeClass"]("editable").find(".formDialogInput").attr('readonly', bEditable)[bEditable ? "addClass" : "removeClass"]("editable");
		},
		_createNode: function(){
			var oData = this.getData();
			this._node = jQuery(this.getHtml(oData));
			this._attachEvents(this._node);
			return this;
		},
		render: function(sId){
			jQuery("#" + sId).append(this.getNode());
			return this;
		},
		_addGlobalListeners: function(){
			var that = this;
		},
		_attachEvents: function(){
			var that = this;
			this._node.find(".closeButton").on("click", function(){
				that.close();
			});
			this._node.find("#castAdd").on("click", function(){
				that.addEntry();
			});
			this._node.on("click", ".edit", function(){
				var node = jQuery(this).parents(".castItem");
				that.setItemEditable(node, !node.hasClass("editable"));
			});
		}
		
		
	}
})();