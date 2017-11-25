(function(){
    var express = require("express");
    var path = require('path')
    var mailer = require(__dirname + '/server-side-js/mailer')
    var server = express();

    server.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        next();
    });

    // This includes css, js etc. to be served from the directory website
    server.use(express.static('website'));


    /* start routes */
    /*
        http://expressjs.com/de/starter/basic-routing.html
        http://expressjs.com/de/guide/routing.html
    */
    server.get("/", function(req, res) {
        res.sendFile('website/index.html', {root: __dirname})
    });
    /* ends routes */

    server.listen(3333);
    console.log("Server running at localhost on port 3333");
    mailer.init()
    //mailer.sendMail('example@example.com', 'New test', 'New test text')   
    
}());