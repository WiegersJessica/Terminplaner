var Scheduler = Scheduler || {};
Scheduler.Start = (function () {
    "use strict";
    
    var that = {},
        creationAppointmentContainer,
        overviewAppointmentContainer,
        creationButtonHeader,
        overviewButtonHeader;
    
    //Klick-Event: Reiter Terminübersicht
    function initHeaderOverview() {
        overviewButtonHeader = document.querySelector(".overview-appointment-button");
        overviewButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "none";
            overviewAppointmentContainer.style.display = "block";
            overviewButtonHeader.classList.add("active");
            creationButtonHeader.classList.remove("active");
            
            Scheduler.AppointmentOverview.init();
        });
    }
    
    //Klick-Event: Reiter Terminerstellung
    function initHeaderCreation() {
        creationButtonHeader = document.querySelector(".creation-appointment-button");
        creationButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "block";
            overviewAppointmentContainer.style.display = "none";
            overviewButtonHeader.classList.remove("active");
            creationButtonHeader.classList.add("active");
        });
    }
    
    //Header Reiter: Terminerstellung, Terminübersicht
    function initHeader() {
        initHeaderCreation();
        initHeaderOverview();
    }
    
    //Ansichten: Terminerstellung, Terminübersicht
    function initContainers() {
        creationAppointmentContainer = document.querySelector(".appointment-creation-box");
        creationAppointmentContainer.style.display = "block";
        
        overviewAppointmentContainer = document.querySelector(".appointment-overview-box");
        overviewAppointmentContainer.style.display = "none";
    }
    
    function init() {
        initContainers();
        initHeader();
        Scheduler.AppointmentCreation.init(); //Ansicht Terminerstellung ist zu Beginn aktiv
        Scheduler.DatabaseAppointments.init();
        //Scheduler.DatabaseInquiries.init();
    }
    
    that.init = init;
    return that;
}());