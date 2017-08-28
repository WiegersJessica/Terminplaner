var Scheduler = Scheduler || {};
Scheduler.Login = (function () {
    "use strict";
    
    var that = {},        
        /*DATENBANK - VORAB LÖSUNG MIT ARRAY UND MAP*/
        email = "test@mail.de",
        password = "Planer",
        signInButton,
        inputEmail,
        inputPassword,
        passwordWrongAlert,
        loginWindow,
        adminWindow;
    
   
    function checkSignIn(){
        inputEmail = document.getElementById("inputEmail").value;
        inputPassword = document.getElementById("inputPassword").value;
        if(inputEmail == email & inputPassword == password){
        //if(inputEmail == "a"){
            loginWindow.classList.add("hidden");
            adminWindow.classList.remove("hidden");
           //Kalender laden
            Scheduler.CalendarAppointments.setCalendarEntries();
            Scheduler.AdminStart.init();
  
        } else{
            passwordWrongAlert.classList.remove("hidden");
            window.setTimeout(function() {
                 passwordWrongAlert.classList.add("hidden")}, 5000);
        }
        
        
    }
    
    
    function init() {
        signInButton = document.getElementById("sign_in_button");
        signInButton.addEventListener("click", checkSignIn);
        passwordWrongAlert = document.getElementById("password-wrong");
        loginWindow = document.getElementById("login_window");
        adminWindow = document.getElementById("admin_window");
        
    }
    
    that.init = init;
    return that;
}());