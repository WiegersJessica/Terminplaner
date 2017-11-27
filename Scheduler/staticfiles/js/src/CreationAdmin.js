var Scheduler = Scheduler || {};
Scheduler.CreationAdmin = (function () {
    "use strict";
    
    var that = {},
        dateField,
        timeStartField,
        timeEndField;

    /*Externer Aufruf: CalendarAppointments.js*/
    function setupDateField(date) {
        dateField.value = date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0];
    }
    
    function setupDate() {
        var germanDate, date;
        germanDate = dateField.value;
        date = germanDate.split(".")[2] + "-" + germanDate.split(".")[1] + "-" + germanDate.split(".")[0];
        return date;
    }
    
    function checkTimeField() {
        var saveModal, minutesAlertWrong, date;
        saveModal = document.getElementById("saveModal");
        minutesAlertWrong = document.getElementById("minutesWrong");
        
        if (timeStartField.value.substr(4,1) === "0" || timeStartField.value.substr(4,1) === "5") {
            if (checkInputFields(dateField, timeStartField, timeEndField)) {
                saveModal.style.display = "block";
                date = setupDate();
                Scheduler.DatabaseOfficeHours.setDataToDatabase(date, timeStartField.value, timeEndField.value);
            }
        } else {
            minutesAlertWrong.classList.remove("hidden");
            window.setTimeout(function() {
                minutesAlertWrong.classList.add("hidden")
            }, 5000);
        }
    }
    
    function checkDateField() {
        var emptyDateAlert = document.getElementById("empty-date-field");
        if (dateField.value === "") {
            emptyDateAlert.classList.remove("hidden");
            window.setTimeout(function() {
                emptyDateAlert.classList.add("hidden")
            }, 5000);
        }
    }
    
    function initAddOfficeHourButton() {
        var addOfficeHourButton;
        addOfficeHourButton = document.querySelector("#add-appointment-button_admin");
        addOfficeHourButton.addEventListener("click", function() {
            checkDateField();
            checkTimeField();
        });
    }
    
    //Setzt die Endzeit automatisch eine Stunde später als die Startzeit 
    function initTimeFieldsChange(){
        var startTime, endTime;
        timeStartField.onchange = (function() {
            startTime = timeStartField.value;
            endTime = parseInt(startTime.substr(0,2)) + 1;
            if (endTime < 10){
                endTime = "0" + endTime;
            }
            timeEndField.value = endTime + startTime.substr(2,3);           
        });
    }
    /*
    startMinutes = startTime.substr(3,2);
            console.log(startMinutes);
            if(parseInt(startTime.substr(4,1)) < 5){
                console.log("minuten sind kleiner 5");
                startTime = startTime.substr(0,startTime.length-1) + "0";
                console.log(startTime);
            }
            if(parseInt(startTime.substr(4,1)) > 5){
                console.log("minuten größer 5");
                startTime = startTime.substr(3, 2);
                startTime = startTime + 
            }
            endTime = parseInt(startTime.substr(0,2)) + 1;
            if (endTime < 10){
                endTime = "0" + endTime;
            }
            
            */
    
    //Neuen Sprechstundentermin hinzufügen
    function initOfficeHourCreation() {
        dateField = document.querySelector("#date");
        timeStartField = document.querySelector("#period-start");
        timeEndField = document.querySelector("#period-end");
        initTimeFieldsChange();
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