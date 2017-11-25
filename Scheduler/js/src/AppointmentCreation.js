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
        commentField,
        topicDurationMap = {},
        durationArray = [],
        /**/
        personArray = [],
        durationEmptyAlert,
        chartWrongAlert,
        chartAlertText,
        currentTimerange,
        sendModal;
    
    function hideChartContainer() {
        var chartContainer = document.querySelector(".inner-wrap-free-appointments");
        chartContainer.style.display = "none";
    }
    
    function showChartContainer() {
        var chartContainer = document.querySelector(".inner-wrap-free-appointments");
        chartContainer.style.display = "block";
    }
    
     function showDurationAlert(){
        durationEmptyAlert.classList.remove("hidden");
        window.setTimeout(function() {
            durationEmptyAlert.classList.add("hidden")
        }, 6000);
    }
    
    /**/
    function setupChartAdmin(chart) {
        var colorArray = [], ctx, myPieChart;
        for(var i = 0; i < durationArray.length; i++) {
            if(durationArray[i] === "besetzt") {
                colorArray[i] = "rgb(205,92,92)"; //rot
            } else {
                colorArray[i] = "rgb(152,251,152)"; //grün
            }
        }
        
        ctx = document.querySelector(chart);
        myPieChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: personArray,
                datasets: [{
                    data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    backgroundColor: colorArray,
                    borderColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                cutoutPercentage: 50,
                title: {
                    display: true,
                    fontSize: 17,
                    text: "Sprechstundenbelegung"
                },
                tooltips: {
                    enabled: true,
                    bodyFontSize: 15
                },
                legend: {
                    display: false
                },
                layout: {
                    padding: {
                        left: 40,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }          
            }
        });
    }
    
    function showChartForStudent(date, timerange) {
        if (durationField.value === ""){
            showDurationAlert();
        } else {
            showChartContainer();
            initChart(date, timerange);
            window.setTimeout(function() {
                setupChart("#myChart");
            }, 250);
        }
    }
    
    /**/
    function showChartForAdmin(date, timerange) {
        showChartContainer();
        initChart(date, timerange);
        window.setTimeout(function() {
            /**/
            setupChartAdmin("#chart-admin");
        }, 250); 
    }
    
    /*Externer Aufruf: CalendarAppointments.js*/
    function setupDateAndTimerangeField(date, timerange) {
        dateField.value = date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0];;
        timerangeField.value = timerange;
        currentTimerange = timerange; //Braucht man das?
    }
    
    function showChartAlert(chartAlertText){
         console.log("ahow chart alert" + chartAlertText);
         chartWrongAlert.innerHTML = "";
         chartWrongAlert.innerHTML = chartAlertText;
         chartWrongAlert.classList.remove("hidden");
         //evt. wenn klick und alert offen dann hidden
            window.setTimeout(function() {                
                chartWrongAlert.classList.add("hidden");
            }, 2000);
    }
    
    function setupChart(chart){ /**/
        console.log("setupChart " + durationArray.length);
       /* var sumDuration = 0, freeMinutes = 60;
        for(var i = 0; i < durationArray.length; i++){
            sumDuration = parseInt(sumDuration) + parseInt(durationArray[i]);
            console.log("sum " + sumDuration);
        }
        freeMinutes = freeMinutes - sumDuration;
        console.log("free "+ freeMinutes);
        durationArray.push(freeMinutes);*/
        
        // colors
        var colorArray = [], indexPoint = "", indexPointNext = "", startPointHour, startPointMinutes, endPointHour, endPointMinutes;
        for(var i = 0; i < durationArray.length; i++){
            if(durationArray[i] === "besetzt"){
                colorArray[i] = 'rgb(205,92,92)';
                console.log("red");
            } else {
                colorArray[i] = 'rgb(152,251,152)';
                console.log("green");
            }
        }
        
        var ctx = document.querySelector(chart);
        console.log(ctx);
        //console.log("drrrrr" + durationArray);
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
                
                data: {
                    //labels: ["besetzt", "besetzt", "frei", "besetzt", "frei", "frei"],
                    labels: durationArray,
                    datasets: [{
                        //label: '# of Votes',
                        data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,],
                        backgroundColor: colorArray,
                        borderColor: [],
                        borderWidth: 1,
                        //pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        //pointHoverBorderColor: "rgba(220,220,220,1)",
                        //pointHoverBorderWidth: 7
                    }]
                },
             options: {
                 cutoutPercentage: 50,
                 title: {
                     display: true,
                     fontSize: 14,
                     text: 'Sprechstundenübersicht als 6o Minuten'
                },
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
                     },
                 events: ['click']
                             
                        },
                });
        //myPieChart.update();
        /*$("#myChart").click(function(evt){
        console.log(evt);
        var activePoints = ctx.getSegmentsAtEvent(evt);           
        
        console.log(activePoints);
        ); 
    }*/
        
      /*  ctx.mousemove = function(evt){            
            var hoverPoint = myPieChart.getElementsAtEvent(evt);
            console.log("hoverPoint[0]");
           // myPieChart.data.datasets[0].pointHoverBackgroundColor[hoverPoint[0]._index] = 'yellow';
            myPieChart.data.datasets[0].backgroundColor[indexPoint] = 'yellow';
            
            
        }*/
        ctx.onclick = function(evt){
            //if index in array ist besetzt ist besetzt dann message
            //letzter geklickter Slot wieder auf normale Farbe
            var minuteValue, hourValue;
            if (durationField.value === "5" && indexPoint !== ""){
                myPieChart.data.datasets[0].backgroundColor[indexPoint] = 'rgb(152,251,152)';
                indexPoint = "";
                myPieChart.update();
               // activeSlots = 0;
            }
            if (durationField.value === "10" && indexPoint !== ""){
                myPieChart.data.datasets[0].backgroundColor[indexPoint] = 'rgb(152,251,152)';
                myPieChart.data.datasets[0].backgroundColor[indexPointNext] = 'rgb(152,251,152)';
                indexPoint = "";
                //indexPointSecond = "";
                //activeSlots = 0;
            }
           
            var activePoint = myPieChart.getElementsAtEvent(evt);
            //console.log(activePoint[0]);
           
            indexPoint = activePoint[0]._index;
            indexPointNext = indexPoint + 1;
            if(indexPoint === 11){
                indexPointNext = 0;
            }
            //activeSlots = parseInt(activeSlots) + 1;
          //  console.log(activeSlots);
            //indexPoint = indexPoint._index;
            console.log(durationArray);
            //wenn Zeitslot im Chart frei
            if (durationArray[indexPoint] === "frei"){
                startPointHour = currentTimerange.substr(0,2);
                console.log(startPointHour);
                startPointMinutes = parseInt(indexPoint) * 5;
                endPointHour = currentTimerange.substr(0,2);
                console.log(endPointHour);
                endPointMinutes = startPointMinutes + parseInt(durationField.value);
                minuteValue = parseInt(currentTimerange.substr(3,2));
                //wenn start bei 5Minunten dann für startPoint statt 5 - 05
                if (startPointMinutes < 10){
                    startPointMinutes = "0" + startPointMinutes;
                }
                if(endPointMinutes <= minuteValue){
                    console.log("kleiner gleich");
                    startPointHour = parseInt(startPointHour) + 1
                    endPointHour = parseInt(endPointHour) + 1;
                }
                //wenn ende bei 60Minuten dann für endPint statt 60 - 00
                if (endPointMinutes >= 60){
                    endPointHour = parseInt(endPointHour) + 1;
                    endPointMinutes = endPointMinutes - 60;
                    endPointMinutes = "0" + endPointMinutes;
                }
                 if (endPointMinutes === 5){
                    endPointMinutes = "0" + endPointMinutes;
                }
                timerangeField.value = startPointHour + ":" + startPointMinutes + "-" + endPointHour + ":" + endPointMinutes;
                //der zweite Slot ist besetzt
                if(durationField.value === "10" && durationArray[indexPointNext] === "besetzt"){
                    timerangeField.value = currentTimerange;
                    indexPoint = "";
                    chartAlertText = "Dieser Termin passt hier nicht rein!";
                    console.log("der nächste ist besetzt");
                    showChartAlert(chartAlertText);
                }
                //die Sprechstunde ist vorbei
                //console.log(indexPoint + " dkfg");
                if(durationField.value === "10" && endPointMinutes == minuteValue + 5){
                    timerangeField.value = currentTimerange;
                    indexPoint = "";
                    chartAlertText = "Das ist nur ein 5-Minuten Termin!";
                    console.log("das ist nur noch ein 5 Minuten Termin");
                    showChartAlert(chartAlertText);
                }
                
            }
            //der erste Slot ist besetzt
                if(durationArray[indexPoint] === "besetzt"){
                    timerangeField.value = currentTimerange;
                    indexPoint = "";
                    chartAlertText = "Dieser Termin ist schon vergeben!";
                    console.log("einer ist besetzt");
                    showChartAlert(chartAlertText);
                }
                if(durationField.value === "5" && indexPoint !== ""){
                    myPieChart.data.datasets[activePoint[0]._datasetIndex].backgroundColor[indexPoint] = 'green'; 
                    myPieChart.update();
                }
                //myPieChart.data.datasets[activePoint[0]._datasetIndex].backgroundColor[indexPoint] = 'green';
                if(durationField.value === "10" && durationArray[indexPointNext] === "frei" && endPointMinutes !== minuteValue + 5 && indexPoint !== ""){
                    myPieChart.data.datasets[activePoint[0]._datasetIndex].backgroundColor[indexPoint] = 'green'; 
                    myPieChart.data.datasets[activePoint[0]._datasetIndex].backgroundColor[indexPointNext] = 'green'; 
                }
                myPieChart.update();
               // console.log(myPieChart.data.datasets[0].backgroundColor);
               // console.log(myPieChart.data.datasets[0].backgroundColor[5]);
            
          /*  if (durationArray[indexPointSecond] === "frei" && indexPointSecond !== ""){
                console.log("zweittterr");
                myPieChart.data.datasets[activePoint[0]._datasetIndex].backgroundColor[indexPoint+1] = 'green'; 
                myPieChart.update();
            }
            else{
                console.log("nicht klickbar2");
            }*/
                
            
        }; 
    }
    
   
    
    //gets all time slots of one business hour
    function initChart(selectedDate, selectedTimerange) {
        /**/
        var ref, appointment, date, timerange, timerangeInit, duration, arrayPosition, personAndTopic;
        durationArray = ["frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei"];
        /**/
        personArray = ["frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei", "frei"];
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + APPOINTMENTS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                appointment = childSnapshot.val();
                date = appointment.date;
                timerange = appointment.timerange;
                timerangeInit = appointment.timerangeInit;
                duration = appointment.duration;
                /**/
                personAndTopic = appointment.lastname + " " + appointment.firstname + ", " + appointment.topic;
                if(selectedDate === date && selectedTimerange.substr(0, 2) === timerangeInit.substr(0, 2)){
                    //console.log(selectedTimerange.substr(0, 2) + " " + timerange.substr(0, 2));
                    //console.log("jipp " + timerange.substr(3, 2));
                    arrayPosition = timerange.substr(3, 2); //40 min
                    console.log(arrayPosition);
                    //console.log("position " + arrayPosition);
                    arrayPosition = parseInt(arrayPosition) / 5; //8 (40min)
                    console.log(arrayPosition);
                    //wenn termin 10 minuten dauert ist der nächste 5er Slot auch besetzt
                    duration = parseInt(duration) / 5; //2 (1omin)
                    for (var j = 0; j < duration; j++){                        
                        durationArray[arrayPosition] = "besetzt";
                        /**/
                        personArray[arrayPosition] = personAndTopic;
                        console.log(personAndTopic);
                        arrayPosition++;
                    }
                    console.log(durationArray);
                   // console.log("positionDanach " + arrayPosition);
                    //durationArray.push(duration);
                    
                   //setupChart();                
                }
            });
        });   
    }
    
    /**/
    function checkInputFieldsForInquiry(date, lastname, firstname, email, comment) {
        var alertInquiry;
        if (lastname !== "" && firstname !== "" && email !== "") {
            Scheduler.DatabaseInquiries.setDataToDatabase(date, lastname, firstname, email, comment);
            location.reload(true);
        } else {
            alertInquiry = document.querySelector("#alert-inquiry");
            alertInquiry.classList.remove("hidden");
            window.setTimeout(function() {
                alertInquiry.classList.add("hidden")
            }, 3000);
        }
    }
    
    function checkInputFields() {
        if (topicField.value === "" || dateField.value === "" || timerangeField.value === "" || lastnameField.value === "" || firstnameField.value === "" || emailField.value === "") {
            return false;
        }
        return true;
    }
    
    function getTodaysDate(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 

        today = dd + '.' + mm + '.' + yyyy;
        
        return today
      }
    
    /**/
    function initSendInquiryButton() {
        var sendInquiryButton, date, lastname, firstname, email, comment;
        sendInquiryButton = document.querySelector("#request-button");
        sendInquiryButton.addEventListener("click", function() {
            date = getTodaysDate();
            lastname = lastnameField.value;
            firstname = firstnameField.value;
            email = emailField.value;
            comment = commentField.value;
            checkInputFieldsForInquiry(date, lastname, firstname, email, comment);
        });
    }
    
    function setupDate() {
        var germanDate, date;
        germanDate = dateField.value;
        date = germanDate.split(".")[2] + "-" + germanDate.split(".")[1] + "-" + germanDate.split(".")[0];
        return date;
    }
    
    function initAppointmentButton() {
        var appointmentButton, date, timerange, timerangeInit, lastname, firstname, email, topic, duration, code, key;
        appointmentButton = document.querySelector("#appointment-button");
        appointmentButton.addEventListener("click", function() {
            date = dateField.value;
            date = setupDate();
            timerange = timerangeField.value;
            timerangeInit = currentTimerange;
            lastname = lastnameField.value;
            firstname = firstnameField.value;
            email = emailField.value; //Validate E-Mail
            topic = topicField.value;
            duration = duration = durationField.value;
            //code = Scheduler.AppointmentDeletion.createRandomID();
            if(checkInputFields()) { //alles muss ausgefüllt sein!
                sendModal.style.display = "block";
                Scheduler.DatabaseAppointments.setDataToDatabase(date, timerange, timerangeInit, lastname, firstname, email, topic, duration);
            }
            //sendMail();
            
            //oder window.location.reload();
             //window.location.href = "index.html";
            //console.log("reload");
            //location.reload(true);
            
        });
    }
    
    /**/
    function checkTopicAndDuration() {
        var duration, eventKey = null;
        //Aus der Liste auswählen
        $("#topic-list").bind('input', function (event) {
            if (eventKey === null || ("" === $(this).val() && eventKey === 8)) {
                if (topicField.value in topicDurationMap) {
                    duration = topicDurationMap[topicField.value];
                    durationField.value = duration;
                }
            }
            eventKey = null;
        });
        
        //Selbst eingeben
        topicField.onkeyup = (function() {
            if (topicField.value in topicDurationMap) {
                duration = topicDurationMap[topicField.value];
                durationField.value = duration;
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
        /**/
        topicList.addEventListener("change", function() {
            console.log("click");
        });
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
        commentField = document.querySelector("#comment");
        durationEmptyAlert = document.getElementById("duration-empty");
        chartWrongAlert = document.getElementById("chart-wrong");
        sendModal = document.getElementById("sendModal");
        
        //Kein Termin mehr verfügbar --> Terminanfrage senden
        
        setupTopicList();
        checkTopicAndDuration();
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
    /**/
    that.showChartForAdmin = showChartForAdmin;
    that.showChartForStudent = showChartForStudent;
    that.setupDateAndTimerangeField = setupDateAndTimerangeField;
    that.hideChartContainer = hideChartContainer;
    return that;
}());