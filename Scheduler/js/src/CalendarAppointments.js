var Scheduler = Scheduler || {};
Scheduler.CalendarAppointments = (function () {
    "use strict";
    /* eslint-env browser  */
    
    var that = {},
        userRight,
        deleteModal,
        clickedAppointment,
        appointmentClicked = false,
        lastDate = $("#calendar"),
        lastAppointment = document.querySelector("#calendar"),
        OFFICE_HOURS = "Sprechstunden";
    
    function setCalendarEntries(user){
        userRight = user;
        $('#calendar').fullCalendar({
            columnFormat: 'dddd',
            timeFormat: 'HH:mm',
            locale: 'de',
            timezone: 'local',
            displayEventEnd: true,
            eventLimit: 2,
            eventLimitText: "Sprechstunden",
            firstDay: 1,
            businessHours: true,
            weekNumbers: true,
            weekNumbersWithinDays: true,
            showNonCurrentDates: true,
            
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            
            views: {
                month: {
                    type: 'agenda',
                    buttonText: 'Monat',
                    //hiddenDays: [ 0, 6 ] //Samstag (0) und Sonntag (0) nicht anzeigen
                },
                week: {
                    type: 'agendaWeek',
                    firstDay: 1,
                    buttonText: 'Woche',
                },
                day: {
                    type: 'agenda',
                    duration: { days: 1 },
                    buttonText: 'Tag'
                },
                listWeek: {
                    buttonText: 'Übersicht'
                }
            },
            
            //Samstag und Sonntag ausgegraut
            businessHours: {
                dow: [ 1, 2, 3, 4, 5 ], //Montag bis Freitag
                start: '10:00',
                end: '18:00',
            },
            
            //Klick auf einen Tag:
            dayClick: function(date, event, view) {
                var date, timerange;
                date = date.format(); //Datum
                timerange = "";
                
                if(userRight === "admin") {
                    Scheduler.AppointmentCreation.hideChartContainer();
                    Scheduler.CreationAdmin.setupDateField(date);
                } else {
                    //Scheduler.AppointmentCreation.hideChartContainer();
                    Scheduler.AppointmentCreation.setupDateAndTimerangeField(date, timerange);
                }
                
                //COLOR
                if (appointmentClicked) {
                    lastAppointment.style.backgroundColor = "#2A88AD";
                } else {
                    lastDate.css('background-color', 'white');
                }
                $(this).css('background-color', '#C2C2C2'); //Hervorhebung
                lastDate = $(this);
                appointmentClicked = false;
            },
            
            eventRender: function (event, element) {
                element.attr("data-toggle", "modal");
                element.attr("data-target", "#modal-delete-appointment");
            },
            
            //Klick auf eine Sprechstunde:
            eventClick: function(event, element) {
                var date, time, timeStart, timeEnd, timerange;
                appointmentClicked = true;
                date = event.start._i.split(" ")[0];
                time = event.start._i.split(" ")[1];
                timeStart = event.start._i.split(" ")[1].split(":")[0] + ":" + event.start._i.split(" ")[1].split(":")[1];
                timeEnd = event.end._i.split(" ")[1].split(":")[0] + ":" + event.end._i.split(" ")[1].split(":")[1];
                timerange = timeStart + "-" + timeEnd;
                
                /**/
                if(userRight === "admin") { //Nur Admin kann Termin wieder löschen
                    clickedAppointment = event;
                    Scheduler.AppointmentCreation.showChartForAdmin(date, timerange);
                } else {
                    Scheduler.AppointmentCreation.setupDateAndTimerangeField(date, timerange);
                    Scheduler.AppointmentCreation.showChartForStudent(date, timerange);
                }
                
                //COLOR
                if (appointmentClicked) {
                    lastAppointment.style.backgroundColor = "#2A88AD";
                    $('#calendar').css('background-color', 'white');
                    lastDate.css('background-color', 'white');
                } else {
                    
                }
                
                element.target.parentNode.style.backgroundColor = "#C2C2C2";
                //element.target.style.backgroundColor = "#C2C2C2";
                lastAppointment = element.target.parentNode;
            },
            
            /**/
            eventMouseover: function(event, element) {
                var timeStart, timeEnd;
                timeStart = event.start._i.split(" ")[1].split(":")[0] + ":" + event.start._i.split(" ")[1].split(":")[1];
                timeEnd = event.end._i.split(" ")[1].split(":")[0] + ":" + event.end._i.split(" ")[1].split(":")[1];
                element.target.setAttribute ('style','cursor:default');
                element.target.setAttribute ('title', event.title + "\n" + "Beginn: " + timeStart + " Uhr\n" + "Ende: " + timeEnd + " Uhr");
                if (userRight === "admin"){
                    element.target.setAttribute ('style','cursor:pointer');
                }
            },
        });
        
        //Sprechstunden aus der Datenbank
        //Uhrzeit noch anpassen
        var ref, key, date, timeStart, timeEnd, appointment;
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + OFFICE_HOURS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                key = childSnapshot.key();
                appointment = childSnapshot.val();
                date = appointment.date;
                timeStart = appointment.timestart;
                timeEnd = appointment.timeend;
                
                var officeHour = {
                    title: "Sprechstunde",
                    start: date + " " + timeStart,
                    end: date + " " + timeEnd,
                    allDay: false,
                    key: key
                };
                
                $('#calendar').fullCalendar('renderEvent', officeHour, true);
                //FARBE
            });
        });
    }
    
    function setupModalDelete() {
        var deleteButton, notDeleteButton;
        deleteModal = document.getElementById("modal-delete-appointment");
        deleteButton = document.getElementById("delete-button");
        
        deleteButton.addEventListener("click", function(){
            $('#calendar').fullCalendar('removeEvents' , clickedAppointment._id);
            Scheduler.DatabaseOfficeHours.deleteOfficeHourFromDatabase(clickedAppointment.key);
        });
    }
    
    function init() {
        setupModalDelete();
    }
    
    that.init = init;
    that.setCalendarEntries = setCalendarEntries;
    return that;
}());