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
    
    /*
    function deleteAppointmentFromDatabase(key) {
        var ref = firebase.database().ref("/" + APPOINTMENTS + "/" + key);
        ref.remove();
    }
    
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
    
    function setDataToDatabase(date, timerange) {
        db.push().set({
            "date": date,
            "timerange": timerange
        })
    }
    
    function init() {
        db = firebase.database().ref("/" + OFFICE_HOURS);
    }
    
    that.init = init;
    that.setDataToDatabase = setDataToDatabase;
    /*that.updateDatabase = updateDatabase;
    that.deleteAppointmentFromDatabase = deleteAppointmentFromDatabase;*/
    return that;
}());