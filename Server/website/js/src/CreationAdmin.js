var Scheduler = Scheduler || {};
Scheduler.CreationAdmin = (function () {
    "use strict";
    
    var that = {},
        dateField,
        timeStartField,
        timeEndField;

    /*Externer Aufruf: CalendarAppointments.js*/
    function setupDateField(date) {
        dateField.value = date;
        //timeStartField.value = timeStart;
        //timeEndField.value = timeEnd;
    }
    
    function initAddOfficeHourButton() {
        var addOfficeHourButton = document.querySelector("#add-appointment-button_admin");
        addOfficeHourButton.addEventListener("click", function() {
            if (checkInputFields(dateField, timeStartField, timeEndField)) {
                Scheduler.DatabaseOfficeHours.setDataToDatabase(dateField.value, timeStartField.value, timeEndField.value);
            }
        });
    }
    
    //Neuen Sprechstundentermin hinzufügen
    function initOfficeHourCreation() {
        dateField = document.querySelector("#date");
        timeStartField = document.querySelector("#period-start");
        timeEndField = document.querySelector("#period-end");
        initAddOfficeHourButton();
    }
    
    //Neuen Sprechstundengrund hinzufügen
    function checkInputFields(fieldOne, fieldTwo, fieldThree) {
        if (fieldOne.value === "" || fieldTwo.value === "" || fieldThree.value === "") {
            return false;
        }
        return true;
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
    that.setupDateField = setupDateField;
    return that;
}());