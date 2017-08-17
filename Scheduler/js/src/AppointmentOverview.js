var Scheduler = Scheduler || {};
Scheduler.AppointmentOverview = (function () {
    "use strict";
    
    var that = {},
        tableBody,
        commentColumn,
        idCounter = 0,
        APPOINTMENTS = "Termine";
    
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
            Scheduler.DatabaseAppointments.deleteAppointmentFromDatabase(key); /*Entsprechenden Termin aus der Datenbank löschen*/
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
        icon.addEventListener("click", function(event) {
            commentColumn = event.target.parentNode; /*Aktuelle Spalte über Parent holen*/
            commentColumn.innerHTML = commentField.value;
            commentColumn.addEventListener("click", commentColumnAddEventListener, false); /*Verfasster Kommentar soll klickbar sein --> Ändern*/
            commentField.style.display = "none";
            icon.style.display = "none";
            
            //UPDATE DATABASE
            /**/
            Scheduler.DatabaseAppointments.updateDatabase(commentColumn.parentNode.getAttribute("row-key"), commentField.value);
        });
    }
    
    //Kommentar (bereits verfasst)
    function setupComment(appointment) {
        commentColumn.innerHTML = appointment.comment;
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
    function setupAddComment() {
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
    
    //Kommentar
    function setupCommentColumn(appointment) {
        commentColumn = document.createElement("td");
        commentColumn.classList.add("appointment-table-body");
        commentColumn.classList.add("comment-column"); /*Zusätzlich notwendig für's Styling*/
        
        if (appointment.comment === "") { //Noch kein Kommentar verfasst
            setupAddComment(); 
        } else {
            setupComment(appointment);
        }
        
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
    
    //Sprechstundengrund
    function setupTopicColumn(appointment) {
        var topicColumn = document.createElement("td");
        topicColumn.classList.add("appointment-table-body");
        topicColumn.innerHTML = appointment.topic;
        return topicColumn;
    }
    
    //Uhrzeit
    function setupTimerangeColumn(appointment) {
        var timerangeColumn = document.createElement("td");
        timerangeColumn.classList.add("appointment-table-body");
        timerangeColumn.innerHTML = appointment.timerange;
        return timerangeColumn;
    }
    
    //Datum
    function setupDateColumn(appointment) {
        var dateColumn = document.createElement("th"); /*Hier th --> fett*/
        dateColumn.classList.add("appointment-table-body");
        dateColumn.id = "appointment-date"; /*Notwendig für's Styling*/
        dateColumn.innerHTML = appointment.date;
        return dateColumn;
    }
    
    function setupTableRow(childSnapshot) {
        var key, appointment, tableRow, commentField,
            dateColumn, timerangeColumn, topicColumn, lastnameColumn, firstnameColumn, emailColumn, commentColumn, deleteColumn;
        
        key = childSnapshot.key();
        appointment = childSnapshot.val();
        
        /*Eine Reihe*/
        tableRow = document.createElement("tr");
        tableRow.setAttribute("row-id", idCounter); //0, 1, 2, 3, 4, ...
        tableRow.setAttribute("row-key", key); //Schlüssel in Firebase-Datenbank
        
        dateColumn = setupDateColumn(appointment);
        timerangeColumn = setupTimerangeColumn(appointment);
        topicColumn = setupTopicColumn(appointment);
        lastnameColumn = setupLastnameColumn(appointment);
        firstnameColumn = setupFirstnameColumn(appointment);
        emailColumn = setupEmailColumn(appointment);
        commentColumn = setupCommentColumn(appointment);
        deleteColumn = setupDeleteColumn();
        
        tableRow.appendChild(dateColumn);
        tableRow.appendChild(timerangeColumn);
        tableRow.appendChild(topicColumn);
        tableRow.appendChild(lastnameColumn);
        tableRow.appendChild(firstnameColumn);
        tableRow.appendChild(emailColumn);
        tableRow.appendChild(commentColumn);
        tableRow.appendChild(deleteColumn);
        
        idCounter++;
        return tableRow;       
    }
    
    //Tabelle erstellen
    function setupAppointmentTable() {
        var ref, tableRow;
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + APPOINTMENTS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                tableRow = setupTableRow(childSnapshot); //Jeden Eintrag nacheinander holen
                tableBody.appendChild(tableRow);
            });
        }); 
    }
    
    //Tabelle leeren
    function clearTable() {
        idCounter = 0;
        tableBody = document.querySelector("#table-body");
        while(tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
    }
    
    function init() {
        clearTable();
        setupAppointmentTable();
    }
    
    that.init = init;
    return that;
}());