var Scheduler = Scheduler || {};
Scheduler.CalendarAppointments = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {};
    
    
    //noch Sprechstundenzeiten aus der Datenbank holen
    function setCalendarEntries(){
        $('#calendar').fullCalendar({
            default: 2,
            locale: 'de',
            //defaultView: 'timeline', // or 'agenda' or 'basic'    
             header: {
                 center: 'month,week,day' // buttons for switching between views
    },
            views: {
                month: {
                    type: 'agenda',
                    buttonText: 'Monat',
                },
                week: {
                    type: 'agenda',
                    duration: { days: 7 },
                    buttonText: 'Woche'
                    },
                day:{
                    type: 'agenda',
                    duration: { days: 1 },
                    buttonText: 'Tag'
        
                    }
    },
            eventSources: [
                // your event source
                {
                    events: [ // put the array in the `events` property
                        {
                            title  : 'Sprechstunde1',
                            start  : '2017-08-26 12:00:00',
                            end    : '2017-08-26 14:00:00'
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
                    }

        // any other event sources...

    ]

});
    }
    
  
    
    function init() {
        
    }
    
    that.init = init;
    that.setCalendarEntries = setCalendarEntries;
    return that;
}());