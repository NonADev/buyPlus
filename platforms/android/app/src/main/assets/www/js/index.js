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
        this.getLatLong();
    },
	
	goToPage: function(page){
        if(page) $.mobile.changePage("#"+page);
        else alert('##página invalida: ' + page);
	},
	
	dbRegisterUser: function(e){	
		var tttt;
		var vNome = document.getElementById('registerNome').value;
		var vEmail = document.getElementById('registerEmail').value;
		var vTelefone= document.getElementById('registerTelefone').value;
		var vSenha = document.getElementById('registerSenha').value;
		if(vNome==""||vEmail==""||vTelefone==""||vSenha==""){
			alert('##todos os campos devem estar preenchidos');
		}
		else{
			$.ajax({
				type: "POST",
				url: "http://192.168.0.100/index.php", 
				data: {
					acao: 'registrarUsuario',
					nome: vNome,
					email: vEmail,
					telefone: vTelefone,
					senha: vSenha
				},
				dataType: "json", 
				success: function (json) {
					tttt = json;
					if(json.result == true){
						console.log(tttt.err);
					}
					else{
						console.log(tttt.err);
					}
				},
				error: function(){
					console.log('error');
				}
			});
		}
	},
	
    getLatLong:function() {
        var lat = 51.49575692748839;
        var lon = -0.14600197187496633;
        navigator.geolocation.getCurrentPosition(function(position) {
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            console.log(this.lat);
            app.loadMap(this.lat, this.lon);
        });
    },

    loadMap:function (lat, lon) {
        var div;
        var map;
        div = document.getElementById("theMap");
        map = new google.maps.Map(div, {
            center: {lat: lat, lng: lon},
            zoom: 15    //quanto maior mais proximo
        });
    }
};
app.initialize();