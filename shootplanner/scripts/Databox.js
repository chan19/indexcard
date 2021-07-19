var Databox = (function(){
	var rootData = {};
	var localBox = {
		save: function(oData){
			localStorage.backup = JSON.stringify(oData);
		},
		load: function(sId){
			return JSON.parse(localStorage.backup || "{}");
		}
	};
	
	return {
		init: function(){
			
		},
		save: function(oData){
			for(var each in oData){
				rootData[each] = oData[each];
			}
			localBox.save(oData);
			return this;
		},
		setDataProperty: function(path, oData){
			var cur = rootData;
			var aPath = path.split("/");
			aPath.forEach(function(s, i){
				if(s){
					if(cur.hasOwnProperty(s)){
						cur = cur[s];
					} else {
						cur[s] = {
							
						}
						cur = cur[s];
					}
				}
			});
			rootData[sProp] = oData;
			return this;
		},
		getDataProperty: function(sProp){
			return rootData[sProp];
		},
		bindProperty: function(sProp){
			
		},
		load: function(sId){
			return localBox.load(sId);
		}
	};
})();