var Scheduler = Scheduler || {};
Scheduler.AppointmentOverview = (function () {
    "use strict";
    
    var that = {},
        login,
        tableBody,
        commentGeneralColumn,
        commentTrackedColumn,
        idCounter = 0,
        adminPlan = true,
        APPOINTMENTS = "Termine";
    
    function setupStudentPDFTable(doc) {
        var source, buttons, txt, width;
        $.each( $('#overview-table tr'), function (i, row){
            $.each( $(row).find(".render-student"), function(j, cell){
                txt = $(cell).text().trim() || " ";
                width = (j === 0 || j === 1) ? 120 : 160; //1. und 2. Spalte schmaler
                if (i === 0) { //Header der Tabelle
                    doc.setFontSize(14); 
                    doc.setFontType("bold");
                    doc.cell(25, 80, width, 40, txt, i);
                    //Wie kann man den Text mittig setzen?
                } else {
                    doc.margins = 1; //?
                    doc.setFontSize(12);
                    //doc.setFont("courier");
                    doc.setFontType("bolditalic ");
                    doc.cell(25, 80, width, 30, txt, i);
                }
            });
        });
    }
    
    function setupPDFHeader(doc) {
        doc.text(50, 40, "Sprechstunden-Übersicht");
        //Styling wird nicht übernommen!:
        doc.setFontSize(30);
        doc.setFontType("bold");
        doc.cellInitialize(); //?
    }
    
    function setupStudentPlanPDF() {
        var doc = new jsPDF('p', 'pt', 'letter'); //l for landscape, p for portrait
        setupPDFHeader(doc); //Überschrift
        setupStudentPDFTable(doc); //Tabelle
        doc.save('Türplan.pdf');
    }
    
    function setupAdminPDFTable(doc) { //Spalten stylen
        var source, buttons, txt, width;
        $.each( $('#overview-table tr'), function (i, row){
            $.each( $(row).find(".render"), function(j, cell){
                txt = $(cell).text().trim() || " ";
                width = (j === 0 || j === 1) ? 80 : 150; //1. und 2. Spalte schmaler
                if (i === 0) { //Header der Tabelle
                    doc.setFontSize(14); 
                    doc.setFontType("bold");
                    doc.cell(10, 80, width, 40, txt, i);
                    //Wie kann man den Text mittig setzen?
                } else {
                    doc.margins = 1; //?
                    doc.setFontSize(12);
                    //doc.setFont("courier");
                    doc.setFontType("bolditalic ");
                    doc.cell(10, 80, width, 30, txt, i);
                }
            });
        });
    }
    
    function setupAdminPlanPDF() {
        var doc = new jsPDF('l', 'pt', 'letter'); //l for landscape, p for portrait
        setupPDFHeader(doc); //Überschrift
        setupAdminPDFTable(doc); //Tabelle
        doc.save('Übersicht.pdf');
    }
    
    function setupButtonPDF() {
        var pdfButton = document.querySelector("#pdf-button");
        pdfButton.addEventListener("click", function() {
            if (adminPlan) {
                setupAdminPlanPDF();
            } else {
                setupStudentPlanPDF();
            }
        });
    }
    
    //Überarbeiten
    function planAdminButtonAddEventListener(planAdminButton) {
        planAdminButton.addEventListener("click", function() {
            login = true;
            adminPlan = true;
            clearTable();
            setupTableHead();
            setupAppointmentTable();
        });
    }
    
    //Überarbeiten
    function planStudentButtonAddEventListener(planStudentButton) {
        planStudentButton.addEventListener("click", function() {
            login = false;
            adminPlan = false;
            clearTable();
            setupTableHead();
            setupAppointmentTable();
            //Normal andere Tabelle holen
        });
    }
    
    function setupButtonsViews() {
        var planStudentButton, planAdminButton;
        planStudentButton = document.querySelector("#plan-student-button");
        planAdminButton = document.querySelector("#plan-admin-button");
        
        planStudentButtonAddEventListener(planStudentButton);
        planAdminButtonAddEventListener(planAdminButton);
    }
    
    function setupButtonTimerange() {
        var refreshButton = document.querySelector("#refresh-icon");
        refreshButton.addEventListener("click", function() {
            login = true;
            clearTable();
            setupAppointmentTable();
            //DATUM übergeben: Start und Ende!
        });
    }
    
    //PDF
    function setupTableButtons() {
        //setupButtonTimerange();
        setupButtonsViews();
        setupButtonPDF();
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
        var commentColumn;
        icon.addEventListener("click", function(event) {
            commentColumn = event.target.parentNode; /*Aktuelle Spalte über Parent holen*/
            commentColumn.innerHTML = commentField.value;
            commentColumn.addEventListener("click", commentColumnAddEventListener, false); /*Verfasster Kommentar soll klickbar sein --> Ändern*/
            commentField.style.display = "none";
            icon.style.display = "none";
            
            //UPDATE DATABASE
            Scheduler.DatabaseAppointments.updateDatabase(commentColumn.parentNode.getAttribute("row-key"), commentField.value, commentColumn.getAttribute("id"));
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
    
    /*Update*/
    //Kommentar (nachverfolgend)
    function setupCommentTrackedColumn(appointment) {
        commentTrackedColumn = document.createElement("td");
        commentTrackedColumn.classList.add("appointment-table-body");
        commentTrackedColumn.classList.add("comment-column"); /*Zusätzlich notwendig für's Styling*/
        commentTrackedColumn.setAttribute("id", "tracked");
        
        if (appointment.commentTracked === "") { //Noch kein Kommentar verfasst
            setupAddComment(commentTrackedColumn); 
        } else {
            setupComment(commentTrackedColumn, appointment.commentTracked);
        }
        
        return commentTrackedColumn;
    }
    
    //Kommentar (allgemein)
    function setupCommentGeneralColumn(appointment) {
        commentGeneralColumn = document.createElement("td");
        commentGeneralColumn.classList.add("appointment-table-body");
        commentGeneralColumn.classList.add("comment-column"); /*Zusätzlich notwendig für's Styling*/
        commentGeneralColumn.setAttribute("id", "general");
        
        if (appointment.commentGeneral === "") { //Noch kein Kommentar verfasst
            setupAddComment(commentGeneralColumn); 
        } else {
            setupComment(commentGeneralColumn, appointment.commentGeneral);
        }
        
        return commentGeneralColumn;
    }
    
    //E-Mail
    function setupEmailColumn(appointment) {
        var emailColumn = document.createElement("td");
        emailColumn.classList.add("appointment-table-body");
        emailColumn.classList.add("render");
        emailColumn.innerHTML = appointment.email;
        return emailColumn;
    }
    
    //Vorname
    function setupFirstnameColumn(appointment) {
        var firstnameColumn = document.createElement("td");
        firstnameColumn.classList.add("appointment-table-body");
        firstnameColumn.classList.add("render");
        firstnameColumn.classList.add("render-student");
        firstnameColumn.innerHTML = appointment.firstname;
        return firstnameColumn;
    }
    
    //Nachname
    function setupLastnameColumn(appointment) {
        var lastnameColumn = document.createElement("td");
        lastnameColumn.classList.add("appointment-table-body");
        lastnameColumn.classList.add("render");
        lastnameColumn.classList.add("render-student");
        lastnameColumn.innerHTML = appointment.lastname;
        return lastnameColumn;
    }
    
    //Sprechstundengrund
    function setupTopicColumn(appointment) {
        var topicColumn = document.createElement("td");
        topicColumn.classList.add("appointment-table-body");
        topicColumn.classList.add("render");
        topicColumn.innerHTML = appointment.topic;
        return topicColumn;
    }
    
    //Uhrzeit
    function setupTimerangeColumn(appointment) {
        var timerangeColumn = document.createElement("td");
        timerangeColumn.classList.add("appointment-table-body");
        timerangeColumn.classList.add("render");
        timerangeColumn.classList.add("render-student");
        timerangeColumn.innerHTML = appointment.timerange;
        return timerangeColumn;
    }
    
    //Datum
    function setupDateColumn(appointment) {
        var dateColumn = document.createElement("td"); /*Hier th --> fett*/
        dateColumn.classList.add("appointment-table-body");
        dateColumn.classList.add("render");
        dateColumn.classList.add("render-student");
        dateColumn.id = "appointment-date"; /*Notwendig für's Styling*/
        dateColumn.innerHTML = appointment.date;
        return dateColumn;
    }
    
    /*Update*/
    function setupTableRow(childSnapshot) {
        var key, appointment, tableRow, commentField,
            dateColumn, timerangeColumn, topicColumn, lastnameColumn, firstnameColumn, emailColumn, commentGeneralColumn, commentTrackedColumn,
            deleteColumn;
        
        key = childSnapshot.key();
        appointment = childSnapshot.val();
        
        /*Eine Reihe*/
        tableRow = document.createElement("tr");
        tableRow.setAttribute("row-id", idCounter); //0, 1, 2, 3, 4, ...
        tableRow.setAttribute("row-key", key); //Schlüssel in Firebase-Datenbank
        
        dateColumn = setupDateColumn(appointment);
        timerangeColumn = setupTimerangeColumn(appointment);
        lastnameColumn = setupLastnameColumn(appointment);
        firstnameColumn = setupFirstnameColumn(appointment);
        
        tableRow.appendChild(dateColumn);
        tableRow.appendChild(timerangeColumn);
        tableRow.appendChild(lastnameColumn);
        tableRow.appendChild(firstnameColumn);
        
        if (login) {
            emailColumn = setupEmailColumn(appointment);
            topicColumn = setupTopicColumn(appointment);
            commentGeneralColumn = setupCommentGeneralColumn(appointment);
            commentTrackedColumn = setupCommentTrackedColumn(appointment);
            deleteColumn = setupDeleteColumn();
            
            tableRow.appendChild(emailColumn);
            tableRow.appendChild(topicColumn);
            tableRow.appendChild(commentGeneralColumn);
            tableRow.appendChild(commentTrackedColumn);
            tableRow.appendChild(deleteColumn);
        }
        
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
    
    function setupTableHead() {
        var columns = document.querySelectorAll(".appointment-table-header");
        columns.forEach(function(item) {
            if (!login) {
                if (item.getAttribute("key") === "admin-only") {
                    item.classList.add("hidden");
                }
            } else {
                item.classList.remove("hidden");
            }
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
    
    function checkLogin() {
        login = Scheduler.Start.getLogin();
    }
    
    function init() {
        checkLogin();
        clearTable();
        setupTableHead();
        
        //Hier Start- und Enddatum übergeben und alle Einträge aus diesem Bereich holen!
        setupAppointmentTable();
        setupTableButtons();
    }
    
    that.init = init;
    return that;
}());



/*PDF:
//Dieser Bereich soll nicht im PDF-Dokument angezeigt werden:
buttons = {
    '#button-container': function (element, renderer) {
        return true;
    },
    '#header-delete': function (element, renderer) {
        return true;
    }
};

/*source = window.document.querySelector(".appointment-overview-box_admin");
doc.fromHTML(source, 15, 15, {'elementHandlers': buttons });*/