(function(){
    var express = require("express");
    var path = require('path');
    var body_parser = require('body-parser');
    var mailer = require(__dirname + '/server-side-js/mailer');
    var database = require(__dirname + '/server-side-js/database');
    var appointment_handler = require(__dirname + '/server-side-js/appointment_handler')
    var server = express();

    main()

    function config_server(){
        server.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
            next();
        });

        // This includes css, js etc. to be served from the directory website
        server.use(express.static('website'));
        // Needed to parse json sent in POST-requests
        server.use(body_parser.json());
    }

    function init_routes(){
        /*
        http://expressjs.com/de/starter/basic-routing.html
        http://expressjs.com/de/guide/routing.html
        */
        server.get("/", function(req, res) {
            res.sendFile('website/index.html', {root: __dirname})
        });
        server.post("/create_appointment", appointment_handler.create_appointment)
    }
    
    function init_modules(){
        mailer.init();
        database.init();
        appointment_handler.init(database)
        //database.create_appointment()
        //mailer.sendMail('example@example.com', 'New test', 'New test text')  
    }

    function start_server(){
        server.listen(3333);
        console.log("Server running at localhost on port 3333");
    }

    function main(){    
        config_server();
        init_modules();
        init_routes();
        start_server();
    }


}());