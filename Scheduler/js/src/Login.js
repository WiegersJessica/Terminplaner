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
        passwordWrongAlert;
    
   
    function checkSignIn(){
        inputEmail = document.getElementById("inputEmail").value;
        inputPassword = document.getElementById("inputPassword").value;
        console.log(inputEmail);
        if(inputEmail == email & inputPassword == password){
            console.log("hier auf Admin Seite verlinken");
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
        
    }
    
    that.init = init;
    return that;
}());