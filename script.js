const inputName = document.getElementById("company-name");
const inputPerson = document.getElementById("contact-person");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone");
const inputWebsite = document.getElementById("website");
const inputDate = document.getElementById("date");
const table = document.getElementById("table-including");
let row = table.closest("tr");
let rowToDelete = 0;
let rowToEdit = 0;
let rowIndex = 0;







function addCompany() {
        const conpanies = { inputName, inputPerson, inputEmail, inputPhone, inputWebsite, inputDate };
        if (conpanies.inputName.value === "" || conpanies.inputPerson.value === "" || conpanies.inputEmail.value === "" || conpanies.inputPhone.value === "" || conpanies.inputWebsite.value === "") {
                alert("Please fill in all fields");
                return;
        } else {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                <td>${conpanies.inputName.value}</td>
                <td>${conpanies.inputPerson.value}</td>
                <td>${conpanies.inputEmail.value}</td>
                <td>${conpanies.inputPhone.value}</td>
                <td>${conpanies.inputWebsite.value}</td>
                <td>${conpanies.inputDate.value}</td>
        `;
                table.appendChild(tr);


                saveData();
        }

}

table.addEventListener("click", (e) => {
        if (e.target.closest("tr")) {
                rowToDelete = e.target.closest("tr")
                rowToupdate = e.target.closest("tr")
                rowIndex = e.target.closest("tr")
                showDataRow(rowIndex);
        }
});

table.addEventListener("mouseover", (e) => {
        if (e.target.closest("tr")) {
                e.target.parentElement.style.backgroundColor = "lightgray";
        }
})
table.addEventListener("mouseout", (e) => {
        if (e.target.closest("tr")) {
                e.target.parentElement.style.backgroundColor = "white";
        }
})


function deleteCompany() {
        if (confirm("Are you sure you want to delete this company?")
        ) {
                rowToDelete.remove();
                saveData();
                loadData();
        }
}

function showDataRow(rowIndex) {
        const company = rowIndex.children
        inputName.value = company[0].innerHTML;
        inputPerson.value = company[1].innerHTML;
        inputEmail.value = company[2].innerHTML;
        inputPhone.value = company[3].innerHTML;
        inputWebsite.value = company[4].innerHTML;
        inputDate.value = company[5].innerHTML;
}

function editCompany() {
        if (confirm("Are you sure you want to edit this company?")) {
                rowToupdate.querySelectorAll("td")[0].innerHTML = inputName.value;
                rowToupdate.querySelectorAll("td")[1].innerHTML = inputPerson.value;
                rowToupdate.querySelectorAll("td")[2].innerHTML = inputEmail.value;
                rowToupdate.querySelectorAll("td")[3].innerHTML = inputPhone.value;
                rowToupdate.querySelectorAll("td")[4].innerHTML = inputWebsite.value;
                rowToupdate.querySelectorAll("td")[5].innerHTML = inputDate.value;
                saveData();
                loadData();
                alert("Company edited successfully");
        }
        else {
                loadData();
        }
}


function saveData() {
        localStorage.setItem("data", table.innerHTML)
}

function loadData() {
        table.innerHTML = localStorage.getItem("data")
}
loadData();






/**
 * Extracts data from a table and saves it as a CSV file.
 * @param {string} tableId - The ID of the <table> element to save.
 * @param {string} filename - The desired name for the saved file (e.g., "data.csv").
 */
function saveTableAsCsv(tableId, filename = 'table_export.csv') {
    const tableElement = document.getElementById(tableId);

    if (!tableElement) {
        console.error(`Table with ID "${tableId}" not found.`);
        return;
    }

    let csv = [];
    // Get all rows from the table body and header
    const rows = tableElement.querySelectorAll('tr');

    for (const row of rows) {
        // Get cell data, handling both header (th) and data (td) cells
        const cells = row.querySelectorAll('th, td');
        let rowData = [];

        for (const cell of cells) {
            // Enclose data in quotes and escape internal quotes to handle complex strings in CSV
            let data = cell.innerText.replace(/"/g, '""'); 
            rowData.push('"' + data + '"');
        }

        csv.push(rowData.join(',')); // Join cells with a comma (CSV format)
    }

    const csvString = csv.join('\n'); // Join rows with a newline

    // Trigger the download
    triggerFileDownload(csvString, filename, 'text/csv;charset=utf-8;');
}

// Generic download helper function
function triggerFileDownload(content, filename, mimeType) {
    const blob = new Blob(["\uFEFF" + content], { type: mimeType }); // \uFEFF is the BOM for UTF-8 Excel compatibility
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
