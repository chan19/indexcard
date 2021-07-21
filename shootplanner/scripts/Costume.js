var Costume = (function() {

    return {
        init: function(oConfig) {
            var oData = oConfig.data || {};
            this.setData(oData);
            return this;
        },
        _isRendered: false,
        _props: ["id", "character", "name", "description", "notes"],

        getCore: function() {
            return appManager;
        },
        _data: [],
        setData: function(oData, bSuppressRender, bTriggerEvent) {
            this._data = oData;
            if (this._isRendered) {}
            return this;
        },
        getData: function() {
            return this._data;
        },
        setProperty: function(sProp, oData, bSuppressRender, bTriggerEvent) {},
        open: function() {
            this._node.show();
            jQuery("#blocker").show();
        },
        close: function() {
            this._node.hide();
            jQuery("#blocker").hide();
        },
        _getCharacterList: function() {
            var characterList = [];
            for (var each in Model.CAST) {
                characterList.push({
                    key: each,
                    value: Model.CAST[each].name
                });
            }
            return characterList;
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
                var characterList = this._getCharacterList();
                (function() {
                    var tmp = jQuery("<div class='costumeItem itemPane noneditable' data-id='" + cur.id + "' data-index='" + i + "'>" + "<input class='costumeItemTitle itemPaneHeader formDialogInput' placeholder='Costume name' readonly value='" + cur.name + "'>" + "<div class='itemPaneBody'>" + "<div class='costumeItemCharacter itemPaneRow'>" + "</div>" + "<div class='costumeItemDesc itemPaneRow'>" + "<input class='itemRowValue formDialogInput' readonly value='" + cur.description + "' placeholder='Costume item description'>" + "</div>" + "<div class='costumeItemNotes itemPaneRow'>" + "<textarea class='itemRowSingle formDialogInput' style='display:" + (bShowNotes ? "initial" : "none") + "' resize=none placeholder='Add notes' rows='4'>" + (cur.notes || "") + "</textarea>" + "</div></div>" + "<div class='floatingButtonPane'>" + "<div class='actionButton edit'></div><div class='actionButton ok'></div></div>" + "</div>");
                    var id = cur.id;
                    var nameNode = tmp.find(".costumeItemTitle");
                    var descNode = tmp.find(".costumeItemDesc input");
                    var notesNode = tmp.find(".costumeItemNotes textarea");

                    var characterNode = new Dropdown({
                        defaultText: "Choose Character",
                        autofit: true,
                        value: cur.character,
                        visible: (cur.character !== null && cur.character !== undefined && cur.character !== ""),
                        onChange: function(k, i, v) {
                        },
                        editable: false,
                        list: characterList
                    });

                    tmp.find(".costumeItemCharacter").append(characterNode.getNode());
                    tmp.find(".edit").on("click", function() {
                        characterNode.setOptions(that._getCharacterList(), characterNode.getValue());
                        that.setItemEditable(tmp, true, characterNode);
                    });
                    tmp.find(".ok").on("click", function() {
                        var oData = {
                            id: id,
                            name: nameNode.val(),
                            character: characterNode.getValue(),
                            description: descNode.val(),
                            notes: notesNode.val()
                        };
                        that.getCore().setDataToModel("COSTUME", oData);
                        that.setItemEditable(tmp, false, characterNode);
                    });
                    tmpNode.append(tmp);
                }
                )();
            }
            return tmpNode.children();
        },
        _createNode: function() {
            var that = this;
            var oData = this.getData();
            this._node = jQuery("<div id='costumeDialog' class='formDialog'><div class='formDialogHeader'>Costume</div>" + "<div class='formDialogBody'></div>" + "<div class='formDialogFooter'><button id='costumeAdd' class='formDialogButton button'>Add new Costume</button>" + "<button class='formDialogButton button closeButton'>Close</button></div></div>");
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
                id: "COSTUME_" + Date.now(),
                name: "",
                character: null,
                description: "",
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
            if (bEditable) {
                oListItemNode.addClass("editable").removeClass("noneditable").find(".formDialogInput").attr('readonly', false).show().addClass("editable");
                oListItemNode.find(".floatingButtonPane .actionButton.ok").show();
                oDropDown.setVisible(true).setEditable(true);
                oListItemNode.find(".costumeItemTitle").focus();
            } else {
                oListItemNode.removeClass("editable").addClass("noneditable").find(".formDialogInput").attr('readonly', true).removeClass("editable").each(function(a, b) {
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
            this._node.find("#costumeAdd").on("click", function() {
                that.addEntry();
            });
        }

    }
}
)();
