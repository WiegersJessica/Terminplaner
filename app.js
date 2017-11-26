(function(){
    var express = require("express");
    var path = require('path')
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var mailer = require(__dirname + '/server-side-js/mailer')
    var auth = require( __dirname + '/server-side-js/auth.js');

    var server = express();
    var website = 'Scheduler/'

    server.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        next();
    });

    server.use(session({ 
        secret: 'some-secret',
        saveUninitialized: false,
        resave: true
    }));

    server.use(auth.initialize());
    server.use(auth.session());

    // This includes css, js etc. to be served from the directory website
    server.use(express.static(website))

    // Types of data that can be parsed
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: false}));


    /* start routes */
    /*
        http://expressjs.com/de/starter/basic-routing.html
        http://expressjs.com/de/guide/routing.html
    */
    server.get("/", function(req, res) {
        res.sendFile( website +'index.html', {root: __dirname})
    });
    server.get("/admin/", function(req, res) {
        if (req.user){
            res.sendFile( website +'admin.html', {root: __dirname})
        }
        else{
            res.redirect('/login/')
        }
    });
    server.get("/login/", function(req, res){
        res.sendFile( website + 'login.html', {root: __dirname})
    })
    server.post('/login/', auth.authenticate('login', {
            successRedirect: '/admin/',
            failureRedirect: '/login/'
        })
    )
    server.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    server.post('/send_notification', function(req, res){
        mailer.sendNotification(req.body.email, req.body.key)
        res.sendStatus(200)
    })
    server.post('/send_info', function(req, res){
        mailer.sendInfo(req.body.email, req.body.text)
        res.sendStatus(200)
    })
    /* ends routes */

    server.listen(3333);
    console.log("Server running at localhost on port 3333");
    mailer.init()  
    
}());