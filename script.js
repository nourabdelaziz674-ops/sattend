let students = 0;
let presentStudents = [];
let allAttendance =
    JSON.parse(localStorage.getItem("allAttendance")) || [];
let scanner = null;

function startScanner() {

    scanner = new Html5Qrcode("reader");
    scanner.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        function(decodedText) {

            let studentData =
                decodedText.split("|");


            let studentId =
                studentData[0];

            let studentName =
                studentData[1];

            let studentGroup =
                studentData[2];


            // Check QR data

            if (
                !studentId ||
                !studentName ||
                !studentGroup
            ) {

                alert("Invalid student QR code");

                return;

            }


            // Check duplicate

            if (presentStudents.includes(studentId)) {

                alert("This student is already present!");

                scanner.stop();

                return;

            }


            // Save student

            presentStudents.push(studentId);

            students++;


            // Get attendance list
let table =
    document.getElementById("attendanceTableBody");

let time =
    new Date().toLocaleTimeString();

let section =
    document.getElementById("sectionSelect").value;
 allAttendance.push({
    id: studentId,
    name: studentName,
    group: studentGroup,
    section: section,
    time: time
});
localStorage.setItem(
    "allAttendance",
    JSON.stringify(allAttendance)
);
let row =
    document.createElement("tr");

row.innerHTML = `
    <td>${studentId}</td>
    <td>${studentName}</td>
    <td>${studentGroup}</td>
    <td>${section}</td>
    <td>${time}</td>
`;

table.appendChild(row);
            
            // Update student count

            document.getElementById("studentCount").textContent =
                students + " Students";


            // Update student card

            document.getElementById("studentName").textContent =
                studentName;


            document.getElementById("attendanceTime").textContent =
                "Attendance recorded successfully!";


            // Stop scanner

            scanner.stop();

        }

    )

    .catch(function(error) {

        console.log("Camera error:", error);

    });

}

function endAttendance() {

    if (scanner) {

        scanner.stop();

    }

    alert("Attendance has ended!");

}

function searchStudents() {

    let search =
        document.getElementById("searchInput").value.toLowerCase();

    let table =
        document.getElementById("attendanceTableBody");

    let rows =
        table.getElementsByTagName("tr");


    for (let i = 0; i < rows.length; i++) {

        let id =
            rows[i].cells[0].textContent.toLowerCase();

        let name =
            rows[i].cells[1].textContent.toLowerCase();


        if (
            id.includes(search) ||
            name.includes(search)
        ) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }

    }

}
function toggleAttendance() {

    let table =
        document.getElementById("attendanceTable");

    if (table.style.display === "none") {

        table.style.display = "table";

    } else {

        table.style.display = "none";

    }

}
function exportAttendance() {

    let table =
        document.getElementById("attendanceTable");

    let rows =
        table.querySelectorAll("tr");

    let csv = [];

    rows.forEach(function(row) {

        let cells =
            row.querySelectorAll("th, td");

        let rowData = [];

        cells.forEach(function(cell) {

            rowData.push('"' + cell.textContent + '"');

        });

        csv.push(rowData.join(","));

    });


    let csvFile =
        csv.join("\n");


    let blob =
        new Blob([csvFile], {
            type: "text/csv"
        });


    let url =
        URL.createObjectURL(blob);


    let link =
        document.createElement("a");

    link.href = url;

    link.download =
        "attendance.csv";

    link.click();


    URL.revokeObjectURL(url);

}
let sessionStart =
    new Date();

document.getElementById("sessionInfo").textContent =
    "Attendance Session: " +
    sessionStart.toLocaleDateString() +
    " | Started at " +
    sessionStart.toLocaleTimeString();
    function resetSection() {

    if (scanner) {
        scanner.stop();
    }

    presentStudents = [];
    students = 0;


    document.getElementById("studentCount").textContent =
        "0 Students";


    document.getElementById("studentName").textContent =
        "No student scanned yet";


    document.getElementById("attendanceTime").textContent =
        "";


    document.getElementById("attendanceTableBody").innerHTML =
        "";


    document.getElementById("searchInput").value =
        "";


    alert("Section has been reset!");

}