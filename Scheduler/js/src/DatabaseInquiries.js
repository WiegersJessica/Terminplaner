var Scheduler = Scheduler || {};
Scheduler.DatabaseInquiries = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        db,
        INQUIRIES = "Anfragen";
    
    
    
    /*ÜBERARBEITEN*/
    
    
    function getDatabase(){
        return db;
    }
    
    function deleteInquiryFromDatabase(key) {
        var ref = firebase.database().ref("/" + INQUIRIES + "/" + key);
        ref.remove();
    }
    
    function updateDatabase(key, comment) {
        var ref = firebase.database().ref("/" + INQUIRIES + "/" + key);
        ref.update({
            comment: comment
        });
    }
    
    function setDataToDatabase(date, timerange, lastname, firstname, email, topic) {
        db.push().set({
            "date": date,
            "timerange": timerange,
            "lastname": lastname,
            "firstname": firstname,
            "email": email,
            "topic": topic,
            "comment": ""
        }).then(function(snapshot) {
            //location.reload();
        });
    }
    
    function init() {
        db = firebase.database().ref("/" + INQUIRIES);
    }
    
    that.init = init;
    that.setDataToDatabase = setDataToDatabase;
    that.updateDatabase = updateDatabase;
    that.deleteInquiryFromDatabase = deleteInquiryFromDatabase;
    return that;
}());