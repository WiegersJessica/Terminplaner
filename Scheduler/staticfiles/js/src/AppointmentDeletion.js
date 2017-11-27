var Scheduler = Scheduler || {};
Scheduler.AppointmentDeletion = (function () {
    "use strict";
    /* eslint-env browser  */
    var that = {},
        deleteButton,
        codeField,
        deleteModal,
        codeAlert;
    
   /* function createRandomID() {
        var id = "", possible;
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; 

        for( var i=0; i < 6; i++ ) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return id;
    }*/
    
    function deleteEntry() {
        deleteModal.style.display = "block";
    }
    
    function wrongCode() {
        codeAlert.innerHTML = "";
        codeAlert.innerHTML = "Dieser Code existiert nicht";
        codeAlert.classList.remove("hidden");
        window.setTimeout(function() {                
            codeAlert.classList.add("hidden");
        }, 2000);
    }
    
    function initSendButton() {
        var codeFieldValue;
        deleteButton.addEventListener("click", function() {
            codeFieldValue = codeField.value;    
            if(codeFieldValue === ""){
                codeAlert.innerHTML = "";
                codeAlert.innerHTML = "Das Eingabefeld ist leer";
                codeAlert.classList.remove("hidden");
                window.setTimeout(function() {                
                    codeAlert.classList.add("hidden");
                }, 2000);
            } else {
                Scheduler.DatabaseAppointments.deleteAppointmentFromDatabase(codeFieldValue);
            }
         });        
    }
        
    function initElements() {
        codeField = document.getElementById("inputCode");
        deleteModal = document.getElementById("deleteModal");
        deleteButton = document.getElementById("enter_code_button");
        codeAlert = document.getElementById("codeWrong");
    }
    
    function init() {
        initElements();
        initSendButton();         
    }
    
    that.deleteEntry = deleteEntry;
    that.wrongCode = wrongCode;
    that.init = init;
    //that.createRandomID = createRandomID;
    return that;
}());