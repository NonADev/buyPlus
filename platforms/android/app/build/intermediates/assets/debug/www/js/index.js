var app = {
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

		try{
			this.loadMap();
		}catch(err){
			console.log(err);
		}
    },

    // Update DOM on a Received Event
    buyPlusDatabase: function() {
        try {
            var db = window.openDatabase("mydb", "1.0", "Test DB", 1000000);
        }catch (e) {
            alert(e);
        }
    },
    loadMap: function() {
        var map;
        var div;
        var myOptions;
        myOptions = {
            zoom: 8
        };
        div = document.getElementById("pageMap");
        map = plugin.google.maps.Map.getMap(div);
    }
};

app.initialize();