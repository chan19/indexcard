(function(){
	var aBeatConfig = ["Opening", "Introduce Protag", "Introduce Antag", "Introduce Stakes", "Inciting incident", "Call to hero",
	"Second Act", "Plot B", "New Characters", "Mid Point", "Low point", "Climax", "Beginning of the End", "Finale"]
	
	
	Beat = function(aBeat){
		this.init(aBeat);
	}
	Beat.prototype = {
		init: function(aBeat){
			this._setBeats(aBeat);
			this._addGlobalListeners();
		},
		_oBeatObject: {},
		_currentSelected: null,
		_setBeats: function(aBeat, bRender){
			this._aBeat = aBeat;
		},
		getDataToSave: function(){
			return this._oBeatObject;
		},
		_getHtml: function(aBeat){
			var sHtml = "";
			aBeat.forEach(function(c, i){
				sHtml += "<div class='beatItem' data-beat='" + c.key + "'>"+c.value+"</div>"
				
			});
			return "<div class='beatContainer'><div class='beatContainerHeader'>Beats</div>" +
					"<div class='beatContainerBody'>" + 
						"<div class='beatlist'>" + sHtml + "</div>" +
						"<div class='beatDetailsPane'>" +
							"<div class='beatDetailsPanel'>" + 
							"<div class='beatDetailsLabel'>Beat title</div>" +
							"<div id='beatItemTitle' class='beatDetailsValue' contenteditable=true></div></div>" +
							"<div class='beatDetailsPanel'>" + 
							"<div class='beatDetailsLabel'>Beat Description</div>" +
							"<textarea id = 'beatItemDesc' class='beatDetailsValue largeField' contenteditable=true></textarea></div>" +
						"</div>"+
					"</div>"+
					"</div>";
			
		},
		_attachEvents: function(){
			var that = this;
			var aBeatItem = this._node.find(".beatItem");
			var selectedBeatIndex;
			aBeatItem.on("click", function(){
			});
		},
		_addGlobalListeners: function(){
			return;
			var that = this;
			appManager.listenTo("pageChange", function(data){

			});
			appManager.listenTo("afterCardDelete", function(oData){
			});
		},
		getNode: function(){
			return this._createNode();
			
		},
		_createNode: function(){
			var sHtml = this._getHtml(this._aBeat);
			this._node = jQuery(sHtml);
			this._attachEvents();
			return this._node;
		},
		getNodeReference: function(){
			return this._node;
		},
		toggle: function(){
			this._node.toggleClass("isVisible");
		},
		hide: function(){
			this._node.find(".beatItem").removeClass("selected");
			this._node.removeClass("isVisible");
			this._currentSelected = null;
		},
		show: function(){
			jQuery("#blocker").show();
			this._node.addClass("isVisible");
		}
	}
	
	
})();