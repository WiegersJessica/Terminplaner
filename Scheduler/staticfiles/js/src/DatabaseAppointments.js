var Scheduler = Scheduler || {};
Scheduler.DatabaseAppointments = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        db,
        APPOINTMENTS = "Termine",
        lastKey,
        keyExist;
    
    function getDatabase(){
        return db;
    }
    
    /*function setKey() {
        var ref = new Firebase("https://terminfindung2-dd590.firebaseio.com/");
        ref.limitToLast(2).once("child_added", function (snapshot) {
            lastKey = snapshot.key();
         });
    }*/
    
    //Matthias:
    //emails ist ein Array und darin stecken alle E-Mails, die eine Benachrichtigung erhalten sollen!
    //Mit der forEach-Schleife geht man ja alle E-Mails durch, so kannst du dann jedem eine E-Mail senden oder?
    //In messageText steckt der vorbereitete Text!!!
    function sendEmail(emails, date, timerange) {
        var germanDate, messageText;
        germanDate = date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0];
        messageText = "Liebe Studierende,\n\nDie Sprechstunde am " + germanDate + " um " + timerange + " muss leider entfallen.\nPrüfen Sie weitere Sprechstundentermine online.\n\nMit freundlichen Grüßen,\nProf. Dr. Wolff";
        emails.forEach(function(email) {
            $.ajax({
                url: 'send_info',
                type: "POST",
                data: JSON.stringify({email:email, text:messageText}),
                contentType: "application/json",
            });
            //SENDMAIL(email, messageText) !!! --> SERVER
        });
    }
    
    /*Der Admin löscht eine Sprechstunde --> Alle Sprechstundentermine zu dieser Sprechstunde müssen auch gelöscht werden*/
    function deleteAppointmentsFromDatabase(dateDelete, timerangeDelete) {
        var ref, refDelete, key, appointment, emails = [];
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + APPOINTMENTS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                key = childSnapshot.key();
                appointment = childSnapshot.val();
                if (appointment.date === dateDelete && appointment.timerangeInit === timerangeDelete) {
                    emails.push(appointment.email);
                    refDelete = new Firebase("https://terminplaner-ur.firebaseio.com/" + APPOINTMENTS + "/" + key);
                    refDelete.remove();
                }
            });
            console.log(emails);
            sendEmail(emails, dateDelete, timerangeDelete);
        });
    }
    
    /*Löschen-Button in der Tabelle wird geklickt*/
    function deleteButtonClicked(key) {
        var ref = firebase.database().ref("/" + APPOINTMENTS + "/" + key);
        ref.remove();
    }
    
    /*Der Student löscht seine Sprechstunde*/
    function deleteAppointmentFromDatabase(key) {
        var ref = firebase.database().ref("/" + APPOINTMENTS + "/" + key);
        ref.once("value").then(function(snapshot){
            keyExist = snapshot.exists();  // true
            console.log(keyExist);
            if(keyExist === true){
                ref.remove();
                Scheduler.AppointmentDeletion.deleteEntry();
                 window.setTimeout(function() {
                    location.reload();
                }, 3000);
            }else{
                Scheduler.AppointmentDeletion.wrongCode();
            }
        });
    }
    
    /**/
    function updateDatabase(key, comment, commentType) {
        var ref = firebase.database().ref("/" + APPOINTMENTS + "/" + key);
        if (commentType === "general") {
            ref.update({
                commentGeneral: comment
            });
        } else if (commentType === "tracked") {
            ref.update({
                commentTracked: comment
            });
        } else if (commentType === "comment-wolff") {
            ref.update({
                commentWolff: comment
            });
        } else {
            ref.update({
                commentKlinger: comment
            });
        }
        
    }
    
     /**/
    function getKey() {
        console.log("KEY: " + lastKey);
        return lastKey;
    }
    
     /**/
    function setKey(email) {
        var ref = new Firebase("https://terminplaner-ur.firebaseio.com/Termine");
        ref.limitToLast(1).once("child_added", function (snapshot) { /*In diesem Fall 2, weil danach noch users kommt*/
            lastKey = snapshot.key();
            sendNotificationMail(email, lastKey);
            /*console.log("KEY SET: " + lastKey);
              //!!!!!!!!!!!!!!!!!!!!gebe der mail den key mit !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            window.setTimeout(function() {
                location.reload();
            }, 3000);
            */
         });
    }

    function reload_site(){
        location.reload()
    }

    function sendNotificationMail(email, key){
        var data = { email: email, key: key}
        $.ajax({
                url: 'send_notification',
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                complete: reload_site
        });
    }
    
    function setDataToDatabase(date, timerange, timerangeInit, lastname, firstname, email, topic, duration) {
        db.push().set({
            "date": date,
            "timerange": timerange,
            "timerangeInit": timerangeInit,
            "lastname": lastname,
            "firstname": firstname, /*!*/
            "email": email,
            "topic": topic,
            "duration": duration,
            "commentWolff": "", /**/
            "commentKlinger": "" /**/
        }).then(function(snapshot) {
            setKey(email);
        });
    }
    
    function init() {
        db = firebase.database().ref("/" + APPOINTMENTS);
    }
    
    that.init = init;
    that.setDataToDatabase = setDataToDatabase;
    that.updateDatabase = updateDatabase;
    that.deleteButtonClicked = deleteButtonClicked;
    that.deleteAppointmentFromDatabase = deleteAppointmentFromDatabase;
    that.deleteAppointmentsFromDatabase = deleteAppointmentsFromDatabase;
    that.getKey = getKey;
    return that;
}());