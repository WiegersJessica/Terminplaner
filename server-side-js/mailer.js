(function(){
	var nodemailer = require('nodemailer');
	var fs = require('fs');
	var ini = require('ini');
	var transporter = null;
	var mailOptions = null;

	function sendNotification(to, key){
		subject = 'Beantragen eines Termins'
		text = 'Ihr Termin wurde beantragt.\nUm weitere Änderungen vorzunehmen benötigen sie folgenden Key: ' + key
		text = "Lieber Studierender,\n\nIhr Termin wurde eingetragen.\nSollten sie ihn nicht wahrnehmen können, kann der Termin unter dem Reiter 'Terminverwaltung' mit folgendem Code gelöscht werden: " + key + "\n\nMit freundlichen Grüßen,\nProf. Dr. Wolff";
		sendMail(to, subject, text)
	}

	function sendInfo(to, text){
		subject = 'Sprechstundenänderung'
		sendMail(to, subject, text)
	}

	function sendMail(to, subject, text){

		if ( !(to && subject && text) ){
			console.log('At least on parameter not set for content of mail')
			return
		}

		mailOptions.to = to
		mailOptions.subject = subject
		mailOptions.text = text
		
		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			console.log(error);
  			} 
  			else {
    			console.log('Email sent: ' + info.response);
  			}
		});
		
	}

	function init(){
		/*
			Based on https://www.w3schools.com/nodejs/nodejs_email.asp
		*/
		var config = ini.parse(fs.readFileSync(__dirname + '/../config.ini', 'utf-8'))

		transporter = nodemailer.createTransport({
  							service: config.email.service,
  							auth: {
    							user: config.email.username,
    							pass: config.email.password
  							}});

		mailOptions = { from: config.email.username };
	}

	module.exports.sendNotification = sendNotification;
	module.exports.sendInfo = sendInfo;
	module.exports.init = init;

}());