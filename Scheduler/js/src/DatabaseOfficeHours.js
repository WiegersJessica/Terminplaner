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
        var ref = firebase.database().ref("/" + OFFICE_HOURS + "/" + key);
        ref.remove();
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
        })
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