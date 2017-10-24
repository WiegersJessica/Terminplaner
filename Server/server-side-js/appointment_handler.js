(function(){
	var db = null;

	function create_appointment(req, res){
		console.log('received post');
        console.log(req.body);
        var h = req.body.username;
        console.log(h);
        res.sendStatus(201)
	}

	function init(db){
		this.db = db;
	}

	module.exports.init = init;
	module.exports.create_appointment = create_appointment;
}());