(function(){
	var aBeatConfig = ["Opening", "Introduce Protag", "Introduce Antag", "Introduce Stakes", "Inciting incident", "Call to hero",
	"Second Act", "Plot B", "New Characters", "Mid Point", "Low point", "Climax", "Beginning of the End", "Finale"]
	
	
	Beat = function(){
		this.init();
	}
	Beat.prototype = {
		init: function(){
			this._setBeats();
			this._addGlobalListeners();
		},
		_oBeatObject: {},
		_currentSelected: null,
		_setBeats: function(oBeat, bRender){
			var o = {};
			if(oBeat){
				aBeatConfig.forEach(function(c){
					o[c] = {
						card: oBeat[c].card
					};
				});
				
			} else {
				aBeatConfig.forEach(function(c){
					o[c] = {
						card: 0
					};
				});
				
			}
			this._oBeatObject = o;
		},
		_setBeatToCard: function(sBeat, i){
			var o = this._oBeatObject;
			for(var each in o){
				if(o[each].card == i){
					o[each].card = 0;
					break;
				}
			}
			this._oBeatObject[sBeat] = {
				card: i
			};
		},
		getDataToSave: function(){
			return this._oBeatObject;
		},
		_getHtml: function(){
			var sHtml = "";
			aBeatConfig.forEach(function(c, i){
				sHtml += "<div class='beatItem' data-beat='" + i + "'>"+c+"</div>"
				
			});
			return "<div class='beatContainer'><div class='beatContainerHeader'>Beats</div>" +
					"<div class='beatlist'>" + sHtml + "</div></div>";
			
		},
		_attachEvents: function(){
			var that = this;
			var aBeatItem = this._node.find(".beatItem");
			var selectedBeatIndex;
			aBeatItem.on("click", function(){
			});
		},
		_addGlobalListeners: function(){
			var that = this;
			appManager.listenTo("cardClick", function(oData){
				var cardId = oData.source.getProperty("id");
				if(that._currentSelected){
					var selectedBeat = aBeatConfig[that._currentSelected];
					that._setBeatToCard(selectedBeat, cardId);
					appManager.cardManager.setBeatsToCards(that._oBeatObject);
				}
			});
			appManager.listenTo("pageChange", function(data){
				if(data.beats){
					that._setBeats(data.beats)
				} else {
					that._setBeats();
				}
			});
			appManager.listenTo("afterCardDelete", function(oData){
				var cardId = oData.cardId;
				var o = that._oBeatObject;
				for(var each in o){
					if(o[each].card == cardId){
						o[each].card = 0;
						break;
					}
				}
				appManager.cardManager.setBeatsToCards(that._oBeatObject);
			});
		},
		getNode: function(){
			return this._createNode();
			
		},
		_createNode: function(){
			var sHtml = this._getHtml();
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
			this._node.addClass("isVisible");
			appManager.cardManager.setBeatsToCards(this._oBeatObject);
		}
	}
	
	
})();