var Scheduler = Scheduler || {};
Scheduler.DatabaseTopics = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        db,
        TOPICS = "Sprechstundengründe";
    
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
    
    function setDataToDatabase(topic, duration) {
        console.log("set");
        db.push().set({
            "topic": topic,
            "duration": duration
        })
    }
    
    function init() {
        db = firebase.database().ref("/" + TOPICS);
    }
    
    that.init = init;
    that.setDataToDatabase = setDataToDatabase;
    /*that.updateDatabase = updateDatabase;
    that.deleteAppointmentFromDatabase = deleteAppointmentFromDatabase;*/
    return that;
}());