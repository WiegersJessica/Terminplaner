var Scheduler = Scheduler || {};
Scheduler.DatabaseOfficeHours = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        db,
        OFFICE_HOURS = "Sprechstunden";
    
    function getDatabase(){
        return db;
    }
    
    //ÜBERARBEITEN
    function deleteOfficeHourFromDatabase(key) {
        console.log("delete");
        var ref, appointment, date, timestart, timeend, timerange;
        ref = firebase.database().ref("/" + OFFICE_HOURS + "/" + key);
        ref.once("value", function (snapshot) {
            appointment = snapshot.val();
            date = appointment.date;
            timestart = appointment.timestart;
            timeend = appointment.timeend;
            timerange = timestart + "-" + timeend;
            Scheduler.DatabaseAppointments.deleteAppointmentsFromDatabase(date, timerange); //Sprechstundentermine auch aus DB löschen!
            ref.remove();
        });
    }
    
    /*
    function updateDatabase(key, comment, commentType) {
        var ref = firebase.database().ref("/" + APPOINTMENTS + "/" + key);
        if (commentType === "general") {
            ref.update({
                commentGeneral: comment
            });
        } else {
            ref.update({
                commentTracked: comment
            });
        }
        
    }*/
    
    function setDataToDatabase(date, timeStart, timeEnd) {
        db.push().set({
            "date": date,
            "timestart": timeStart,
            "timeend": timeEnd
        }).then(function(snapshot) {
              window.setTimeout(function() {
                location.reload();
            }, 3000);
        });
    }
    
    function init() {
        db = firebase.database().ref("/" + OFFICE_HOURS);
    }
    
    that.init = init;
    that.setDataToDatabase = setDataToDatabase;
    /*that.updateDatabase = updateDatabase;*/
    that.deleteOfficeHourFromDatabase = deleteOfficeHourFromDatabase;
    return that;
}());