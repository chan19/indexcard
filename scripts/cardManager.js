function CardManager(aData){
	this.init(aData);
}
CardManager.prototype.init = function(aData){
	this._cards = [];
	this._cardById = {};
	this._initLargeEditor();
}

CardManager.prototype.getCards = function(){
	return this._cards || [];
}

CardManager.prototype.getCard = function(nIndex){
	return this._cards[nIndex];
}
CardManager.prototype.getCardById = function(sId){
	return this._cardById[sId];
}
CardManager.prototype.getNodes = function(){
	var aNode = [];
	var aCard = this._cards;
	var l = aCard.length;
	for(var i = 0; i < l; i++){
		aNode.push(aCard[i].getNodeReference());
	}
	return aNode;
}
CardManager.prototype._initLargeEditor = function(){
	var that = this;
	function setDataToCard(o, d){
		o.setProperty("title", d.title, true);
		o.setProperty("content", d.content, true);
		o.setProperty("color", d.color, true);
		o.setProperty("meta", d.meta);
		o.setProperty("notes", d.notes, true);
		o.setProperty("act", d.act, true);
		o.setProperty("pgTarget", d.pgTarget, true);
	}
	function isSaveRequired(oCardData, oEditorData){
		var isRequired = false;
		oPrev = oPrev || {};
		oCur = oCur || {};
		for(var each in oPrev){
			if(oCur[each] == oPrev[each]){
				isRequired = true;
				break;
			}
		}
		return isRequired;
	}
	this.largeEditor = new LargeEditor({
		onSave: function(data){
			var owner = this.getOwner();
			var sOldAct = owner.getProperty("act");
			var sNewAct = data.act;
			setDataToCard(owner, data);
			if(sOldAct != sNewAct){
				that._updateCardsAct(owner.getProperty("index"), sNewAct, sOldAct);
			}
			that.refreshTotalPageCount();
		},
		onPrev: function(){
			var owner = this.getOwner();
			var ownerCardIndex = owner.getProperty("index");
			var l = that.getCards().length;
			if(ownerCardIndex > 0){
				var prevCardIndex = ownerCardIndex == 0? ownerCardIndex : ownerCardIndex -1;
				var prevCard = that.getCard(prevCardIndex);
				that.largeEditor.setData(prevCard.getData(), (prevCardIndex == 0), (prevCardIndex == l-1)).setOwner(prevCard);
			} 

			//setDataToCard(owner, data);

		},
		onNext: function(){
			var owner = this.getOwner();
			var ownerCardIndex = owner.getProperty("index");
			var l = that.getCards().length;
			var nextCardIndex = (ownerCardIndex == l -1) ? ownerCardIndex : ownerCardIndex + 1;
			var nextCard = that.getCard(nextCardIndex);
			//setDataToCard(owner, data);
			that.largeEditor.setData(nextCard.getData(),(nextCardIndex == 0), (nextCardIndex == l-1)).setOwner(nextCard);
		}
	});
	this.largeEditor.render("testArea");
}
CardManager.prototype.getAllCardPositions = function(){
	var aPos = [];
	var aNode = this.getNodes();
	var c = aNode[0];
	var mT = parseInt(c.css("margin-top"));
	var mL = parseInt(c.css("margin-left"));
	var offset;
	aNode.forEach(function(c){
		offset = c.offset();
		aPos.push({
			top: offset.top - mT,
			left: offset.left - mL
		});
	});
	return aPos;
}
CardManager.prototype.setCardData = function(aData){
	this._cards = [];
	this._cardById = {};
	var isTouch = appManager.getIsTouchDevice();
	if(aData.length){
		this.createCards(aData);
	} else{
		this.createCards([{
			index: 0,
			title: isTouch ? "No Title" : "click here to add a plot point title",
			content: isTouch ? "Tap here to add the plot point summary" : "click here to add plot point summary"
		}])
	}
	
}
CardManager.prototype.createCards = function(aData){
	var that = this;
	this._cardById = {};
	aData.forEach(function(oData,i){
		oData.id = oData.id || Date.now()+"_"+i;
		that.addCard(oData, false);
	});
	this.renderAll();
	this.refreshTotalPageCount();
}
CardManager.prototype.getCardData = function(){
	var aCards = this.getCards();
	var aData = [];
	aCards.forEach(function(oCard){
		aData.push(oCard.getData());
	});
	return aData;
}
CardManager.prototype.addCard = function(oData, bRender){
	var nIndex = oData? (oData.index || 0) : 0;
	var oCard = new IndexCard({
		data: oData,
		onAddNew: this.addNewCard.bind(this),
		onDelete: this.deleteCard.bind(this),
		onClick: function(oCard, index){
			appManager.fireEvent("cardClick", {
				source: oCard
			});
		},
		onPopout: this.popoutCard.bind(this),
	}, nIndex);
	this._cardById[oCard.getProperty("id")] = oCard;
	this._cards.splice(nIndex, 0, oCard);
	if(bRender){
		this.renderCard(oCard);
	}
}
CardManager.prototype.addEmptyCard = function(nIndex, bRender){
	nIndex = nIndex || 0;
	var act = "1";
	if(nIndex > 0){
		act = this.getCard(nIndex - 1).getProperty("act");
	}
	this.addCard({index: nIndex, act: act}, bRender);
}
CardManager.prototype._updateCardsIndex = function(nFromPos){
	var aCards = this._cards;
	var oCard;
	for(var i= nFromPos + 1; i< aCards.length; i++){
		oCard = aCards[i];
		oCard.setProperty("index", i );
	}
}
CardManager.prototype._updateCardsAct = function(nPos, sNewAct, sOldAct){
	var oActRank = {"-1" : 0, "1" : 1, "2A" : 2, "2B": 3, "3" : 4};
	var rankOfNewAct = oActRank [sNewAct];
	var rankOfOldAct = oActRank [sOldAct];
	var aCards = this._cards;
	var oCard;
		if(rankOfNewAct < rankOfOldAct){
			for(var i = nPos -1; i >= 0; i--){
				if(oActRank[aCards[i].getProperty("act")] <= oActRank[sNewAct]){
					break;
				} else {
					aCards[i].setProperty("act", sNewAct, true);
				}
			}
		} else if (rankOfNewAct > rankOfOldAct) {
			for(var i = nPos + 1; i  < aCards.length; i++){
				if(oActRank[aCards[i].getProperty("act")] >= oActRank[sNewAct]){
					break;
				} else {
					aCards[i].setProperty("act", sNewAct, true);
				}
			}
		}
}
CardManager.prototype.renderAll = function(){
	var aCard = this.getCards();
	var cardContainer = jQuery("#cardContainer");
	cardContainer.html("");
	aCard.forEach(function(oCard,i){
		cardContainer.append(oCard.getNewNode());
	});
}
CardManager.prototype.renderCard = function(oCard){
	var cardContainer = jQuery("#cardContainer");
	cardContainer.append(oCard.getNode());
}
CardManager.prototype.getCards = function(){
	return this._cards || [];
}
CardManager.prototype.getCard = function(nIndex){
	return this._cards[nIndex];
}
CardManager.prototype.addNewCard = function(nIndex){
	var aCards = this.getCards();
	nIndex = (nIndex || nIndex ==0) ? nIndex : aCards.length;
	if(nIndex == aCards.length){
		this.addEmptyCard(nIndex, true);
	} else {
		this.addEmptyCard(nIndex, false);
		this._updateCardsIndex(nIndex);
		this.renderAll();
	}
	this.refreshTotalPageCount();
}

CardManager.prototype.onSearch = function(sText){
	sText = sText || "";
	var aCards = this.getCards();
	if(sText == ""){
		aCards.forEach(function(c){
			c.show();
		});
	} else {
		aCards.forEach(function(c){
			c[c.hasText(sText) ? "show" : "hide"]();
		});
	}
}
CardManager.prototype.deleteCard = function(nIndex){
	var oCard = this.getCard(nIndex);
	var aCards = this.getCards();
	var cardId = oCard.getProperty("id");
	oCard.getNodeReference().remove();
	aCards.splice(nIndex, 1);
	delete this._cardById[cardId];
	this._updateCardsIndex(nIndex - 1);
	this.renderAll();
	appManager.fireEvent("afterCardDelete", {
		cardId: cardId
	});
	this.refreshTotalPageCount();
}
CardManager.prototype.refreshTotalPageCount =function(){
	var c = this.getCards();
	var l = c.length;
	for(var j =0, i=0; i < c.length; i++){
		j += Number(c[i].getProperty("pgTarget"));
	}
	appManager.setTotalTargetPageCount(j);
}
CardManager.prototype.popoutCard = function(oCard){
	var i =oCard.getProperty("index");
	var l = this.getCards().length;
	this.largeEditor.setData(oCard.getData(),(i == 0), (i == l-1)).open(oCard);
}
CardManager.prototype.cloneProxyMove = function(aPos, oCard, oClone){
	var node = oCard.getNodeReference();
	var mT = parseInt(node.css("margin-top"));
	var mL = parseInt(node.css("margin-left"));
	var oPos = aPos[oCard.getProperty("index")];
	
	node.css({opacity:0});
	oClone.animate({
		top: oClone.offset().top + parseInt(jQuery("#cardContainer").css('top')),
		left: oPos.left + mL
	}, 200);
}
CardManager.prototype.animateCardsReorder = function(aNodeOld,aPos, oCard, oClone, sY, fCallback){
	var cardContainer = jQuery("#cardContainer");
	cardContainer.addClass("reordermode");
	cardContainer.css("top", "-" + sY + "px");
	//jQuery("#card_1621341707958").offset().top + parseInt(jQuery("#cardContainer").css('top'))
	var aNode = this.getNodes();
	var l = aNode.length;
	for(var i=0; i < l; i++){
		aNodeOld[i].css(aPos[i]);
	}
	this.cloneProxyMove(aPos, oCard, oClone);
	for(var i=0; i < l; i++){
		aNode[i].animate(aPos[i], 400);
	}
	setTimeout(function(){
		//cardContainer.removeClass("reordermode");
		fCallback();
	},400);
}
CardManager.prototype.moveCardToIndex = function(oCard,fromIndex, toIndex, oClone, sY, callback){
	var that = this;
	var fromIndex = oCard.getProperty("index");
	var aCard = this.getCards();
	var aNode = this.getNodes();
	var aPos = this.getAllCardPositions();
	if(toIndex>fromIndex){
		aCard.splice(toIndex + 1, 0, oCard);
		aCard.splice(fromIndex,1);
		this._updateCardsIndex(fromIndex-1, true);
	} else {
		aCard.splice(fromIndex,1);
		aCard.splice(toIndex, 0, oCard);
		this._updateCardsIndex(toIndex, true);
	}
	
	oCard.setProperty("index", toIndex, false);
	this.animateCardsReorder(aNode, aPos, oCard, oClone, sY, function(){
		jQuery("#cardContainer").removeClass("reordermode");
		that.renderAll();
		callback();
	});
	
}
CardManager.prototype.getCardAtMousePosition = function(eX,eY){
	var aCards = this.getCards();
	var l = aCards.length;
	for(var i = 0; i < l; i++){
		if(aCards[i].isCoordinatesInside(eX, eY)){
				return aCards[i];
		}
	}
}
CardManager.prototype.refreshPageMeter = function(bFade){
	var aCards = this.getCards();
	var l = aCards.length;
	var meter = 1;
	var cur, tmp;
	for(var i = 0; i < l; i++){
		cur = aCards[i];
		tmp = Number(cur.getProperty("pgTarget"));
		cur.setProperty("statusText", "p.no " + meter + " - " + (meter + tmp), true);
		meter +=  tmp;
	}
}