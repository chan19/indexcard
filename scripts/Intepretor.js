(function(){
	Interpreter = function(){
		
	}
	Interpreter.prototype = {
		fetchDictionary: function(){
			//a Rest call to fetch Dictionary
		},
		parseText: function(sText){
			/*
			*parse text into tokens. Eliminate the unnecessary articles,
			*conjunctions, Interjections etc. Rearrange the text if necessary
			*/
		},
		processWithDictionary: function(){
			/*Replace the tokens with the engine friendly tokens
			*from the dictionary. The dictionary also supplies the metadata of the tokens
			*viz. verb/noun/quantifier etc
			*/
		},
		
	}
})();