var Scheduler = Scheduler || {};
Scheduler.CreationAdmin = (function () {
    "use strict";
    
    var that = {};

    function initAddOfficeHourButton(dateField, timerangeField) {
        var addOfficeHourButton = document.querySelector("#add-appointment-button_admin");
        addOfficeHourButton.addEventListener("click", function() {
            if (checkInputFields(dateField, timerangeField)) {
                Scheduler.DatabaseOfficeHours.setDataToDatabase(dateField.value, timerangeField.value);
            }
        });
    }
    
    //Neuen Sprechstundentermin hinzufügen
    function initOfficeHourCreation() {
        var dateField, timerangeField;
        dateField = document.querySelector("#date");
        timerangeField = document.querySelector("#period");
        initAddOfficeHourButton(dateField, timerangeField);
    }
    
    //Neuen Sprechstundengrund hinzufügen
    function checkInputFields(fieldOne, fieldTwo) {
        if (fieldOne.value === "" || fieldTwo.value === "") {
            return false;
        }
        return true;
    }
    
    //Neuen Sprechstundengrund hinzufügen
    function initAddTopicButton(topicField, durationField) {
        var addTopicButton = document.querySelector("#add-topic-button_admin");
        addTopicButton.addEventListener("click", function() {
            if (checkInputFields(topicField, durationField)) {
                Scheduler.DatabaseTopics.setDataToDatabase(topicField.value, durationField.value);
            }
        });
    }
    
    //Neuen Sprechstundengrund hinzufügen
    function initTopicCreation() {
        var topicField, durationField;
        topicField = document.querySelector("#topic-list");
        durationField = document.querySelector("#duration");
        initAddTopicButton(topicField, durationField);
    }
    
    function initAppointmentForm() {
        initTopicCreation(); //initAppointmentInformation();
        initOfficeHourCreation() //initAppointmentButton();
    }
    
    function init() {
        initAppointmentForm();
    }
    
    that.init = init;
    return that;
}());