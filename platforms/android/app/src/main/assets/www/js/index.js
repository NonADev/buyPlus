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
		//this.buyPlusDatabase();
		this.geolocationLoad();
    },

    // Update DOM on a Received Event
    buyPlusDatabase:function() {	
		//working test
		/*
		window.sqlitePlugin.echoTest(function() {
			alert('ECHO test OK');
		});*/
		var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});	
    },		
	
	geolocationLoad:function(position) {
		navigator.geolocation.getCurrentPosition(app.onGeolocationCurrentPositionSuccess);
	},
	
    onGeolocationCurrentPositionSuccess:function(position){
        var a = this.mbLatitude;
		var b = this.mbLongitude;
		a = position.coords.latitude;
		b = position.coords.longitude;
		try{
			app.loadMap(a, b);
		}catch(err){alert(err);}
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
			bearing: 140,
			duration: 5000
		});	/*
		var marker = map.addMarker({
			position: {lat: a, lng: b},
			title:  "Você está aqui",
			animation: plugin.google.maps.Animation.BOUNCE
		});		*/
    }
};
app.initialize();