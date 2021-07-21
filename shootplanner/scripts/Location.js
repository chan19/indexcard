var Location = (function() {
	
	return {
        init: function(oConfig) {
            var oData = oConfig.data || {};
            this.setData(oData);
            return this;
        },
        _isRendered: false,
        _props: ["id", "name", "place", "contact", "notes"],
        getCore: function() {
            return appManager;
        },
        _data: [],
        setData: function(oData, bSuppressRender, bTriggerEvent) {
            this._data = oData;
            if (this._isRendered) {
            }
            return this;
        },
        getData: function() {
            return this._data;
        },
        setProperty: function(sProp, oData, bSuppressRender, bTriggerEvent) {
        },
        open: function() {
            this._node.show();
            jQuery("#blocker").show();
        },
        close: function() {
            this._node.hide();
            jQuery("#blocker").hide();
        },
        _getListNodes: function(oData) {
			var that = this;
            var html = "";
            var i = -1;
            var bShowNotes = false;
			var tmpNode = jQuery("<div></div>");
			var tmpDropDown;
            for (var each in oData) {
                cur = oData[each];
                i++;
                if (cur.notes) {
                    bShowNotes = true;
                }
				(function(){
					var tmp = jQuery("<div class='locationItem itemPane noneditable' data-id='" + cur.id + "' data-index='" + i + "'>" + "<input class='locationItemTitle itemPaneHeader formDialogInput' placeholder='Location title' readonly value='" + cur.name + "'>" + "<div class='itemPaneBody'>" + "<div class='locationItemPlace itemPaneRow'>" + "<input class='itemRowValue formDialogInput' readonly value='" + cur.place + "' placeholder='Place name'>" + "</div>" + "<div class='locationItemContact itemPaneRow'>" + "<input class='itemRowValue formDialogInput' readonly value='" + cur.contact + "' placeholder='Contact details'>" + "</div>" + "<div class='locationItemType itemPaneRow'>" + "</div>" + "<div class='locationItemNotes itemPaneRow'>" + "<textarea class='itemRowSingle formDialogInput' style='display:" + (bShowNotes ? "initial" : "none") + "' resize=none placeholder='Add notes' rows='4'>" + (cur.notes || "") + "</textarea>" + "</div></div>" + "<div class='floatingButtonPane'>" +
					"<div class='actionButton edit'></div><div class='actionButton ok'></div></div>" + "</div>");
					
					
					var id = cur.id;
					var nameNode = tmp.find(".locationItemTitle");
					var placeNode = tmp.find(".locationItemPlace input");
					var contactNode = tmp.find(".locationItemContact input");
					var notesNode = tmp.find(".locationItemNotes textarea");			
				tmp.find(".edit").on("click", function(){
					 that.setItemEditable(tmp, true);
				});
				tmp.find(".ok").on("click", function(){
					 var oData = {
						id: id,
						name: nameNode.val(),
						place: placeNode.val(),
						contact: contactNode.val(),
						notes: notesNode.val()
					};
					that.getCore().setDataToModel("LOCATION", oData);
					 that.setItemEditable(tmp, false);
				});
				tmpNode.append(tmp);
				})();
            }
            return tmpNode.children();
        },
        _createNode: function() {
            var that = this;
            var oData = this.getData();
            this._node = jQuery("<div id='locationDialog' class='formDialog'><div class='formDialogHeader'>Location</div>" + "<div class='formDialogBody'></div>" + "<div class='formDialogFooter'><button id='locationAdd' class='formDialogButton button'>Add new location</button>" + "<button class='formDialogButton button closeButton'>Close</button></div></div>");
			this._node.find(".formDialogBody").append(this._getListNodes(oData));
            this._attachEvents(this._node);
            return this;
        },
        refresh: function() {
            var aNode = this._getListNodes(this.getData());
            this.getNode().find(".formDialogBody").html(aNode);
            return this;
        },
        addEntry: function(oData) {
            oData = oData || {
                id: "LOC_" + Date.now(),
                name: "",
                place: "",
                contact: "",
                notes: ""
            };
            var data = this.getData();
            data[oData.id] = oData;
            this.setData(data);
            this.refresh();
			this.getNode().find(".itemPane").last().find(".edit").click();
            return this;

        },
        getNode: function() {
            if (!this._node) {
                this._createNode();
            }
            return this._node;
        },
        setItemEditable: function(oListItemNode, bEditable) {
			if(bEditable){
				oListItemNode.addClass("editable").removeClass("noneditable").find(".formDialogInput").attr('readonly', false).show().addClass("editable");
				oListItemNode.find(".floatingButtonPane .actionButton.ok").show();
				oListItemNode.find(".locationItemTitle").focus();
			} else {
				oListItemNode.removeClass("editable").addClass("noneditable").find(".formDialogInput").attr('readonly', true).removeClass("editable").each(function(a,b){
					var node = jQuery(b);
					node[node.val() ? "show" : "hide"]();				
				});
				oListItemNode.find(".floatingButtonPane .actionButton.ok").hide();
			}
			
			return this;
        },
        render: function(sId) {
            jQuery("#" + sId).append(this.getNode());
            return this;
        },
        _addGlobalListeners: function() {
            var that = this;
        },
        _attachEvents: function() {
            var that = this;
            this._node.find(".closeButton").on("click", function() {
                that.close();
            });
            this._node.find("#locationAdd").on("click", function() {
                that.addEntry();
            });
        }

    }
}
)();
