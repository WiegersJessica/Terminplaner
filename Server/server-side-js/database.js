(function(){
	var admin = require('firebase-admin');
	var serviceAccount = require("../firebase.json");
	var db = null;
	var ref = null;

	function create_appointment(){
		var app_ref = ref.child('Termine_test')
		
		var new_app = app_ref.push().set({
            "date": '0000-12-24',
            "lastname": 'test',
            "firstname": 'server',
            "email": 'server@example.com',
            "topic": 'testServer',
            "commentGeneral": "",
            "commentTracked": ""
        }, function(error){
				if (error) {
    				console.log("Data could not be saved." + error);
  				} 
  				else {
    				console.log("Data saved successfully.");
    				console.log(new_app)
    			}
    		}
        );        
	}

	function init(){
		admin.initializeApp({
  			credential: admin.credential.cert(serviceAccount),
  			databaseURL: "https://terminplaner-ur.firebaseio.com/"
		});
		db = admin.database();
		ref = db.ref()

	}

	module.exports.init = init
	module.exports.create_appointment = create_appointment


}());