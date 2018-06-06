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
		//this.geolocationLoad();
		document.getElementById('btnRegisterUser').addEventListener('click', this.dbRegisterUser, false);
		document.getElementById('btnGoToRegister').addEventListener('click', this.goToRegister, false);
    },
	
	goToRegister: function(){
		$.mobile.changePage("#pageRegister");
	},
	
	dbRegisterUser: function(e){	
		var tttt;
		var vNome = document.getElementById('registerNome').value;
		var vEmail = document.getElementById('registerEmail').value;
		var vTelefone= document.getElementById('registerTelefone').value;
		var vSenha = document.getElementById('registerSenha').value;
		if(vNome==""||vEmail==""||vTelefone==""||vSenha==""){ 
			//window.plugins.toast.show('todos os campos devem estar','long', 'center');
			alert('todos os campos devem estar preenchidos');
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
				async: false,	//perguntar pq quando tá true o php não retorna valor
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
	
	conPhp: function() {
		$.ajax({
            type: "POST",
            url: "http://192.168.0.100/index.php", 
            data: {
                acao: 'login'
            },            
            async: true,
            dataType: "json", 
            success: function (json) { 
                if(json[0].usuario != ""){
                   //redireciona o usuario para pagina
					alert("logado: "+json[0].usuario); 
                }
				
            }
        });
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