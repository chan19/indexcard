(function(){
	TagPopup = function(oConfig){
		oConfig = oConfig || {};
		this.init(oConfig);
	
	}
	TagPopup.prototype = {
		_allTags: [],
		_isOpen: false,
		init: function(oConfig){
			this._createNode();
			this._attachEvents();
			this._addGlobalListeners();
			this.setAllTags(oConfig.tags);
		},
		getAllTags: function(){
			return this._allTags;
		},
		setAllTags: function(aTag){
			this._allTags = aTag || [];
		},
		_owner: null,
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
		getAllTags: function(){
			return this._allTags;
		},
		setAllTags: function(a){
			this._allTags = a || [];
		},
		pushToAllTags: function(s){
			if(this._allTags.indexOf(s) == -1){
				this._allTags.push(s);
			}
			return this;
		},
		getTagsWithString: function(s){
			return this._allTags.filter(function(a){
				return (a.search(s) > -1);
			});
		},
		open: function(aTag, oCard){
			var that = this;
			var oNode = oCard.getNodeReference();
			function close(e){
				if(!that._node[0].contains(e.target)) {
					that.close();
					e.stopPropagation();
				}
			}
			if(this._isOpen && this.getOwner() == oCard){
				this.close();
			} else {
				this.setTags(aTag);
				var bottom = window.innerHeight - oNode.offset().top - oNode.height() + 20 +window.scrollY;
				var left = oNode.offset().left+window.scrollX;
				this._node.css({
					left: left,
					bottom: bottom
				}).show();
				//that._node.addClass("isVisible");
				setTimeout(function(){
					that._node.addClass("isVisible");
				}, 10);
				jQuery(window).on("click", close);
				this._isOpen = true;
				this.setOwner(oCard);
			}
			return this;
		},
		close: function(){
			var that = this;
			this._isOpen = false;
			this.setOwner(false);
			jQuery(window).off("click", "**");
			this._node.find("#taginput").val("");
			this.clearSuggestions();
			this._node.removeClass("isVisible");
			setTimeout(function(){
				that._node.hide();
			}, 300);
			return this;
		},
		getHtml: function(){
			return "<div class='tagpopup'>" +
				"<div class='tagpopupHeader'> TAGS </div>" +
				"<div class='tagpopupbody'><div class='taglist'></div>"+
				"<div class='tagcreateBox'><input id='taginput'>" +
				"<div class='tagSuggstionBox'></div></div>" +
				"</div>"+
				"<div class='toppopuparrow'></div>"+
				"</div>";
		},
		_createNode: function(){
			this._node = jQuery(this.getHtml());
			return this;
		},
		render: function(sId){
			jQuery("#" + sId).append(this._node);
			return this;
			
		},
		getTags: function(sId){
			return ["underworld", "emotional", "tense"]
		},
		setTags: function(aTag){
			this.updateTagsHtml(aTag);
			return this;
		},
		updateTagsHtml: function(aTag){
			var sHtml = "";
			aTag.forEach(function(s){
				sHtml += "<div class='tagItem'><div class='tagText'>" + s +
							"</div><div class='removeTag'>X</div></div>";
			});
			this._node.find(".taglist").html(sHtml);
		},
		showSuggestions: function(s){
			var a = this.getTagsWithString(s);
			var sHtml = "";
			a.forEach(function(s){
				sHtml += "<div class='tagSuggestionItem'>" + s + "<div>";
			});
			this._node.find(".tagSuggstionBox").html(sHtml);
		},
		clearSuggestions: function(){
			this._node.find(".tagSuggstionBox").empty();
		},
		_onAddTag: function(sVal){
			var owner  =this.getOwner();
			var ownerTags = owner.getProperty("tags");
			if(ownerTags.indexOf(sVal) == -1){
				ownerTags.push(sVal);
				this.getOwner().setProperty("tags", ownerTags);
				this.setTags(ownerTags);
				this.pushToAllTags(sVal);
				this.getCore().fireEvent("dataChange");
			}
			return this;
		},
		_attachEvents: function(){
			var that = this;
			jQuery(window).on("scroll", function(){
				that.close();
			});
			this._node.find("#taginput").on("change", function(e){
				var val = this.value.toLowerCase();
				if(val){
					this.value = "";
					that._onAddTag(val);
				} else {
					that.close();
				}

			}).on("input", function(e){
				var val = this.value.toLowerCase();
				that.showSuggestions(val);
			});
		},
		_addGlobalListeners: function(){
			var that = this;
			appManager.listenTo("pageChange", function(data){
				that.setAllTags(data.tags);
			});
		}
	}
})();