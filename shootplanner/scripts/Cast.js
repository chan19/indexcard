var Cast = (function() {
	
	return {
        init: function(oConfig) {
            var oData = oConfig.data || {};
            this.setData(oData);
            return this;
        },
        _isRendered: false,
        _props: ["id", "name", "actor", "contact", "notes"],

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
					var tmp = jQuery("<div class='castItem itemPane noneditable' data-id='" + cur.id + "' data-index='" + i + "'>" + "<input class='castItemTitle itemPaneHeader formDialogInput' placeholder='Character name' readonly value='" + cur.name + "'>" + "<div class='itemPaneBody'>" + "<div class='castItemActor itemPaneRow'>" + "<input class='itemRowValue formDialogInput' readonly value='" + cur.actor + "' placeholder='Actor name'>" + "</div>" + "<div class='castItemContact itemPaneRow'>" + "<input class='itemRowValue formDialogInput' readonly value='" + cur.contact + "' placeholder='Contact details' style='display:" + (cur.contact ? "initial" : "none") + "'>" + "</div>" + "<div class='castItemType itemPaneRow'>" + "</div>" + "<div class='castItemNotes itemPaneRow'>" + "<textarea class='itemRowSingle formDialogInput' style='display:" + (bShowNotes ? "initial" : "none") + "' resize=none placeholder='Add notes' rows='4'>" + (cur.notes || "") + "</textarea>" + "</div></div>" + "<div class='floatingButtonPane'>" +
					"<div class='actionButton edit'></div><div class='actionButton ok'></div></div>" + "</div>");
					var id = cur.id;
					var nameNode = tmp.find(".castItemTitle");
					var actorNode = tmp.find(".castItemActor input");
					var contactNode = tmp.find(".castItemContact input");
					var notesNode = tmp.find(".castItemNotes textarea");
					var characterTypeNode = new Dropdown({
						defaultText: "Primay/ Secondary Character",
						autofit: true,
						value: cur.type,
						visible: (cur.type !== null && cur.type !== undefined && cur.type !== ""),
						onChange: function(k, i, v) {
							
						},
						editable: false,
						list: [{
							key: "PRIMARY",
							value: "Primary character"
						}, {
							key: "SECONDARY",
							value: "Secondary character"
						}]
					});				
				
				tmp.find(".castItemType").append(characterTypeNode.getNode());
				tmp.find(".edit").on("click", function(){
					 that.setItemEditable(tmp, true, characterTypeNode);
				});
				tmp.find(".ok").on("click", function(){
					 var oData = {
						 id: id,
						name: nameNode.val(),
						actor: actorNode.val(),
						contact: contactNode.val(),
						notes: notesNode.val(),
						type: characterTypeNode.getValue()
					};
					that.getCore().setDataToModel("CAST", oData);
					 that.setItemEditable(tmp, false, characterTypeNode);
				});
				tmpNode.append(tmp);
				})();
            }
            return tmpNode.children();
        },
        _createNode: function() {
            var that = this;
            var oData = this.getData();
            this._node = jQuery("<div id='castDialog' class='formDialog'><div class='formDialogHeader'>Cast</div>" + "<div class='formDialogBody'></div>" + "<div class='formDialogFooter'><button id='castAdd' class='formDialogButton button'>Add new Character</button>" + "<button class='formDialogButton button closeButton'>Close</button></div></div>");
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
			this.getNode().find(".itemPane").last().find(".edit").click();
            return this;

        },
        getNode: function() {
            if (!this._node) {
                this._createNode();
            }
            return this._node;
        },
        setItemEditable: function(oListItemNode, bEditable, oDropDown) {
			if(bEditable){
				oListItemNode.addClass("editable").removeClass("noneditable").find(".formDialogInput").attr('readonly', false).show().addClass("editable");
				oListItemNode.find(".floatingButtonPane .actionButton.ok").show();
				oDropDown.setVisible(true).setEditable(true);
				oListItemNode.find(".castItemTitle").focus();
			} else {
				oListItemNode.removeClass("editable").addClass("noneditable").find(".formDialogInput").attr('readonly', true).removeClass("editable").each(function(a,b){
					var node = jQuery(b);
					node[node.val() ? "show" : "hide"]();				
				});
				oDropDown.setVisible(!(oDropDown.getValue() === null || oDropDown.getValue() === undefined)).setEditable(false);
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
            this._node.find("#castAdd").on("click", function() {
                that.addEntry();
            });
        }

    }
}
)();
