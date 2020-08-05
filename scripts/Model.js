(function(){
	Model = function(){
		this.data = this.getDefaultData();
	}
	Model.prototype = {
		
		getDefaultData: function(){
			return {
				cards: this.getDefaultCardData(),
				time: Date.now(),
				version: 0,
				fileName: "Untitled",
				tags: [],
				fileId: Date.now(),
				beats: {},
				beatSheetId: "BEAT1",
				beatsheet: this.getBeatSheet("BEAT1")
			}
			
		},
		oBeatSheet: {
			"BEAT1" : ["Opening", "Introduce Protag", "Introduce Antag", 
						"Introduce Stakes", "Inciting incident", "Call to hero",
						"Second Act", "Plot B", "New Characters", "Mid Point", 
						"Low point", "Climax", "Beginning of the End", "Finale"]
		},
		getBeatSheet: function(sBeatId){
			return this.oBeatSheet[sBeatId];
		},
		getDefaultCardData: function(nIndex){
			return {
					id: this.generateId(),
					title: "", //"Type a title",
					content:"", //"Type description",
					index: nIndex || 0,
					color: "blue",
					statusText: ""
				};
		},
		generateId: function(){
			return Date.now();
		},
		getThemes: function(){	
			//["#7a9fd8","#e91e63","#009688","#fbb043","#673AB7"];
			return ["blue", "red", "green", "orange", "violet"];
		},
		_setBeats: function(oBeat){
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
		bindElement: function(){
			
		}
		
		
	}
})();