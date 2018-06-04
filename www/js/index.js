var app = {	
	mbLatitude: 37.422359,
	mbLongitude: -122.084344,
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        try{this.buyPlusDatabase();}catch(err){alert(err);}
		//try{this.geolocationLoad();}catch(err){alert(err);}
		//this.loadMap();
    },

    // Update DOM on a Received Event
    buyPlusDatabase:function() {
		var db = window.sqlitePlugin.openDatabase({
		  name: 'my.db',
		  location: 'default'
		});
    },		
	
	geolocationLoad:function(position) {
		navigator.geolocation.getCurrentPosition(this.onGeolocationCurrentPositionSuccess);
	},
	
    onGeolocationCurrentPositionSuccess:function(position){
        var a=this.mbLatitude;
		var b=this.mbLongitude;
		alert("latitude");
		alert("old "+a);
		a = position.coords.latitude;
		alert("new "+a);
		alert("longitude");
		alert("old "+b);
		b = position.coords.longitude;
		alert("new "+b);
		app.loadMap(a, b);
    },
	
    loadMap:function(a, b) {
		var map;
		var div;
		var myOptions;
		myOptions = {
			zoom: 8
		};
		div = document.getElementById("pageMap");
		map = plugin.google.maps.Map.getMap(div);
		map.animateCamera({
			target: {lat: a, lng: b},
			zoom: 17,
			tilt: 60,
			bearing: 140,
			duration: 5000
		});			
    }
};
app.initialize();