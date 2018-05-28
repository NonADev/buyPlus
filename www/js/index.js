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
        this.receivedEvent('deviceready');
		this.loadMap();
        this.changeToPageRegister();
        this.changeToPageLogin();
        this.changeToPageMap();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        		
    },
    changeToPageRegister: function() {
        $("#gotoRegister").click(function() {
            $.mobile.changePage("#pageRegister");
        });
    },
    changeToPageLogin: function() {
        $("#gotoLogin").click(function() {
            $.mobile.changePage("#pageLogin");
        });
    },
    changeToPageMap: function() {
        $("#gotoMap").click(function() {
            $.mobile.changePage("#pageMap");
        });
    },
    loadMap: function() {
		var div = document.getElementById("pageMap");
		var map = plugin.google.maps.Map.getMap(div);
    }
};

app.initialize();