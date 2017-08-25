var Scheduler = Scheduler || {};
Scheduler.Start = (function () {
    "use strict";
    
    var that = {},
        creationAppointmentContainer,
        overviewAppointmentContainer,
        administrationAppointmentContainer,
        creationButtonHeader,
        overviewButtonHeader,
        administrationButtonHeader;
    
     //Klick-Event: Reiter Terminverwaltung
    function initHeaderAdministration() {
        administrationButtonHeader = document.querySelector(".administration-appointment-button");
        administrationButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "none";
            overviewAppointmentContainer.style.display = "none";
            administrationAppointmentContainer.style.display = "block";
            creationButtonHeader.classList.remove("active");
            overviewButtonHeader.classList.remove("active");
            administrationButtonHeader.classList.add("active");
            
           // Scheduler.AppointmentOverview.init();
        });
    }
    
    //Klick-Event: Reiter Terminübersicht
    function initHeaderOverview() {
        overviewButtonHeader = document.querySelector(".overview-appointment-button");
        overviewButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "none";
            overviewAppointmentContainer.style.display = "block";
            administrationAppointmentContainer.style.display = "none";
            creationButtonHeader.classList.remove("active");
            overviewButtonHeader.classList.add("active");
            administrationButtonHeader.classList.remove("active");
            
            
            Scheduler.AppointmentOverview.init();
        });
    }
    
    //Klick-Event: Reiter Terminerstellung
    function initHeaderCreation() {
        creationButtonHeader = document.querySelector(".creation-appointment-button");
        creationButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "block";
            overviewAppointmentContainer.style.display = "none";
            administrationAppointmentContainer.style.display = "none";
            creationButtonHeader.classList.add("active");
            overviewButtonHeader.classList.remove("active");
            administrationButtonHeader.classList.remove("active");
        });
    }
    
    //Header Reiter: Terminerstellung, Terminübersicht, Terminverwaltung
    function initHeader() {
        initHeaderCreation();
        initHeaderOverview();
        initHeaderAdministration();
    }
    
    //Ansichten: Terminerstellung, Terminübersicht, Terminverwaltung
    function initContainers() {
        creationAppointmentContainer = document.querySelector(".appointment-creation-box");
        creationAppointmentContainer.style.display = "block";
        
        overviewAppointmentContainer = document.querySelector(".appointment-overview-box");
        overviewAppointmentContainer.style.display = "none";
        
        administrationAppointmentContainer = document.querySelector(".appointment-administration-box");
        administrationAppointmentContainer.style.display = "none";
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