var Scheduler = Scheduler || {};
Scheduler.DatabaseAppointments = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        db,
        APPOINTMENTS = "Termine";
    
    function getDatabase(){
        return db;
    }
    
    /*function setKey() {
        var ref = new Firebase("https://terminfindung2-dd590.firebaseio.com/");
        ref.limitToLast(2).once("child_added", function (snapshot) {
            lastKey = snapshot.key();
         });
    }*/
    
    function deleteAppointmentFromDatabase(key) {
        var ref = firebase.database().ref("/" + APPOINTMENTS + "/" + key);
        ref.remove();
    }
    
    function updateDatabase(key, comment) {
        var ref = firebase.database().ref("/" + APPOINTMENTS + "/" + key);
        ref.update({
            comment: comment
        });
    }
    
    function setDataToDatabase(date, timerange, lastname, firstname, email, topic) {
        db.push().set({
            "date": date,
            "timerange": timerange,
            "lastname": lastname,
            "firstname": firstname, /*!*/
            "email": email,
            "topic": topic,
            "comment": ""
        }).then(function(snapshot) {
            //location.reload();
        });
    }
    
    function init() {
        db = firebase.database().ref("/" + APPOINTMENTS);
    }
    
    that.init = init;
    that.setDataToDatabase = setDataToDatabase;
    that.updateDatabase = updateDatabase;
    that.deleteAppointmentFromDatabase = deleteAppointmentFromDatabase;
    return that;
}());