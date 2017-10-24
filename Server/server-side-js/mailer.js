(function(){
	var nodemailer = require('nodemailer');
	var fs = require('fs');
	var ini = require('ini');
	var transporter = null;
	var mailOptions = null;

	function sendMail(to='', subject='', text=''){

		if ( !(to && subject && text) ){
			console.log('At least on parameter not set for content of mail')
			return
		}
		else if (to.includes('@example.com')){
			console.log('Please change mailaddress in app.js')
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

	module.exports.sendMail = sendMail
	module.exports.init = init

}());