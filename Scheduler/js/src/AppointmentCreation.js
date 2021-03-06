var Scheduler = Scheduler || {};
Scheduler.AppointmentCreation = (function () {
    "use strict";
    
    var that = {},
        TOPICS = "Sprechstundengründe",
        topicField,
        durationField,
        dateField,
        timerangeField,
        lastnameField,
        firstnameField,
        emailField,
        topicDurationMap = {};
    
    function initChart(){
            var ctx = document.getElementById("myChart");
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
    data: {
        labels: ["besetzt", "besetzt", "frei", "besetzt", "frei", "frei"],
        datasets: [{
            //label: '# of Votes',
            data: [7, 10, 5, 5, 2, 3],
            backgroundColor: [
                'rgb(205,92,92)',
                'rgb(205,92,92)',
                'rgb(152,251,152)',
                'rgb(205,92,92)',
                'rgb(152,251,152)',
                'rgb(152,251,152)'
            ],
            borderColor: [
                
            ],
            borderWidth: 1
        }]
    },
    options: {
        cutoutPercentage: 50,
        tooltips: {
            enabled: true
        }
    }
});
    }
    
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
            date = dateField.value;
            timerange = timerangeField.value;
            lastname = lastnameField.value;
            firstname = firstnameField.value;
            email = emailField.value; //Validate E-Mail
            topic = topicField.value;
            //if(checkInputFields()) { alles muss ausgefüllt sein!
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
    
    function setupTopicDurationMap(topic, duration) {
        topicDurationMap[topic] = duration;
    }
    
    function setupTopic(topic, duration) {
        var topicList, topicElement;
        topicList = document.querySelector("#topics");
        topicElement = document.createElement("option");
        topicElement.class = "topic-option";
        topicElement.value = topic;
        topicList.appendChild(topicElement);
    }
    
    function setupTopicList() {
        var ref, appointment, topic, duration;
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + TOPICS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                appointment = childSnapshot.val();
                topic = appointment.topic;
                duration = appointment.duration;
                
                setupTopic(topic, duration);
                setupTopicDurationMap(topic, duration);
            });
        }); 
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
        
        setupTopicList();
        checkTopicAndDuration();
    }
    
    function initAppointmentForm() {
        initAppointmentInformation();
        initAppointmentButton();
        initChart();
    }
    
    function init() {
        initAppointmentForm(); //Terminerstellung, linke Seite
        //initCalendar();
    }
    
    that.init = init;
    return that;
}());