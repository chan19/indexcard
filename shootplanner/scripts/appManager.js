(function(){
	
	appManager = {
		init: function(){
			this._initialiseDataMode();
			this._initialiseModel();
			this._initCast();
			this._initLocation();
			this._initCostume();
			this._attachEvents();
			return this;
		},
		_initialiseDataMode: function(){
			this._dataBox = Databox.init();
		},
		_initialiseModel: function(){
			if(localStorage.Model){
				Model = JSON.parse(localStorage.Model);
			}
		},
		_initCast: function(){
			this._cast = Cast;
			this._cast.init({data:Model.CAST}).render("testArea");
		},
		_initLocation: function(){
			this._location = Location;
			this._location.init({data:Model.LOCATION}).render("testArea");
		},		
		_initCostume: function(){
			this._costume = Costume;
			this._costume.init({data:Model.COSTUME}).render("testArea");
		},
		setDataToModel: function(path, oData){
			Model[path][oData.id] = oData;
			localStorage.Model = JSON.stringify(Model);
		},
		_attachEvents: function(){
			var that = this;
			jQuery("#castButton").click(function(){
				that._cast.open();
			});
			jQuery("#locationButton").click(function(){
				that._location.open();
			});
			jQuery("#costumeButton").click(function(){
				that._costume.open();
			});
		}
		
		
	}
})();