var Scheduler = Scheduler || {};
Scheduler.InquiryOverview = (function () {
    "use strict";
    
    var that = {},
        login,
        tableBody,
        recipientsList,
        commentGeneralColumn,
        commentTrackedColumn,
        idCounter = 0,
        INQUIRIES = "Anfragen";
    
    
    function setupModal() {
        var messageTextarea = document.querySelector("#modal-message-input");
       // messageTextarea.innerHTML = "Ein neuer Sprechstundentermin steht zur Verfügung. Die zusätzliche Sprechstunde findet am ... statt. Sie können sich absofort für diesen Termin eintragen."
    }
    
    function setupRecipientsListModal(childSnapshot) {
        var listElement, appointment;
        appointment = childSnapshot.val();
        
        listElement = document.createElement("li");
        listElement.classList.add("recipients-list-element");
        listElement.innerHTML = appointment.email;
        recipientsList.appendChild(listElement);
    }
    
    //Löschen: Klick auf das Löschen-Symbol
    function iconDeleteAddEventListener(iconDelete) {
        var column, row, key;
        iconDelete.addEventListener("click", function(event) {
            column = event.target.parentNode;
            row = column.parentNode;
            row.parentNode.removeChild(row); /*Tabelle --> Reihe entfernen*/
            key = row.getAttribute("row-key"); /*Key --> Entsprechenden Termin aus der Datenbank löschen*/
            key = row.getAttribute("row-key"); /*Key --> Entsprechenden Termin aus der Datenbank löschen*/
            //UPDATE DATABASE
            Scheduler.DatabaseInquiries.deleteInquiryFromDatabase(key); /*Entsprechenden Termin aus der Datenbank löschen*/
        });
    }
    
    //Kommentar: Klick auf einen verfassten Kommentar (Textarea und Icon erscheinen und Kommentar kann upgedatet werden)
    function commentColumnAddEventListener(event) {
        var id, icon, commentField;
        commentField = setupTextarea();
        commentField.value = event.target.textContent;
        icon = setupIcon(commentField);

        event.target.innerHTML = "";
        event.target.appendChild(commentField);
        event.target.appendChild(icon);
        event.target.removeEventListener("click", commentColumnAddEventListener);
    }
    
    //Kommentar: Klick auf das Icon (Häkchen)
    function iconAddEventListener(icon, commentField) {
        var commentColumn;
        icon.addEventListener("click", function(event) {
            commentColumn = event.target.parentNode; /*Aktuelle Spalte über Parent holen*/
            commentColumn.innerHTML = commentField.value;
            commentColumn.addEventListener("click", commentColumnAddEventListener, false); /*Verfasster Kommentar soll klickbar sein --> Ändern*/
            commentField.style.display = "none";
            icon.style.display = "none";
            
            //UPDATE DATABASE
            Scheduler.DatabaseInquiries.updateDatabase(commentColumn.parentNode.getAttribute("row-key"), commentField.value, commentColumn.getAttribute("id"));
        });
    }
    
    //Kommentar (bereits verfasst)
    function setupComment(commentColumn, comment) {
        commentColumn.innerHTML = comment;
        commentColumn.addEventListener("click", commentColumnAddEventListener, false); /*Verfasster Kommentar soll klickbar sein --> Ändern*/
    }
    
    //Kommentar: Icon (Häkchen)
    function setupIcon(commentField) {
        var icon = document.createElement("span");
        icon.className = "glyphicon glyphicon-ok";
        icon.classList.add("add-comment-icon"); /*Notwendig für's Styling*/
        iconAddEventListener(icon, commentField); /*Kommentar wird hinzugefügt*/
        return icon;
    }
    
    //Kommentar: Textarea
    function setupTextarea() {
        var commentField = document.createElement("textarea");
        commentField.placeholder = "Kommentar";
        commentField.classList.add("comment-textarea"); /*Notwendig für's Styling*/
        return commentField;
    }
    
    //Kommentar
    function setupAddComment(commentColumn) {
        var commentField, icon;
        commentField = setupTextarea();
        icon = setupIcon(commentField);
        commentColumn.appendChild(commentField);
        commentColumn.appendChild(icon);
    }
    
    //Löschen
    function setupDeleteColumn() {
        var deleteColumn, iconDelete;
        deleteColumn = document.createElement("td");
        deleteColumn.classList.add("appointment-table-body");
        
        iconDelete = document.createElement("span");
        iconDelete.className = "glyphicon glyphicon-trash";
        iconDelete.classList.add("delete-appointment-icon"); /*Notwendig für's Styling*/
        iconDeleteAddEventListener(iconDelete);
        
        deleteColumn.appendChild(iconDelete);
        return deleteColumn;
    }
    
    //Kommentar (allgemein)
    function setupCommentGeneralColumn(appointment) {
        commentGeneralColumn = document.createElement("td");
        commentGeneralColumn.classList.add("appointment-table-body");
        commentGeneralColumn.classList.add("comment-column"); /*Zusätzlich notwendig für's Styling*/
        commentGeneralColumn.setAttribute("id", "general");
        
        if (appointment.comment === "") { //Noch kein Kommentar verfasst
            setupAddComment(commentGeneralColumn); 
        } else {
            setupComment(commentGeneralColumn, appointment.comment);
        }
        
        return commentGeneralColumn;
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
    
    /*Update*/
    function setupTableRow(childSnapshot) {
        var key, appointment, tableRow,
            lastnameColumn, firstnameColumn, emailColumn, commentGeneralColumn, deleteColumn;

        key = childSnapshot.key();
        appointment = childSnapshot.val();
        
        /*Eine Reihe*/
        tableRow = document.createElement("tr");
        tableRow.setAttribute("row-id", idCounter); //0, 1, 2, 3, 4, ...
        tableRow.setAttribute("row-key", key); //Schlüssel in Firebase-Datenbank
        
        lastnameColumn = setupLastnameColumn(appointment);
        firstnameColumn = setupFirstnameColumn(appointment);
        emailColumn = setupEmailColumn(appointment);
        commentGeneralColumn = setupCommentGeneralColumn(appointment);
        deleteColumn = setupDeleteColumn();
            
        tableRow.appendChild(lastnameColumn);
        tableRow.appendChild(firstnameColumn);
        tableRow.appendChild(emailColumn);
        tableRow.appendChild(commentGeneralColumn);
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
    }
    
    //Tabelle leeren
    function clearTable() {
        idCounter = 0;
        tableBody = document.querySelector("#table-body-inquiries");
        while(tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
    }
    
    function init() {
        clearTable();
        clearRecipientsList();
        getDataFromDatabase();
        setupModal();
    }
    
    that.init = init;
    return that;
}());