var Scheduler = Scheduler || {};
Scheduler.AdminStart = (function () {
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
        administrationButtonHeader = document.querySelector(".administration-appointment-button_admin");
        administrationButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "none";
            overviewAppointmentContainer.style.display = "none";
            administrationAppointmentContainer.style.display = "block";
            creationButtonHeader.classList.remove("active");
            overviewButtonHeader.classList.remove("active");
            administrationButtonHeader.classList.add("active");
            /**/
            Scheduler.InquiryOverview.init();
        });
    }
    
    //Klick-Event: Reiter Terminübersicht
    function initHeaderOverview() {
        overviewButtonHeader = document.querySelector(".overview-appointment-button_admin");
        overviewButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "none";
            overviewAppointmentContainer.style.display = "block";
            administrationAppointmentContainer.style.display = "none";
            overviewButtonHeader.classList.add("active");
            creationButtonHeader.classList.remove("active");
            administrationButtonHeader.classList.remove("active");
            Scheduler.AppointmentOverview.init();
        });
    }
    
    //Klick-Event: Reiter Terminerstellung
    function initHeaderCreation() {
        creationButtonHeader = document.querySelector(".creation-appointment-button_admin");
        creationButtonHeader.addEventListener("click", function() {
            creationAppointmentContainer.style.display = "block";
            overviewAppointmentContainer.style.display = "none";
            administrationAppointmentContainer.style.display = "none";
            overviewButtonHeader.classList.remove("active");
            creationButtonHeader.classList.add("active");
            administrationButtonHeader.classList.remove("active");
        });
    }
    
    //Header Reiter: Terminerstellung, Terminübersicht
    function initHeader() {
        initHeaderCreation();
        initHeaderOverview();
        initHeaderAdministration();
    }
    
    //Ansichten: Terminerstellung, Terminübersicht
    function initContainers() {
        creationAppointmentContainer = document.querySelector(".appointment-creation-box_admin");
        creationAppointmentContainer.style.display = "block";
        
        overviewAppointmentContainer = document.querySelector(".appointment-overview-box_admin");
        overviewAppointmentContainer.style.display = "none";
        
        administrationAppointmentContainer = document.querySelector(".appointment-administration-box_admin");
        administrationAppointmentContainer.style.display = "none";
    }
    
    function init() {
        console.log("user");
        $(window).scrollTop(0);
        initContainers();
        initHeader();
        Scheduler.CreationAdmin.init(); //Ansicht Terminerstellung ist zu Beginn aktiv
        Scheduler.DatabaseTopics.init();
        Scheduler.DatabaseOfficeHours.init();
        Scheduler.AppointmentOverview.setupTableButtons();
        Scheduler.InquiryOverview.setupButtonDeleteAll();
        Scheduler.InquiryOverview.setupModalNotification();
        Scheduler.InquiryOverview.setupModalDelete();
        Scheduler.AppointmentOverview.setupModalDelete();
        Scheduler.CalendarAppointments.init();
    }
    
    that.init = init;
    return that;
}());