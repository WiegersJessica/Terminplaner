var Scheduler = Scheduler || {};
Scheduler.CalendarAppointments = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        OFFICE_HOURS = "Sprechstunden",
        deleteButton,
        userRight;
    
    
    function setupOfficeHours() {
    }
    
    //noch Sprechstundenzeiten aus der Datenbank holen
    //nur Admin Berechtigung zu löschen evt. bei Klick löschen --> Alert wirklich löschen
    function setCalendarEntries(user){
        console.log("log" + user);
        userRight = user;
        $('#calendar').fullCalendar({
            locale: 'de',
            firstDay: 1,
            //weekends: false, // will hide Saturdays and Sundays
            //defaultView: 'agenda', // or 'agenda' or 'basic'
            /*dayClick: function(event) {
                alert('a day has been clicked!');
            },*/
             header: {
                 center: 'month,week,day' // buttons for switching between views
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
                }
            },
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
            
                        businessHours: {
                            // days of week. an array of zero-based day of week integers (0=Sunday)
                            dow: [ 1, 2, 3, 4 ], // Monday - Thursday

                                start: '10:00', // a start time (10am in this example)
                                end: '18:00', // an end time (6pm in this example)
                            },
            
                    eventClick: function(event, element) {
                        if(userRight == "admin"){
                            deleteBusinessHour(event);
                        }
                        },
            
            eventMouseover: function(event, element){
                console.log(element.target);
                element.target.setAttribute ('style','cursor:default');
                element.target.style.backgroundColor = "grey";
                //evt. cursor:url(path_to_file.cur)
                if(userRight == "admin"){
                    element.target.setAttribute ('style','cursor:pointer');
                //element.target.style.backgroundColor = "grey";
                }
                
            },
        });
        
        
        //Sprechstunden aus der Datenbank
        //Uhrzeit noch anpassen
        var ref, date, timerange, appointment;
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + OFFICE_HOURS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                
                appointment = childSnapshot.val();
                date = appointment.date;
                timerange = appointment.timerange;
                
                var officeHour = {
                    title: "Sprechstunde",
                    start: date + " 12:00:00",
                    end: date + " 14:00:00"
                };
                
                $('#calendar').fullCalendar('renderEvent', officeHour, true);
                //FARBE
            });
       });
    }
    
    function deleteBusinessHour(event){
        $('#deleteModal').modal("show");
        deleteButton = document.getElementById("delete_Button");
        deleteButton.addEventListener("click", function(){
            $('#deleteModal').modal("hide");
            $('#calendar').fullCalendar('removeEvents' , event._id);
            //delete Event from Database
        });
    }
    
  
    
    function init() {
        
    }
    
    that.init = init;
    that.setCalendarEntries = setCalendarEntries;
    return that;
}());