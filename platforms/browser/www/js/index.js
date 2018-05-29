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
        this.receivedEvent();
		this.loadMap();
        this.changeToPageRegister();
        this.changeToPageLogin();
        this.changeToPageMap();
    },

    // Update DOM on a Received Event
    receivedEvent: function() {
        //iniciar o banco create parafernalhas aqui
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