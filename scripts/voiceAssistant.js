/*
(function(){
	var recognition = new webkitSpeechRecognition();
	var final_transcript;
	VoiceAssistant = {
		init: function(){
			
			recognition.continuous = true;
			recognition.interimResults = true;

			recognition.onstart = this.onStart.bind(this);
			recognition.onresult = this.onResult.bind(this);
			recognition.onerror = this.onFail.bind(this);
			recognition.onend = this.onEnd.bind(this);
		},
		takeCommand: function(){
			//recognition.start();
		},
		onStart: function(e){
			 final_transcript = '';
			// recognition.lang = select_dialect.value;
			// recognition.start();
		},
		onResult: function(e){
			var interim_transcript = '';
			final_transcript = '';
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				if (e.results[i].isFinal) {
					final_transcript += e.results[i][0].transcript;
				} else {
					interim_transcript += event.results[i][0].transcript;
				}
			}
			final_transcript = (final_transcript);
			console.log(final_transcript);
			console.log(interim_transcript);
			this.act(final_transcript.toUpperCase());
		},
		onFail: function(e){
			
		},
		onEnd: function(e){
			
		},
		act: function(sText){
			var cmd = this.getCommand(sText);
			switch(cmd){
				case "ADDCARD" : appManager.cardManager.addNewCard();
								 break;
				case "OPENBEAT" : jQuery("#beatButton").click();
			}
		},
		getCommand: function(s){
			if (s==""){
				return;
			}
			if( s.indexOf("ADD ") > -1 && s.indexOf("CARD") > -1)
				return "ADDCARD";
			if( s.indexOf("OPEN ") > -1 && s.indexOf("BEAT") > -1)
				return "OPENBEAT";
			if( s.indexOf("CLOSE ") > -1 && s.indexOf("BEAT") > -1)
				return "CLOSEBEAT";
		}
	};
	VoiceAssistant.init();
})();
*/