var Scheduler = Scheduler || {};
Scheduler.CalendarAppointments = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        OFFICE_HOURS = "Sprechstunden",
        deleteButton,
        userRight,
        lastDate = $("#calendar");
    
    function setCalendarEntries(user){
        console.log("log" + user);
        userRight = user;
        $('#calendar').fullCalendar({
            
            locale: 'de',
            firstDay: 1,
            
            businessHours: true, // emphasizes business hours
            
            editable: true, // event dragging & resizing!!!!!!!!! NUR ADMIN + ÄNDERUNGEN IN DER DATENBANK!!!!
            
            //weekends: false, // will hide Saturdays and Sundays
            //defaultView: 'agenda', // or 'agenda' or 'basic'
            
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            //timezone: 'local',
            views: {
                month: {
                    type: 'agenda',
                    buttonText: 'Monat',
                     //hiddenDays: [ 0, 6 ]
                },
                week: {
                    type: 'agendaWeek',
                    firstDay: 1,
                    //duration: { days: 7 },
                    buttonText: 'Woche',
                    //hiddenDays: [ 0, 6 ]
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
            
            //?
            businessHours: {
                //days of week. an array of zero-based day of week integers (0=Sunday)
                dow: [ 1, 2, 3, 4 ], // Monday - Thursday
                start: '10:00', // a start time (10am in this example)
                end: '18:00', // an end time (6pm in this example)
            },
            
            //Klick auf einen Tag:
            dayClick: function(date, event, view) {
                var date, timerange; //Überarbeiten
                date = date.format();
                timerange = "";
                console.log("Datum: " + date); //Datum
                console.log("Ansicht: " + view.name); //Ansicht (Monat, Woche, Tag)
                
                if(userRight === "admin") {
                    Scheduler.CreationAdmin.setupDateField(date);
                } else {
                    Scheduler.AppointmentCreation.setupDateAndTimerangeField(date, timerange);
                }
                
                lastDate.css('background-color', 'white');
                lastDate = $(this);
                $(this).css('background-color', 'grey'); //Datum, das der Student auswählt, soll hervorgehoben werden!
            },
            
            //Klick auf eine Sprechstunde:
            eventClick: function(event, element) {
                var date, time, timeStart, timeEnd, timerange;
                date = event.start._i.split(" ")[0];
                time = event.start._i.split(" ")[1];
                timeStart = event.start._i.split(" ")[1].split(":")[0] + ":" + event.start._i.split(" ")[1].split(":")[1];
                timeEnd = event.end._i.split(" ")[1].split(":")[0] + ":" + event.end._i.split(" ")[1].split(":")[1];
                timerange = timeStart + "-" + timeEnd;
                
                if(userRight === "admin") { //Nur Admin kann Termin wieder löschen
                    deleteBusinessHour(event);
                } else {
                    Scheduler.AppointmentCreation.setupDateAndTimerangeField(date, timerange);
                }
            },
            
            eventMouseover: function(event, element){
                element.target.setAttribute ('style','cursor:default');
                element.target.setAttribute ('title', event.title + "\n" +  "Beginn: " + timeStart  + " Uhr\n" + "Ende: " + timeEnd + " Uhr"); //Überarbeiten
                element.target.style.backgroundColor = "grey";
                //evt. cursor:url(path_to_file.cur)
                if(userRight === "admin"){
                    element.target.setAttribute ('style','cursor:pointer');
                    //element.target.style.backgroundColor = "grey";
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
                
                //Überarbeiten
                timeStart = appointment.timestart;
                timeEnd = appointment.timeend;
                console.log("Start " + timeStart);
                console.log("Ende " + timeEnd);
                
                var officeHour = {
                    title: "Sprechstunde",
                    start: date + " " + timeStart,
                    end: date + " " + timeEnd,
                    allDay: false, // will make the time show: ???
                    key: key
                };
                
                $('#calendar').fullCalendar('renderEvent', officeHour, true);
                //FARBE
            });
        });
 
        
    }
    
    function deleteBusinessHour(event) {
        $('#deleteModal').modal("show");
        deleteButton = document.getElementById("delete_Button");
        deleteButton.addEventListener("click", function(){
            $('#deleteModal').modal("hide");
            $('#calendar').fullCalendar('removeEvents' , event._id);
            Scheduler.DatabaseOfficeHours.deleteOfficeHourFromDatabase(event.key);
        });
    }
    
  
    
    function init() {
        
    }
    
    that.init = init;
    that.setCalendarEntries = setCalendarEntries;
    return that;
}());



/*
Test-Sprechstunden:

eventSources: [
                // your event source
                {
                    //setupOfficeHours();
                    events: [ // put the array in the `events` property
                        {
                            title  : 'Sprechstunde1',
                            start  : '2017-08-26 10:00:00',
                            end    : '2017-08-26 12:00:00',
                            id : 1
                            //dow: [6]
                            },
                        {
                            title  : 'Sprechstunde2',
                            start  : '2017-08-05',
                            end    : '2017-08-07'
                        },
                        {
                            title  : 'Sprechstunde3',
                            start  : '2017-08-09 12:30:00',
                            end    : '2017-08-10 13:30:00',
                        }
                        ],
                            color: 'grey',     // an option!
                            textColor: 'white' // an option!
                    },
            ],
*/