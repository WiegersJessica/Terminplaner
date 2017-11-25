var Scheduler = Scheduler || {};
Scheduler.Login = (function () {
    "use strict";
    
    var that = {},
        LOGIN = "#login",
        /*DATENBANK - VORAB LÖSUNG MIT ARRAY UND MAP*/
        email = "admin@mail.de",
        password = "Planer",
        login = false,
        signInButton,
        inputEmail,
        inputPassword,
        passwordWrongAlert,
        loginWindow,
        adminWindow;
    
    function setupURL() {
        var url = window.location.href + LOGIN;
        window.location.href = url;
        location.reload();
    }
    
    function showAlert() {
        passwordWrongAlert.classList.remove("hidden");
        window.setTimeout(function() {
             passwordWrongAlert.classList.add("hidden")
        }, 5000);
    }
    
    function showAdminArea() {
        setupURL();
        setTimeout(function() {
            loginWindow.classList.add("hidden");
            adminWindow.classList.remove("hidden");
            Scheduler.CalendarAppointments.setCalendarEntries("admin");
            Scheduler.Start.setLogin();
            Scheduler.AdminStart.init();
        }, 1000);
    }
    
    function checkSignIn(){
        inputEmail = document.getElementById("inputEmail").value;
        inputPassword = document.getElementById("inputPassword").value;
        if(inputEmail === email && inputPassword === password){
            showAdminArea();
        } else {
            showAlert();
        }        
    }
    
    function checkAdminLogin() {
        if (window.location.href.indexOf(LOGIN) !== -1) {
            adminWindow.classList.remove("hidden");
            Scheduler.CalendarAppointments.setCalendarEntries("admin");
            Scheduler.Start.setLogin();
            Scheduler.AdminStart.init();
        } else {
            loginWindow.classList.remove("hidden");
        }
    }
    
    function init() {
        signInButton = document.getElementById("sign_in_button");
        signInButton.addEventListener("click", checkSignIn, false);
        passwordWrongAlert = document.getElementById("password-wrong");
        loginWindow = document.getElementById("login_window");
        adminWindow = document.getElementById("admin_window");
        
        checkAdminLogin();
    }
    
    that.init = init;
    return that;
}());