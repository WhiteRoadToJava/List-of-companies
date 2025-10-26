const inputName = document.getElementById("company-name");
const inputPerson = document.getElementById("contact-person");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone");
const inputWebsite = document.getElementById("website");
const inputDate = document.getElementById("date");
const table = document.getElementById("table-including");

const editBtn = document.getElementById("edit-company");
const deleteBtn = document.getElementById("delete-company");
const submitBtn = document.getElementById("submit");

const form = document.getElementById("form");

let row = table.closest("tr");
let rowToDelete = 0;
let rowToEdit = 0;
let rowIndex = 0;



table.addEventListener("", (e) => {
        console.log("cuechange event triggered");
        console.log(e);

})


let cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener("click", () => {
        form.style.display = "none";
        editBtn.style.display = "flex";
        deleteBtn.style.display = "flex";
});
let fileHandle = null;
async function uploadFile() {
        try {
                // [fileHandle] = ... is correct if you only expect one file (default setting)
                [fileHandle] = await window.showOpenFilePicker();
                // 1. Get the File object from the handle
                let fileData = await fileHandle.getFile();
                // 2. Read the text content
                let data = await fileData.text();
                // 3. Populate the element with the data
                table.innerHTML = data;
                console.log(`File opened successfully: ${fileHandle.name}`);
        } catch (error) {
                // Handle cases where the user cancels the dialog or permission is denied
                if (error.name === 'AbortError') {
                        console.log('File selection cancelled.');
                } else {
                        console.error('Error opening file:', error);
                }
        }
}
async function saveDataInFile() {
        if (!fileHandle) {
                // If there's no handle (no file was opened yet), treat it as 'Save As'
                return saveAs();
        }
        try {
                // 1. Create a writable stream to the file
                let stream = await fileHandle.createWritable();
                // 2. Write the element's current content
                await stream.write(table.innerHTML);
                // 3. Close the stream (flushes data and releases the lock)
                await stream.close();
                console.log(`Changes saved to: ${fileHandle.name}`);
        } catch (error) {
                console.error('Error saving file:', error);
                alert('Could not save file. Permission may have been revoked or stream failed.');
        }
}
async function saveAs() {
        try {
                // Prompt user to select a new file to save to
                fileHandle = await window.showSaveFilePicker({
                        suggestedName: 'untitled_data.txt',
                        types: [{
                                description: 'Text Files',
                                accept: { 'text/plain': ['.txt'] },
                        }],
                });
                // Call the save function now that fileHandle is set to the new location
                await save();
                dataNotSaved = true;
        } catch (error) {
                if (error.name === 'AbortError') {
                        console.log('Save As cancelled by user.');
                } else {
                        console.error('Error during Save As:', error);
                }

        }
}
function loadData() {
        //table.innerHTML = localStorage.getItem("data");
        if (rowIndex === 0) {
                const saveAsBtn = document.getElementById('save-btn')
                const openBtn = document.getElementById('open-btn')
                saveAsBtn.style.display='none'
                openBtn.style.display='none'
        } else {
                saveAsBtn.style.display='block'
                openBtn.style.display='block'
        }
}
loadData();
function saveData() {
        localStorage.setItem("data", table.innerHTML);
}








function addCompany() {
        if (!fileHandle) {
                uploadFile();
        }
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
                saveDataInFile();
                form.style.display = "none";
        }
}

table.addEventListener("click", (e) => {
        if (e.target.closest("tr")) {
                rowToDelete = e.target.closest("tr")
                rowToupdate = e.target.closest("tr")
                rowIndex = e.target.closest("tr")
                showDataRow(rowIndex);
                form.style.display = "flex";
                submitBtn.style.display = "none";
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
        if (confirm("Are you sure you want to delete this company?")) {
                rowToDelete.remove();
                form.style.display = "none";
                saveData();
                loadData();
                if (!fileHandle) {
                        uploadFile();
                }

        } else {
                console.log('deleting is canceled')
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
                alert("Company edited successfully");
                form.style.display = "none";
        }
        else {
                console.log('Edit Row is canceling')
                loadData();
        }
        saveData();
        loadData();
        saveDataInFile();
}





let addCompanyBtn = document.getElementById("add-company");
addCompanyBtn.addEventListener("click", () => {

        submitBtn.style.display = "flex";
        editBtn.style.display = "none";
        deleteBtn.style.display = "none";
        form.style.display = "flex";

        inputName.value = "";
        inputPerson.value = "";
        inputEmail.value = "";
        inputPhone.value = "";
        inputWebsite.value = "";
        inputDate.value = "";
});








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
