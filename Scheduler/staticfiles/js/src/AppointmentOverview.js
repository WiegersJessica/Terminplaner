var Scheduler = Scheduler || {};
Scheduler.AppointmentOverview = (function () {
    "use strict";
    
    var that = {},
        login,
        overviewTable,
        commentTable,
        noAppointment,
        tableBody,
        start,
        end,
        endCurrentWeek,
        startNextWeek,
        startDateMilliseconds,
        endDateMilliseconds,
        datepickerStartDate,
        datepickerEndDate,
        commentTableBody,
        planStudentButton,
        planAdminButton,
        planCommentButton,
        currentWeekButton,
        nextWeekButton,
        bothWeeksButton,
        idCounter = 0,
        counter = 0,
        adminPlan = true,
        studentPlan = false,
        commentPlan = false,
        currentWeek = false,
        nextWeek = false,
        APPOINTMENTS = "Termine",
        currentColumn,
        deleteModal;
        
    
    function setupNextWeekButton() {
        nextWeekButton = document.querySelector("#next-week");
        nextWeekButton.addEventListener("click", function() {
            login = false; //Braucht man?
            clearOverviewTable();
            currentWeek = false;
            nextWeek = true;
            setupStartDate();
            setupEndDate();
            showTable(startNextWeek, end);
            setButtonActive(nextWeekButton, currentWeekButton, bothWeeksButton);
        });
    }
    
    function setupCurrentWeekButton() {
        currentWeekButton = document.querySelector("#current-week");
        currentWeekButton.addEventListener("click", function() {
            login = false; //Braucht man?
            clearOverviewTable();
            currentWeek = true;
            nextWeek = false;
            setupStartDate();
            setupEndDate();
            showTable(start, endCurrentWeek);
            setButtonActive(currentWeekButton, nextWeekButton, bothWeeksButton);
        });
    }
    
    function setupBothWeeksButton() {
        bothWeeksButton = document.querySelector("#both-weeks");
        bothWeeksButton.addEventListener("click", function() {
            login = false; //Braucht man?
            clearOverviewTable();
            currentWeek = false;
            nextWeek = false;
            setupStartDate();
            setupEndDate();
            showTable(start, end);
            setButtonActive(bothWeeksButton, currentWeekButton, nextWeekButton);
        });
    }
    
    /*Extern*/
    function setupTableButtonsStudent() {
        setupBothWeeksButton();
        setupCurrentWeekButton();
        setupNextWeekButton();
        setButtonActive(bothWeeksButton, currentWeekButton, nextWeekButton);
    }
    
    //Zuerst nach Datum sortieren und dann noch nach Zeit
    function sortTableCommentPlan() {
        var table, rows, switching, i, x, dateX, y, dateY, timeX, timeY, shouldSwitch;
        table = document.getElementById("comment-table");
        switching = true;
        while (switching) {
            switching = false;
            rows = table.getElementsByTagName("tr");
            for (i = 0; i < (rows.length - 2); i = i + 2) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[0];
                y = rows[i + 2].getElementsByTagName("td")[0];
                dateX = x.textContent.split(",")[0].toLowerCase();
                dateY = y.textContent.split(",")[0].toLowerCase();
                if (dateX > dateY) {
                    shouldSwitch = true;
                    break;
                } else if (x.textContent.split(",")[0].toLowerCase() === y.textContent.split(",")[0].toLowerCase()) {
                    timeX = x.textContent.split(",")[1].toLowerCase();
                    timeY = y.textContent.split(",")[1].toLowerCase();
                    if (timeX > timeY) { //Klappt das wirklich so bei Uhrzeiten?
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 2], rows[i]);
                rows[i+1].parentNode.insertBefore(rows[i + 2], rows[i + 1]);
                switching = true;
            }
        }
    }
    
    /*-*/
    //Zuerst nach Datum sortieren und dann noch nach Zeit
    function sortTableDoorPlanDateAndTime(plan) {
        var table, rows, switching, i, dateX, dateY, timeX, timeY, shouldSwitch;
        table = document.getElementById(plan);
        switching = true;
        while (switching) {
            switching = false;
            rows = table.getElementsByTagName("tr");
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                dateX = rows[i].getElementsByTagName("td")[0];
                dateY = rows[i + 1].getElementsByTagName("td")[0];
                if (dateX.innerHTML.toLowerCase() > dateY.innerHTML.toLowerCase()) { //Klappt das wirklich so beim Datum?
                    shouldSwitch = true;
                    break;
                } else if (dateX.innerHTML.toLowerCase() === dateY.innerHTML.toLowerCase()) {
                    timeX = rows[i].getElementsByTagName("td")[1];
                    timeY = rows[i + 1].getElementsByTagName("td")[1];
                    if (timeX.innerHTML.toLowerCase() > timeY.innerHTML.toLowerCase()) { //Klappt das wirklich so bei Uhrzeiten?
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]); //Reihen tauschen
                switching = true;
            }
        }
    }
    
    function setupCommentPDFTable(doc) {
        var txt, width;
        $.each( $('#comment-table tr'), function (i, row) { //Reihe
            $.each( $(row).find(".render-comment"), function(j, cell) { //Spalte
                txt = $(cell).text().trim() || " ";
                width = (j === 0) ? 350 : 200;
                if (i % 2 === 0) { //Dünne Spalte
                    doc.setFontSize(12);
                    doc.setFontType("bold");
                    //doc.setDrawColor(150,150,150);
                    doc.cell(25, 51, width, 32, txt, i);
                    //Wie kann man den Text mittig setzen?
                } else {
                    //doc.margins = 1; //?
                    doc.setFontSize(12);
                    doc.setFontType("bolditalic ");
                    doc.cell(25, 80, width, 210, txt, i);
                }
            });
        });
    }
    
    function setupPDFHeader(doc) {
        doc.cellInitialize(); //?
        doc.text(50, 30, "Sprechstunden-Übersicht");
        //Styling wird nicht übernommen!:
        doc.setFontSize(30);
        doc.setFontType("bold");
    }
    
    function setupCommentPlanPDF() {
        var doc = new jsPDF('p', 'pt', 'letter'); //l for landscape, p for portrait
        setupPDFHeader(doc); //Überschrift
        setupCommentPDFTable(doc); //Tabelle
        doc.save('Kommentarplan.pdf');
    }
    
    function setupStudentPDFTable(doc) {
        var source, buttons, txt, width;
        $.each( $("#overview-table tr"), function (i, row) {
            $.each( $(row).find(".render-student"), function(j, cell) {
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
    
    function setupStudentPlanPDF() {
        var doc = new jsPDF('p', 'pt', 'letter'); //l for landscape, p for portrait
        setupPDFHeader(doc); //Überschrift
        setupStudentPDFTable(doc); //Tabelle
        doc.save('Türplan.pdf');
    }
    
    function setupAdminPDFTable(doc) { //Spalten stylen
        var source, buttons, txt, width;
        $.each( $("#overview-table tr"), function (i, row) {
            $.each( $(row).find(".render"), function(j, cell) {
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
            } else if (studentPlan) {
                setupStudentPlanPDF();
            } else {
                setupCommentPlanPDF();
            }
        });
    }
    
    function checkCounterAdminStudentPlan() {
        console.log(counter);
        if (counter !== 0) {
            overviewTable.style.display = "table"; //Wenn mind. ein Eintrag in der Tabelle ist, soll Tabelle angezeigt werden
            noAppointment.style.display = "none";
            counter = 0;
        } else {
            console.log("hier bin ich");
            overviewTable.style.display = "none";
            noAppointment.style.display = "block";
        }
    }
    
    function checkCounterCommentPlan() {
        console.log(counter);
        if (counter !== 0) {
            commentTable.style.display = "table"; //Wenn mind. ein Eintrag in der Tabelle ist, soll Tabelle angezeigt werden
            noAppointment.style.display = "none";
            counter = 0;
        } else {
            commentTable.style.display = "none"; 
            noAppointment.style.display = "block";
        }
    }
    
    //Gibt es Sprechstunden für den entsprechenden Zeitraum?
    function checkCounter() {
        console.log("check");
        if (commentPlan) {
            checkCounterCommentPlan();
        } else {
            checkCounterAdminStudentPlan();
        }
    }
    
    function setupColumnCommentTableRight(appointment) {
        var columnCommentRight = document.createElement("td");
        columnCommentRight.classList.add("comment-column");
        columnCommentRight.classList.add("comment-table-column-right");
        columnCommentRight.classList.add("render-comment");
        columnCommentRight.setAttribute("id", "comment-klinger"); //
        
        if (appointment.commentKlinger === "") {
            setupAddComment(columnCommentRight); 
        } else {
            setupComment(columnCommentRight, appointment.commentKlinger);
        }
        return columnCommentRight;
    }
    
    function setupColumnCommentTableLeft(appointment) {
        var columnCommentLeft = document.createElement("td");
        columnCommentLeft.classList.add("comment-column");
        columnCommentLeft.classList.add("comment-table-column-left");
        columnCommentLeft.classList.add("render-comment");
        columnCommentLeft.setAttribute("id", "comment-wolff");
        
        if (appointment.commentWolff === "") {
            setupAddComment(columnCommentLeft); 
        } else {
            setupComment(columnCommentLeft, appointment.commentWolff);
        }
        return columnCommentLeft;
    }
    
    function setupColumnsCommentTable(tableRow, appointment) {
        var columnCommentLeft, columnCommentRight;
        columnCommentLeft = setupColumnCommentTableLeft(appointment);
        columnCommentRight = setupColumnCommentTableRight(appointment);
        tableRow.appendChild(columnCommentLeft);
        tableRow.appendChild(columnCommentRight);
    }
    
    function setupTableRowComment(childSnapshot) {
        var key, appointment, tableRow;
        key = childSnapshot.key();
        appointment = childSnapshot.val();
        /*Eine Reihe*/
        tableRow = document.createElement("tr");
        tableRow.setAttribute("row-id", idCounter); //0, 1, 2, 3, 4, ...
        tableRow.setAttribute("row-key", key); //Schlüssel in Firebase-Datenbank
        
        setupColumnsCommentTable(tableRow, appointment);
        return tableRow;
    }
    
    function setupGermanDate(date) {
        var germanDate = date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0];
        return germanDate;
    }
    
    function setupColumnsCommentTableHeader(tableRow, appointment) {
        var columnPerson, column, date;
        //1. Spalte (links)
        date = setupGermanDate(appointment.date);
        columnPerson = document.createElement("td");
        columnPerson.classList.add("table-header"); //Für die Hintergrundfarbe
        columnPerson.classList.add("render-comment");
        columnPerson.innerHTML = "<b>" + date + "</b>, " + appointment.timerange+", "+appointment.firstname+" "+appointment.lastname+", "+appointment.topic;
    
        //2. Spalte (rechts)
        column = document.createElement("td");
        column.classList.add("table-header"); //Für die Hintergrundfarbe
        column.classList.add("render-comment");
        
        tableRow.appendChild(columnPerson);
        tableRow.appendChild(column);
    }
    
    //Brauch ich id und key?
    function setupTableRowCommentHeader(childSnapshot) {
        var key, appointment, tableRow;
        key = childSnapshot.key();
        appointment = childSnapshot.val();
        /*Eine Reihe*/
        tableRow = document.createElement("tr");
        tableRow.setAttribute("row-id", idCounter); //0, 1, 2, 3, 4, ...
        tableRow.setAttribute("row-key", key); //Schlüssel in Firebase-Datenbank
        
        
        tableRow.classList.add("comment-header"); //Für Sortieren
        
        
        setupColumnsCommentTableHeader(tableRow, appointment);
        idCounter++;
        return tableRow;       
    }
    
    function getAppointmentDate(childSnapshot) { //Datum der Sprechstunde (in Millisekunden zum Vergleich)
        var dateString, dateDay, dateMonth, dateYear, date, dateMilliseconds;
        dateString = childSnapshot.val().date;
        dateDay = dateString.split("-")[2];
        dateMonth = dateString.split("-")[1];
        dateYear = dateString.split("-")[0];
        date = new Date(dateYear, dateMonth - 1, dateDay); //Jahr, Monat, Tag
        dateMilliseconds = date.getTime();
        return dateMilliseconds;
    }
    
    function setupCommentTable() {
        var ref, tableRow, date;
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + APPOINTMENTS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                date = getAppointmentDate(childSnapshot);
                if(date >= startDateMilliseconds && date <= endDateMilliseconds) {
                    tableRow = setupTableRowCommentHeader(childSnapshot); //Jeden Eintrag nacheinander holen
                    commentTableBody.appendChild(tableRow);
                    tableRow = setupTableRowComment(childSnapshot); //Kommentarfeld linke und rechte Spalte
                    commentTableBody.appendChild(tableRow);
                    counter++;
                }
            });
            checkCounter();
            if (login) {
                sortTableCommentPlan();
            }
        }); 
    }
    
    function clearCommentTable() {
        while(commentTableBody.firstChild) {
            commentTableBody.removeChild(commentTableBody.firstChild);
        }
        idCounter = 0; //
    }
    
    function setButtonActive(active, notActiveOne, notActiveTwo) {
        active.classList.add("view-button-active");
        notActiveOne.classList.remove("view-button-active");
        notActiveTwo.classList.remove("view-button-active");
    }
    
    function planCommentButtonAddEventListener() {
        planCommentButton.addEventListener("click", function() {
            login = true; //Braucht man?
            adminPlan = false;
            studentPlan = false;
            commentPlan = true;
            clearCommentTable();
            /*Updaten?
            startDate = setupStartDate();
            endDate = setupEndDate();*/
            showTable("", "");
            setButtonActive(planCommentButton, planStudentButton, planAdminButton);
        });
    }
    
    function planAdminButtonAddEventListener() {
        planAdminButton.addEventListener("click", function() {
            login = true; //Braucht man?
            adminPlan = true;
            studentPlan = false;
            commentPlan = false;
            clearOverviewTable();
            /*Updaten?
            startDate = setupStartDate();
            endDate = setupEndDate();*/
            showTable("", "");
            setButtonActive(planAdminButton, planStudentButton, planCommentButton);
        });
    }
    
    function planStudentButtonAddEventListener() {
        planStudentButton.addEventListener("click", function() {
            login = true; //Braucht man?
            adminPlan = false;
            studentPlan = true;
            commentPlan = false;
            clearOverviewTable();
            /*Updaten?
            startDate = setupStartDate();
            endDate = setupEndDate();*/
            showTable("", "");
            setButtonActive(planStudentButton, planAdminButton, planCommentButton);
        });
    }
    
    function setupButtonsViews() {
        planStudentButton = document.querySelector("#plan-student-button");
        planAdminButton = document.querySelector("#plan-admin-button");
        planAdminButton.classList.add("view-button-active");
        planCommentButton = document.querySelector("#comment-admin-button");
        
        planStudentButtonAddEventListener();
        planAdminButtonAddEventListener();
        planCommentButtonAddEventListener();
    }
    
    function setupEndDate() {
        var endDateString, endDay, endMonth, endYear, endDate;
        if (login) {
            endDateString = datepickerEndDate.value;
        } else {
            if (currentWeek) {
                endDateString = endCurrentWeek;
            } else {
                endDateString = end;
            }
        }
        endDay = endDateString.split(".")[0];
        endMonth = endDateString.split(".")[1];
        endYear = endDateString.split(".")[2];
        endDate = new Date(endYear, endMonth - 1, endDay); //Jahr, Monat, Tag
        endDateMilliseconds = endDate.getTime();
    }
    
    function setupStartDate() {
        var startDateString, startDay, startMonth, startYear, startDate;
        if (login) {
            startDateString = datepickerStartDate.value;
        } else {
            if (nextWeek) {
                startDateString = startNextWeek;
            } else {
                startDateString = start;
            }
        }
        startDay = startDateString.split(".")[0];
        startMonth = startDateString.split(".")[1];
        startYear = startDateString.split(".")[2];
        startDate = new Date(startYear, startMonth - 1, startDay); //Jahr, Monat, Tag
        startDateMilliseconds = startDate.getTime();
    }
    
    function setupButtonTimerange() {
        var refreshButton = document.querySelector("#refresh-icon");
        refreshButton.addEventListener("click", function() {
            login = true; //Braucht man?
            clearOverviewTable();
            clearCommentTable();
            setupStartDate();
            setupEndDate();
            showTable("", "");
        });
    }
    
    /*Extern*/
    function setupTableButtons() {
        setupButtonTimerange();
        setupButtonsViews();
        setupButtonPDF();
    }
    
    /*-*/
    function setupModalDelete() {
        var deleteButton, notDeleteButton, row, key;
        deleteModal = document.getElementById("modal-delete-person");
        deleteButton = document.getElementById("delete-button-modal-person");
        notDeleteButton = document.getElementById("delete-button-no-modal-person");
        
        deleteButton.addEventListener("click", function() {
            row = currentColumn.parentNode;
            key = row.getAttribute("row-key"); /*Key --> Entsprechenden Termin aus der Datenbank löschen*/
            row.parentNode.removeChild(row); /*Tabelle --> Reihe entfernen*/
            Scheduler.DatabaseAppointments.deleteButtonClicked(key); /*Entsprechenden Termin aus der Datenbank löschen*/
        });
    }
    
    //Klick auf das Löschen-Symbol
    function iconDeleteAddEventListener(iconDelete) {
        iconDelete.addEventListener("click", function(event) {
            currentColumn = event.target.parentNode;
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
    
    //Es ist noch kein Kommentar vorhanden
    function setupComment(commentColumn, comment) {
        commentColumn.innerHTML = comment;
        commentColumn.classList.add("comment-text");
        commentColumn.addEventListener("click", commentColumnAddEventListener, false); /*Verfasster Kommentar soll klickbar sein*/
    }
    
    //Klick auf den verfassten Kommentar
    function commentColumnAddEventListener(event) {
        var id, icon, commentField;
        commentField = setupTextarea();
        commentField.value = event.target.textContent;
        icon = setupIcon(commentField);

        event.target.innerHTML = "";
        event.target.classList.remove("comment-text");
        event.target.appendChild(commentField);
        event.target.appendChild(icon);
        event.target.removeEventListener("click", commentColumnAddEventListener);
    }
    
    //Klick auf das Häkchen-Symbol
    function iconAddEventListener(icon, commentField) {
        var commentColumn;
        icon.addEventListener("click", function(event) {
            commentColumn = event.target.parentNode; /*Aktuelle Spalte über Parent holen*/
            commentColumn.innerHTML = commentField.value;
            commentColumn.addEventListener("click", commentColumnAddEventListener, false);
            commentField.style.display = "none";
            icon.style.display = "none";
            
            Scheduler.DatabaseAppointments.updateDatabase(commentColumn.parentNode.getAttribute("row-key"), commentField.value, commentColumn.getAttribute("id")); 
        });
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
        commentField.placeholder = "Kommentar...";
        commentField.classList.add("comment-textarea"); /*Notwendig für's Styling*/
        return commentField;
    }
    
    //Es ist noch kein Kommentar vorhanden: Textarea und Häkchen anzeigen
    function setupAddComment(commentColumn) {
        var commentField, icon;
        commentField = setupTextarea();
        icon = setupIcon(commentField);
        commentColumn.appendChild(commentField);
        commentColumn.appendChild(icon);
    }
    
    //Sprechstundengrund
    function setupTopicColumn(appointment) {
        var topicColumn = document.createElement("td");
        topicColumn.classList.add("appointment-table-body");
        topicColumn.classList.add("render");
        //Bei Studenten-Plan nicht
        topicColumn.innerHTML = appointment.topic;
        return topicColumn;
    }
    
    //E-Mail
    function setupEmailColumn(appointment) {
        var emailColumn = document.createElement("td");
        emailColumn.classList.add("appointment-table-body");
        emailColumn.classList.add("render");
        //Bei Studenten-Plan nicht
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
        var dateColumn, date;
        dateColumn = document.createElement("td");
        dateColumn.classList.add("appointment-table-body");
        dateColumn.classList.add("render");
        dateColumn.classList.add("render-student");
        dateColumn.id = "appointment-date"; /*Notwendig für's Styling*/
        date = appointment.date;
        dateColumn.innerHTML = date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0];
        return dateColumn;
    }
    
    function setupColumnsOverviewTable(tableRow, appointment) { //Spalten
        var dateColumn, timerangeColumn, lastnameColumn, firstnameColumn, emailColumn, topicColumn, deleteColumn;
        
        dateColumn = setupDateColumn(appointment);
        timerangeColumn = setupTimerangeColumn(appointment);
        lastnameColumn = setupLastnameColumn(appointment);
        firstnameColumn = setupFirstnameColumn(appointment);
        tableRow.appendChild(dateColumn);
        tableRow.appendChild(timerangeColumn);
        tableRow.appendChild(lastnameColumn);
        tableRow.appendChild(firstnameColumn);
        
        if (login && adminPlan) {
            emailColumn = setupEmailColumn(appointment);
            topicColumn = setupTopicColumn(appointment);
            deleteColumn = setupDeleteColumn();
            
            tableRow.appendChild(emailColumn);
            tableRow.appendChild(topicColumn);
            tableRow.appendChild(deleteColumn);
        }
    }
    
    function setupTableRow(childSnapshot) {
        var key, appointment, tableRow;
        key = childSnapshot.key();
        appointment = childSnapshot.val();
        
        /*Eine Reihe*/
        tableRow = document.createElement("tr");
        tableRow.setAttribute("row-id", idCounter); //0, 1, 2, 3, 4, ...
        tableRow.setAttribute("row-key", key); //Schlüssel aus der Firebase-Datenbank
        setupColumnsOverviewTable(tableRow, appointment);
        idCounter++;
        return tableRow;       
    }
    
    function setupHeaderStudentTable(item) {
        if (item.getAttribute("key") === "admin-only") {
            item.classList.add("hidden");
        }
    }
    
    function setupTableHeader() { //Header unterscheidet sich: Ist man eingelogged oder nicht? Admin-Plan oder Studenten-Plan?
        var columns = document.querySelectorAll(".table-header");
        columns.forEach(function(item) {
            if (!login) { //Nicht eingelogged:
                setupHeaderStudentTable(item);
            } else { //Eingelogged
                if (studentPlan) {
                    setupHeaderStudentTable(item);
                } else {
                    item.classList.remove("hidden");
                }
            }
        });
    }
    
    function setupOverviewTable() {
        var ref, tableRow, date;
        setupTableHeader(); //hier?
        ref = new Firebase("https://terminplaner-ur.firebaseio.com/" + APPOINTMENTS);
        ref.once("value", function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                date = getAppointmentDate(childSnapshot);
                if(date >= startDateMilliseconds && date <= endDateMilliseconds) {
                    tableRow = setupTableRow(childSnapshot); //Jeden Eintrag nacheinander holen
                    tableBody.appendChild(tableRow);
                    counter++;
                }
            });
            checkCounter();
            /*-*/
            if (!login) {
                sortTableDoorPlanDateAndTime("door-plan");
            } else {
                sortTableDoorPlanDateAndTime("overview-table");
            }
        });
    }
    
    function tablesAdmin() { //Eingelogged: Unterscheiden Admin-Plan bzw. Studenten-Plan oder Kommentar-Plan?
        if (adminPlan || studentPlan) { //Admin-Plan bzw. Studenten-Plan
            commentTable.style.display = "none";
            setupOverviewTable(); //Admin
            //Für Styling:
            if (adminPlan) {
                overviewTable.classList.add("table-admin");
                overviewTable.classList.remove("table-student");
            } else {
                overviewTable.classList.add("table-student");
                overviewTable.classList.remove("table-admin");
            }
        } else { //Kommentar-Plan
            overviewTable.style.display = "none";
            setupCommentTable();
        }
    }
    
    /**/
    function setupHeaderTimerange(start, end) {
        var headerTimerange, headerTimerangeSubtitle;
        headerTimerange = document.querySelector(".appointment-overview-timerange");
        headerTimerangeSubtitle = document.querySelector(".appointment-overview-timerange-subtitle");
        headerTimerange.innerHTML = "Zeitraum: " + start + " - " + end;
        if (currentWeek) {
            headerTimerangeSubtitle.innerHTML = "(Aktuelle Woche)";
        } else if (nextWeek) {
            headerTimerangeSubtitle.innerHTML = "(Kommende Woche)";
        } else {
            headerTimerangeSubtitle.innerHTML = "(Aktuelle & kommende Woche)";
        }
    }
    
    function tableStudent(start, end) { //Nicht eingelogged
        setupHeaderTimerange(start, end);
        setupOverviewTable(); //Student
        //Für Styling:
        overviewTable.classList.add("table-student");
        overviewTable.classList.remove("table-admin");
    }
    
    //Welche Tabelle soll angezeigt werden?
    function showTable(start, end) {
        if (!login) { //Nicht eingelogged
            tableStudent(start, end);
        } else { //Eingelogged
            tablesAdmin();
        }
    }
    
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    
    function setupStartDateNextWeek(startDate) {
        var studentDay, studentMonth, studentYear;
        startDate = startDate.addDays(7);
        studentDay = (startDate.getDate() < 10) ? ("0" + startDate.getDate()) : startDate.getDate();
        studentMonth = (startDate.getMonth() < 9) ? ("0" + (startDate.getMonth() + 1)) : (startDate.getMonth() + 1);
        studentYear = startDate.getFullYear();
        startNextWeek = studentDay + "." + studentMonth + "." + studentYear;
    }
    
    //Notwendig für: Übersicht Student, Zeitraum anzeigen
    //Der Student sieht immer die aktuelle Woche und die kommende Woche!!!
    function setupEndDateForStudentOverview(endDate) {
        var studentDay, studentMonth, studentYear;
        endDate = endDate.addDays(7);
        studentDay = (endDate.getDate() < 10) ? ("0" + endDate.getDate()) : endDate.getDate();
        studentMonth = (endDate.getMonth() < 9) ? ("0" + (endDate.getMonth() + 1)) : (endDate.getMonth() + 1);
        studentYear = endDate.getFullYear();
        end = studentDay + "." + studentMonth + "." + studentYear;
        return endDate;
    }
    
    function setupInputFieldEnd(day, month, year) {
        datepickerEndDate = document.querySelector("#datepicker-to");
        datepickerEndDate.value = day + "." + month + "." + year;
    }
    
    function setupInputFieldStart(day, month, year) {
        start = day + "." + month + "." + year; //Notwendig für: Übersicht Student, Zeitraum anzeigen
        if (login) {
            datepickerStartDate = document.querySelector("#datepicker-from");
            datepickerStartDate.value = start;
        }
    }
    
    function setEndDate() {
        var end, day, month, year, endDate;
        end = moment().day(7); //Sonntag
        day = (end._d.getDate() < 10) ? ("0" + end._d.getDate()) : end._d.getDate();
        month = (end._d.getMonth() < 9) ? ("0" + (end._d.getMonth() + 1)) : (end._d.getMonth() + 1);
        year = end._d.getFullYear();
        endCurrentWeek = day + "." + month + "." + year;
        endDate = new Date(year, month - 1, day); //Jahr, Monat, Tag
        
        if (!login) {
            endDate = setupEndDateForStudentOverview(endDate);
        } else {
            setupInputFieldEnd(day, month, year);
        }
        
        endDateMilliseconds = endDate.getTime();
    }
    
    //Es wird immer die aktuelle Woche angezeigt: Von Montag bis Sonntag
    function setStartDate() {
        var start, day, month, year, startDate;
        start = moment().day(1); //Montag
        day = (start._d.getDate() < 10) ? ("0" + start._d.getDate()) : start._d.getDate();
        month = (start._d.getMonth() < 9) ? ("0" + (start._d.getMonth() + 1)) : (start._d.getMonth() + 1);
        year = start._d.getFullYear();
        startDate = new Date(year, month - 1, day); //Jahr, Monat, Tag
        
        if (!login) {
            setupStartDateNextWeek(startDate);
        }
        
        setupInputFieldStart(day, month, year);
        startDateMilliseconds = startDate.getTime();
    }
    
    function clearOverviewTable() {
        while(tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        idCounter = 0;
    }
    
    function initTables() {
        overviewTable = document.querySelector(".appointment-overview-table"); //Sprechstunden-Übersichts-Tabelle für Student oder Admin
        commentTable = document.querySelector(".appointment-comment-table"); //Tabelle für Kommentare zu den Sprechstunden
        noAppointment = document.querySelector(".no-appointment-box"); //Keine Sprechstunden -> Meldung (Keine Tabelle)
        overviewTable.style.display = "none";
        tableBody = document.querySelector("#table-body");
        commentTableBody = document.querySelector("#comment-table-body");
    }
    
    function checkLogin() {
        login = Scheduler.Start.getLogin();
    }
    
    function init() {
        adminPlan = true;
        studentPlan = false;
        commentPlan = false;
        checkLogin();
        initTables();
        clearOverviewTable();
        setStartDate();
        setEndDate();
        showTable(start, end);
    }
    
    that.init = init;
    that.setupTableButtons = setupTableButtons;
    that.setupTableButtonsStudent = setupTableButtonsStudent;
    that.setupModalDelete = setupModalDelete;
    return that;
}());


/* Zeitspanne: 2 Varianten */
        
        /* 1. Variante:
         * Zeitraum beginnt immer am aktuellen Tag
         * und geht 7 Tage lang 
        */
        
        /* setStartDate():
        var today, day, month, year, startDateString, startDateMilliseconds;
        today = new Date(); //HEUTE
        day = (today.getDate() < 10) ? ("0" + today.getDate()) : today.getDate();
        month = (today.getMonth() < 9) ? ("0" + (today.getMonth() + 1)) : (today.getMonth() + 1);
        year = today.getFullYear();
        
        datepickerStartDate = document.querySelector("#datepicker-from");
        startDateString = day + "." + month + "." + year;
        datepickerStartDate.value = startDateString;
        
        startDate = new Date(year, month - 1, day); //Jahr, Monat, Tag
        startDateMilliseconds = startDate.getTime();
        return startDateMilliseconds;
        
        ---
        
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
    
        setEndDate():
        var dat, date, day, month, year, startDateString, startDateMilliseconds;
        dat = new Date();
        date = dat.addDays(6); //Datum in 6 Tagen
        day = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();
        month = (date.getMonth() < 9) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
        year = date.getFullYear();
        
        datepickerEndDate = document.querySelector("#datepicker-to");
        endDateString = day + "." + month + "." + year;
        datepickerEndDate.value = endDateString;
        
        endDate = new Date(year, month - 1, day); //Jahr, Monat, Tag
        endDateMilliseconds = endDate.getTime();
        return endDateMilliseconds;
        */