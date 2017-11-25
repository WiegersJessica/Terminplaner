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
    
    function deleteAllInquiriesFromDatabase() {
        var ref = firebase.database().ref("/" + INQUIRIES);
        ref.remove();
        //reload?
    }
    
    
    
    function updateDatabase(key, comment) {
        var ref = firebase.database().ref("/" + INQUIRIES + "/" + key);
        ref.update({
            comment: comment
        });
    }
    
    //+Dringlichkeit=comment
    function setDataToDatabase(date, lastname, firstname, email, comment) {
        db.push().set({
            "date": date,
            "lastname": lastname,
            "firstname": firstname,
            "email": email,
            "comment": comment
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
    that.deleteAllInquiriesFromDatabase = deleteAllInquiriesFromDatabase;
    return that;
}());