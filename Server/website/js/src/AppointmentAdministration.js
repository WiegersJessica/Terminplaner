var Scheduler = Scheduler || {};
Scheduler.AppointmentAdministration = (function () {
    "use strict";
    
    var that = {},
        topicField,
        durationField,
        dateField,
        timerangeField,
        lastnameField,
        firstnameField,
        emailField,
        
        /*DATENBANK - VORAB LÖSUNG MIT ARRAY UND MAP*/
        topicArray = ["Thema eins", "Thema zwei", "Thema drei", "Thema vier"],
        durationArray = ["10", "5", "15", "20"],
        topicDurationMap = {};
    
    function checkInputFields() {
        if (topicField.value === "" || dateField.value === "" || timerangeField.value === "" || lastnameField.value === "" || firstnameField.value === "" || emailField.value === "") {
            return false;
        }
        return true;
    }
    
    function initAppointmentButton() {
        var appointmentButton, date, timerange, lastname, firstname, email, topic;
        appointmentButton = document.querySelector("#appointment-button");
        appointmentButton.addEventListener("click", function() {
            //Datum, Uhrzeit, Nachname, Vorname, E-Mail, Grund -> DB
            date = dateField.value;
            timerange = timerangeField.value;
            lastname = lastnameField.value;
            firstname = firstnameField.value;
            email = emailField.value;
            topic = topicField.value;
            //Validate E-Mail
            
            //if(checkInputFields()) {
                Scheduler.DatabaseAppointments.setDataToDatabase(date, timerange, lastname, firstname, email, topic);
            //}
        });
    }
    
    //Überarbeiten
    function checkTopicAndDuration() {
        var duration;
        topicField.onchange = (function() { //onchange nicht ganz optimal!
            if (topicField.value in topicDurationMap) {
                duration = topicDurationMap[topicField.value];
                durationField.value = duration;
            } else {
                durationField.value = "...";
            }
        });
        
        //Selbst eingeben
        topicField.onkeyup = (function(){
            if (topicField.value in topicDurationMap) {
                duration = topicDurationMap[topicField.value];
                durationField.value = duration;
            } else {
                durationField.value = "...";
            }
        });
    }
    
    function setupTopicList() {
        var topicList, topic;
        topicList = document.querySelector("#topics");
        for (var i = 0; i < topicArray.length; i++) {
            topic = document.createElement("option");
            topic.class = "topic-option";
            topic.id = "option-" + i + 1;
            topic.value = topicArray[i];
            topic.setAttribute("duration", topicDurationMap[i]);
            topicList.appendChild(topic);
        }
    }
    
    function setupTopicDurationMap() {
        for (var i = 0; i < topicArray.length; i++) {
            topicDurationMap[topicArray[i]] = durationArray[i] + " Minuten";
        }
    }
    
    function initAppointmentInformation() {
        topicField = document.querySelector("#topic-list");
        durationField = document.querySelector("#duration");
        dateField = document.querySelector("#date"); //Sprechstunde Wolff: Immer Montag, Datum anpassen
        timerangeField = document.querySelector("#period"); //Sprechstunde Wolff: Immer gleiche Uhrzeit
        lastnameField = document.querySelector("#name");
        firstnameField = document.querySelector("#prename");
        emailField = document.querySelector("#email");
        
        //Kein Termin mehr verfügbar --> Terminanfrage senden
        
        setupTopicDurationMap();
        setupTopicList();
        checkTopicAndDuration();
    }
    
    function initAppointmentForm() {
        initAppointmentInformation();
        initAppointmentButton();
    }
    
    function init() {
        initAppointmentForm(); //Terminerstellung, linke Seite
        //initCalendar();
    }
    
    that.init = init;
    return that;
}());