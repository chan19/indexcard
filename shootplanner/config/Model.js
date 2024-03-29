Model = {
	SCENE: [{
		id: "SCENE_1",
		title: "OPENING SCENE",
		synopsis: "Opening scene where something something happens",
		notes: "",
		index: 0,
		timeType: "D",	//D/N/DN
		locationType: "INT",
		CHARACTERS: [{
			id: "CAST_1",
			costume: "COSTUME_1",
			gender: "M",
			type: "PRIMARY",
			makeup: "",
			notes: ""
		}],
		SUPPORTING_CHARACTERS: [{
			id: "CAST_ID",
			costume: "COSTUME_1",
			makeup: "",
			notes: ""
		}],
		EXTRAS: [{
			id: "EXTRAS_1",
			count: 300,
			notes: ""
		}],
		LOCATION: [{
			id: "LOCATION_1", // location id or set id
			type: "LOCATION", // LOCATION or SET
			notes: ""
		}],
		ART: {
			construction: [{
				id: "CONSTRUCTION_1",
				notes: ""
			}],
			props: [{
				id: "PROPS_1",
				notes: ""
			}],
			decoration: [{
				id: "PROPS_1",
				notes: ""
			}]
			
		},
		metadata: {
			locationType: "INT"
		}
	}],
	CAST: {
		CAST_1: {
			id: "CAST_1",
			name: "SID",
			actor: "RISHI",
			contact: "98884 445654",
			notes: "",
			type: "SECONDARY" // primary,secondary
		},
		CAST_2: {
			id: "CAST_2",
			name: "Amulya",
			actor: "Anusha",
			contact: "98884 445654",
			notes: "Tentative. may go for another"
		}
	},
	COSTUME: {
		COSTUME_1: {
			id: "COSTUME_1",
			character: "CAST_1",
			name: "SID COSTUME",
			description: "Jeans",
			notes: ""
		}
	},
	EXTRAS:  {
		EXTRAS_1: {
			name: "FEST CROWD"
		}
	},
	ACTION_PROPS: {
		
	},
	SET_PROPS: {
		
	},
	LOCATION: {
		LOCATION_1:{ 
			id: "LOCATION_1",
			name: "HOSPITAL",
			place: "VIJAYA HOSPITAL",
			contact: "33444 33232",
			notes: ""
		}
	},
	SET: {
		SET1: {
			name: "VINEYARD",
			
		}
	},
	EQUIPMENT: {
		
	}
}