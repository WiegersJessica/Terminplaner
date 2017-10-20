var Scheduler = Scheduler || {};
Scheduler.AppointmentCreation = (function () {
    "use strict";
    
    var that = {},
        TOPICS = "Sprechstundengründe",
        APPOINTMENTS = "Termine",
        topicField,
        durationField,
        dateField,
        timerangeField,
        lastnameField,
        firstnameField,
        emailField,
        topicDurationMap = {},
        durationArray = [];
    
    
    //Überarbeiten
    function setupRangeSlider(){
        var slider = $(".time-box"),
        range = $("#minutes-range"),
        value = $("#minutes-value"),
        minutes;
        
        value.each(function(){
            minutes = $(this).prev().attr("value");
            $(this).html(minutes);
        });

        range.on("input", function() {
            $(this).next(value).html(this.value);
        });
    }
    
    /*Externer Aufruf: CalendarAppointments.js*/
    function setupDateAndTimerangeField(date, timerange) {
        dateField.value = date;
        timerangeField.value = timerange;
        initChart(date);
    }
    
    function setupChart(){
        var sumDuration = 0, freeMinutes = 60;
        for(var i = 0; i < durationArray.length; i++){
            sumDuration = parseInt(sumDuration) + parseInt(durationArray[i]);
            console.log(sumDuration);
        }
        freeMinutes = freeMinutes - sumDuration;
        console.log(freeMinutes);
        durationArray.push(freeMinutes);
        
        var ctx = document.getElementById("myChart");
        console.log("drrrrr" + durationArray);
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
                
                data: {
                    //labels: ["besetzt", "besetzt", "frei", "besetzt", "frei", "frei"],
                    labels: ["Minuten", "Minuten", "Minuten"],
                    datasets: [{
                        //label: '# of Votes',
                        data: durationArray,
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
                            },
                         legend: {
                            display: false,
                            //position: 'bottom',
                        },
                 layout: {
            padding: {
                left: 50,
                right: 0,
                top: 0,
                bottom: 0
            }
        }
                             
                        },
                });
        
        /*$("#myChart").click(function(evt){
        console.log(evt);
        var activePoints = ctx.getSegmentsAtEvent(evt);           
        
        console.log(activePoints);
        ); 
    }*/
        ctx.onclick = function(evt){
            var activePoint = myPieChart.getElementsAtEvent(evt);
            console.log(activePoint);
            var indexPoint = activePoint[0];
            //index welcher Zeitslot geklickt wurde
            console.log(indexPoint._index);
        }; 
    }
    
    function initChart(selectedDate){
        var ref, appointment, date, timerange, duration;
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + APPOINTMENTS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                appointment = childSnapshot.val();
                date = appointment.date;
                console.log("date" + date);
                timerange = appointment.timerange;
                duration = appointment.duration;
                console.log(duration);
                if(selectedDate === date){
                    console.log("jipp");
                    durationArray.push(duration);
                    console.log(durationArray);                    
                }            
            });            
            setupChart();
        });            
    }
    
    function checkInputFields() {
        if (topicField.value === "" || dateField.value === "" || timerangeField.value === "" || lastnameField.value === "" || firstnameField.value === "" || emailField.value === "") {
            return false;
        }
        return true;
    }
    
    /**/
    function initSendInquiryButton() {
        var sendInquiryButton, lastname, firstname, email;
        sendInquiryButton = document.querySelector("#request-button");
        sendInquiryButton.addEventListener("click", function() {
            lastname = lastnameField.value;
            firstname = firstnameField.value;
            email = emailField.value;
            if (lastnameField.value !== "" && firstnameField.value !== "" && emailField.value !== "") {
                Scheduler.DatabaseInquiries.setDataToDatabase(lastname, firstname, email);
            }
        });
    }
    
    function initAppointmentButton() {
        var appointmentButton, date, timerange, lastname, firstname, email, topic, duration;
        appointmentButton = document.querySelector("#appointment-button");
        appointmentButton.addEventListener("click", function() {
            date = dateField.value;
            timerange = timerangeField.value;
            lastname = lastnameField.value;
            firstname = firstnameField.value;
            email = emailField.value; //Validate E-Mail
            topic = topicField.value;
            duration = duration = durationField.value;
            //if(checkInputFields()) { alles muss ausgefüllt sein!
                Scheduler.DatabaseAppointments.setDataToDatabase(date, timerange, lastname, firstname, email, topic, duration);
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
        setupRangeSlider();
    }
    
    function initAppointmentForm() {
        initAppointmentInformation();
        initAppointmentButton();
        /**/
        initSendInquiryButton();
        //initChart();
    }
    
    function init() {
        initAppointmentForm(); //Terminerstellung, linke Seite
        //initCalendar();
    }
    
    that.init = init;
    that.setupDateAndTimerangeField = setupDateAndTimerangeField;
    return that;
}());