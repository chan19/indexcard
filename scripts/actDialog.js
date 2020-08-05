(function(){
	ActDialog = function(){
		this._init();
	}
	ActDialog.prototype = {
		
		_init: function(){
			this._createDummyCards();
			this._createNode();
			this._attachEvents();
			this._addGlobalListeners();
			return this;
		},
		getCore: function(){
			return appManager;
		},
		_acts: [],
		getActs: function(){
			var a = [{
				act: "1",
				card: -1,
			}, {
				act: "2A",
				card: -1
			}, {
				act: "2B",
				card: -1
			}, {
				act: "3",
				card: -1
			}];
			return ["1", "2A", "2B", "3"];
			
		},
		setActs: function(){
			
		},
		setData: function(){
			
		},
		_createDummyCards: function(){
			var acts = this.getActs();
			var aCards = [];
			var allCardData = this.getCore().getData("cards");
			var aList = this._buildDropDownValues(allCardData);
			acts.forEach(function(s,i){
				var curCard = new IndexCard({
					editable: false,
					size: "S",
					showIndex: false,
					data: {
						id: "DUMMY"+ i,
						title: "card title of card" + i,
						content: "card description of card" + i + "in small letters.\n lets see if it works"
					}
				});
				aCards.push({
					card: curCard,
					select: new Dropdown({
						defaultText: "Select an index card",
						onChange: function(k,i, v){
							curCard.setProperty("title", allCardData[i].title, true);
							curCard.setProperty("content", allCardData[i].content, true);
							curCard.setProperty("color", allCardData[i].color, true);
						},
						list: aList
					})
				});
			});
			this._cards = aCards;
			return this;
		},
		getCard: function(i){
			return this._cards[i];
		},
		getCards: function(i){
			return this._cards;
		},
		open: function(aData){
			jQuery("#blocker").show();
			this._node.show();
			return this;
		},
		hide: function(){
			this._node.hide();
			jQuery("#blocker").hide();
			return this;
		},
		getHtml: function(){
			var acts = this.getActs();
			var tmp = "";
			acts.forEach(function(s,i){
				tmp += "<div class='actContainer' data-act='" + i + "'><div class='actTitle'>Act " + s + "</div>" +
						"<div class='cardContainer'></div></div>";
			});
			return "<div id='actDialog' style='display:none'>" +
					"<div class='actDialogClose'>X</div>" +
					"<div class='actdialogHeader'> ACTS </div>" +
					"<div class='actDialogBody'>" + tmp + "</div>" +
				"</div>";
		},
		_createNode: function(){
			var that = this;
			this._node = jQuery(this.getHtml());
			var cardContainer = this._node.find(".cardContainer");
			var cards = this.getCards();
			cardContainer.each(function(i, o){
				o.append(cards[i].card.getNode()[0]);
				o.append(cards[i].select.getNode()[0]);
			});
			return this;
		},
		render: function(sId){
			jQuery("#" + sId).append(this._node);
			return this;
		},
		_attachEvents: function(){
			this._node.find(".actDialogClose").click(this.hide.bind(this));
		},
		_addGlobalListeners: function(){
			var that = this;
			appManager.listenTo("escPress", function(data){
				that.hide();
			});
		},
		_buildDropDownValues: function(aData){
			var aList = [];
			aData.forEach(function(a,i){
				aList.push({
					key: a.id,
					value: (i+1) + ". "+ a.title
				});
			});
			return aList;
		},
		getDataToSave: function(){
			var acts = this.getActs();
			var aData = [];
			acts.forEach(function(){
				
			});
			return {
				
			}
		}
		
	}
})();