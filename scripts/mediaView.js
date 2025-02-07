(function(){
	MediaView = function(domId){
		this._domContainer = jQuery("#"+domId);
		this._attachEvents();
		this._attachListeners();
	}
	MediaView.prototype = {
		_data: {},
		open: function(oData){
			var aMedia = oData.mediaList
			var html = this._getHtml(aMedia);
			jQuery("#mediaViewItemContainer").html(html);
			jQuery("#mediaViewContainer").show();
			this.getCore().fireEvent("dialogOpen", {
				id: "mediView",
				closeHandler: this.hide.bind(this)
			});
		},
		hide: function(bSuppressEvent){
			jQuery("#mediaViewContainer").hide();
			if(!bSuppressEvent){
				this.getCore().fireEvent("dialogClose", {
					id: "mediaVieww"
				});					
			}		
		},
		getCore: function(){
			return appManager;
		},
		refreshOverview: function(){
			
		},
		_getHtml: function(aData){
			var html = "", s= "";
			var that = this;
			
			aData.forEach(function(o, i){
				html += "<div class='mediaViewItem'>" +
						"<div class='mediaTitle'>" + o.title + "</div>" +
						"<img class='mediaThumbnail' src='"+ o.thumbnail + "'>" +
						"</div>";
			});
			return html;
		},
		append: function(o){
			var html = this._getHtml([o]);
			jQuery("#mediaViewItemContainer").html(html);
		},
		_getNode: function(){
			return this._node;
		},
		_attachEvents: function(){
			var that = this;
			jQuery("#mediaViewContainerClose").click(function(){
				that.hide();
			});
			jQuery("#mediaViewInput").change(function(){
				console.log(this.value);
				cloudBox.fetchYoutubeVideoPreview(this.value,function(o){
					that.append(o);
				});
				
	
				
			});
		},
		_attachListeners: function(){
			
		}
	}
})();