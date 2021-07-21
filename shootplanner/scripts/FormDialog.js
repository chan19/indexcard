var Cast = (function() {
	
	return {
        init: function(oConfig) {
            var oData = oConfig.data || {};
			this._initializeProps(oConfig.props);
            this.setData(oData);
            return this;
        },
        _isRendered: false,
		_metadata: {
			types: {
				id: "text",
				selection: "dropdown",
				input: "input",
				largeInput: "textarea",
				header: "input"
			}
		}
        _props: [],
		_initializeProps: function(oProp){
			/*
				oProp = {
					name: {
						type: "header", // input/textarea/header/text/
						value: "defaultvalue",
						placeholder: "placeholderValue",
						editable: boolean
						events: {
							onchange: function(){
								
							}
						},
						list: [] // for type selection lift of values
					}
				}
			
			*/
			for(var each in oProp){
				this._props.push(each);
			}
		},
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
		_getItemNode: function(sProp, sValue, oMetadata, editButton, okButton){
			var node  = "";
			var displayStyle = (sValue === "" ||sValue === undefined || sValue === null) ? "style='display:none'" : "";
			switch(oMetadata.type){
				case "header" : ;
							break;
				case "input"  : node =	jQuery("<div class='itemPaneRow " +sProp+ "Row'>" + "<input class='itemRowValue formDialogInput' readonly value='" + sValue + "' placeholder='" + oMetadata.placeholder+ "'" + displayStyle + "></div>");
								editButton.on("click", function(){
									node.find("input").attr('readonly', false).addClass("editable");
								});
								okButton.on("ok", function(){
									node.find("input").attr('readonly', true).removeClass("editable");
								});
							break;
				case "largeInput" : node = jQuery("<div class='itemPaneRow " +sProp+ "Row'>" + "<textarea class='itemRowValue formDialogLargeInput' readonly placeholder='" + oMetadata.placeholder+ "'" + displayStyle + ">" + sValue + "</textarea></div>");
												editButton.on("click", function(){
									node.find("input").attr('readonly', false).addClass("editable");
								});
								okButton.on("ok", function(){
									node.find("input").attr('readonly', true).removeClass("editable");
								});
							break;
				case "selection"  :	var tmp = new Dropdown({
						defaultText: oMetadata.placeholder,
						onChange: oMetadata.events.onChange,
						editable: oMetadata.editable,
						list: oMetadata.list
					});
													editButton.on("click", function(){
									tmp.setEditable(true);
								});
								okButton.on("ok", function(){
									tmp.setEditable(false):
								});
					node = tmp.getNode();
							break;
			
			return node;

		},
        _getListNodes: function(sProp, oData) {
			var that = this;
            var html = "";
            var i = -1;
            var bShowNotes = false;
			var tmpNode = jQuery("<div></div>");
			var tmpDropDown;
			var aMetadata = this.getMetadata(sProp);
			var sHtml ="";
			var itemNode;
			var rowNode;
			var sProp;
			var editButton, okButton;
            for (var each in oData) {
                cur = oData[each];
                i++;
				(function(){
					editButton = tmp.find(".edit");
					okButton = tmp.find(".ok");
					itemNode = jQuery("<div class='castItem itemPane noneditable' data-id='" + cur.id + "' data-index='" + i + "'>" + "<input class='castItemTitle itemPaneHeader formDialogInput' placeholder='Character name' readonly value='" + cur.name + "'>" + "<div class='itemPaneBody'></div>" + "<div class='floatingButtonPane'><div class='actionButton edit'></div><div class='actionButton ok'></div></div></div>");
					
					for(var i = 0, l = aMetadata.length; i < l; i++){
						sProp = aMetadata[i].name
						rowNode = that._getItemNode( sProp, cur[sProp], aMetadata[i], editButton, okButton );
						itemNode.append(rowNode);
					}
					tmp.find(".edit").on("click", function(){
						 that.setItemEditable(tmp, true, tmpDropDown);
					});
					tmp.find(".ok").on("click", function(){
						 that.setItemEditable(tmp, false, tmpDropDown);
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
				oListItemNode.addClass("editable").removeClass("noneditable").find(".formDialogInput").attr('readonly', false).addClass("editable");
				oListItemNode.find(".floatingButtonPane .actionButton.ok").show();
				oListItemNode.find(".castItemTitle").focus();
			} else {
				oListItemNode.removeClass("editable").addClass("noneditable").find(".formDialogInput").attr('readonly', true).removeClass("editable");
				oListItemNode.find(".floatingButtonPane .actionButton.ok").hide();
			}
			oDropDown.setEditable(bEditable);
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
