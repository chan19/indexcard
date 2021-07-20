(function(){
	
	appManager = {
		init: function(){
			this._initialiseDataMode();
			this._initCast();
			this._initLocation();
			this._attachEvents();
			return this;
		},
		_initialiseDataMode: function(){
			this._dataBox = Databox.init();
		},
		_initCast: function(){
			this._cast = Cast;
			this._cast.init({data:Model.CAST}).render("testArea");
		},
		_initLocation: function(){
			this._location = Location;
			this._location.init({data:Model.LOCATION}).render("testArea");
		},
		_attachEvents: function(){
			var that = this;
			jQuery("#castButton").click(function(){
				that._cast.open();
			});
			jQuery("#locationButton").click(function(){
				that._location.open();
			});
		}
		
		
	}
})();