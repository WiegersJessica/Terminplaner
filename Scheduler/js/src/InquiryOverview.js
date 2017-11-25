var Scheduler = Scheduler || {};
Scheduler.InquiryOverview = (function () {
    "use strict";
    
    var that = {},
        login,
        tableBody,
        recipientsList,
        commentTrackedColumn,
        idCounter = 0,
        INQUIRIES = "Anfragen",
        emails = [],
        sendMailModal,
        /*-*/
        deleteInquiryModel,
        column;
    
    function setupButtonDeleteAll() {
        var buttonDeleteAll = document.querySelector("#delete-all-button");
        buttonDeleteAll.addEventListener("click", function() {
            console.log("delete");
            Scheduler.DatabaseInquiries.deleteAllInquiriesFromDatabase();
        });
    }

    //Matthias:
    //emails ist ein Array und darin stecken alle E-Mails, die eine Benachrichtigung erhalten sollen!
    //Mit der forEach-Schleife geht man ja alle E-Mails durch, so kannst du dann jedem eine E-Mail senden oder?
    //In messageText steckt der vorbereitete Text!!!
    function setupModalNotification() {
        var messageTextarea, messageText, buttonSendNotification;
        sendMailModal = document.getElementById("messageModal");
        messageTextarea = document.querySelector("#modal-message-input");
        buttonSendNotification = document.querySelector("#modal-button-message-send");
        
        buttonSendNotification.addEventListener("click", function() {
            messageText = messageTextarea.value; //NACHRICHT, die geschickt werden soll!!!
            console.log(messageText);
            emails.forEach(function(email) { //in email ist die EMAIL!!!
                $.ajax({
                    url: 'send_info',
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    complete: reload_site
                });
                //SENDMAIL(email, messageText) !!! --> SERVER
            });
            //reload;
        });
    }
    
    function setupRecipientsListModal(childSnapshot) {
        var listElement, appointment;
        appointment = childSnapshot.val();
        
        listElement = document.createElement("li");
        listElement.classList.add("recipients-list-element");
        listElement.innerHTML = appointment.email;
        recipientsList.appendChild(listElement);
        emails.push(appointment.email);
    }
    
    /*-*/
    function setupModalDelete() {
        var buttonDelete, row, key;
        deleteInquiryModel = document.querySelector("#modal-delete-inquiry");
        buttonDelete = document.querySelector("#modal-button-inquiry-delete");
        
        buttonDelete.addEventListener("click", function() {
            row = column.parentNode;
            row.parentNode.removeChild(row); /*Tabelle --> Reihe entfernen*/
            key = row.getAttribute("row-key"); /*Key --> Entsprechenden Termin aus der Datenbank löschen*/
            Scheduler.DatabaseInquiries.deleteInquiryFromDatabase(key); /*Entsprechenden Termin aus der Datenbank löschen*/
        });
    }
    
    //Löschen: Klick auf das Löschen-Symbol
    /*-*/
    function iconDeleteAddEventListener(iconDelete) {
        iconDelete.addEventListener("click", function(event) {
            column = event.target.parentNode;
        });
    }
    
    //Löschen
    function setupDeleteColumn() {
        var deleteColumn, iconDelete;
        deleteColumn = document.createElement("td");
        deleteColumn.classList.add("appointment-table-body");
        
        iconDelete = document.createElement("span");
        iconDelete.className = "glyphicon glyphicon-trash";
        iconDelete.classList.add("delete-appointment-icon"); /*Notwendig für's Styling*/
        
        iconDelete.setAttribute("data-toggle", "modal");
        iconDelete.setAttribute("data-target", "#modal-delete-person");
        
        iconDeleteAddEventListener(iconDelete);
        deleteColumn.appendChild(iconDelete);
        return deleteColumn;
    }
    
    //Kommentar (allgemein)
    function setupCommentColumn(appointment) {
        var commentColumn = document.createElement("td");
        commentColumn.classList.add("appointment-table-body");
        //commentColumn.classList.add("comment-column"); /*Zusätzlich notwendig für's Styling*/
        commentColumn.setAttribute("id", "general");
        commentColumn.innerHTML = appointment.comment;
        return commentColumn;
    }
    
    //E-Mail
    function setupEmailColumn(appointment) {
        var emailColumn = document.createElement("td");
        emailColumn.classList.add("appointment-table-body");
        emailColumn.innerHTML = appointment.email;
        return emailColumn;
    }
    
    //Vorname
    function setupFirstnameColumn(appointment) {
        var firstnameColumn = document.createElement("td");
        firstnameColumn.classList.add("appointment-table-body");
        firstnameColumn.innerHTML = appointment.firstname;
        return firstnameColumn;
    }
    
    //Nachname
    function setupLastnameColumn(appointment) {
        var lastnameColumn = document.createElement("td");
        lastnameColumn.classList.add("appointment-table-body");
        lastnameColumn.innerHTML = appointment.lastname;
        return lastnameColumn;
    }
    
    function setupDateColumn(appointment){
        var dateColumn = document.createElement("td");
        dateColumn.classList.add("appointment-table-body");
        dateColumn.innerHTML = appointment.date;
        return dateColumn;
    }
    
    /*Update*/
    function setupTableRow(childSnapshot) {
        var key, appointment, tableRow,
            dateColumn, lastnameColumn, firstnameColumn, emailColumn, commentColumn, deleteColumn;

        key = childSnapshot.key();
        appointment = childSnapshot.val();
        
        /*Eine Reihe*/
        tableRow = document.createElement("tr");
        tableRow.setAttribute("row-id", idCounter); //0, 1, 2, 3, 4, ...
        tableRow.setAttribute("row-key", key); //Schlüssel in Firebase-Datenbank
        
        //Hier noch das Datum rein machen!
        dateColumn = setupDateColumn(appointment);
        lastnameColumn = setupLastnameColumn(appointment);
        firstnameColumn = setupFirstnameColumn(appointment);
        emailColumn = setupEmailColumn(appointment);
        commentColumn = setupCommentColumn(appointment);
        deleteColumn = setupDeleteColumn();
            
        tableRow.appendChild(dateColumn);
        tableRow.appendChild(lastnameColumn);
        tableRow.appendChild(firstnameColumn);
        tableRow.appendChild(emailColumn);
        tableRow.appendChild(commentColumn);
        tableRow.appendChild(deleteColumn);
        
        idCounter++;
        return tableRow;       
    }
    
    function setupInquiriesTable(childSnapshot) {
        var tableRow = setupTableRow(childSnapshot); //Jeden Eintrag nacheinander holen
        tableBody.appendChild(tableRow);
    }
        
    //Tabelle erstellen
    function getDataFromDatabase() {
        var ref;
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + INQUIRIES);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                setupInquiriesTable(childSnapshot);
                setupRecipientsListModal(childSnapshot);
            });
        }); 
    }
    
    //Empfänger-Liste leeren
    function clearRecipientsList() {
        recipientsList = document.querySelector("#modal-recipients-list");
        while(recipientsList.firstChild) {
            recipientsList.removeChild(recipientsList.firstChild);
        }
        emails = [];
    }
    
    //Tabelle leeren
    function clearTable() {
        idCounter = 0;
        tableBody = document.querySelector("#table-body-inquiries");
        while(tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
    }
    
    /**/
    function init() {
        clearTable();
        clearRecipientsList();
        getDataFromDatabase();
    }
    
    that.init = init;
    that.setupButtonDeleteAll = setupButtonDeleteAll;
    /*-*/
    that.setupModalNotification = setupModalNotification;
    /*-*/
    that.setupModalDelete = setupModalDelete;
    
    return that;
}());