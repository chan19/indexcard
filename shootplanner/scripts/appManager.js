(function(){
	
	appManager = {
		init: function(){
			this._initialiseDataMode();
			this._initCast();
			this._attachEvents();
			return this;
		},
		_initialiseDataMode: function(){
			this._dataBox = Databox.init();
		},
		_initCast: function(){
			this._cast = Cast;
			this._cast.init({data:Model.CAST}).render("testArea").open();
		},
		_attachEvents: function(){
			
		}
		
		
	}
})();