function clearColumnValues(columnClass) {
    document.querySelectorAll(`.${columnClass}`).forEach(input => {
        input.value = "";
    });
    calculateTotals(); // Recalculate totals after clearing values
}
                   
// Debounce function to reduce input lag
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Function to calculate totals efficiently
function calculateTotals() {
   let caseTotal = 0, trayTotal = 0, pieceTotal = 0, grandTotalPieces = 0;

document.querySelectorAll("#tableBody tr").forEach(row => {
    let sizeName = row.cells[0].textContent.trim().toUpperCase();

    let caseInput = row.querySelector(".cases");
    let trayInput = row.querySelector(".trays");
    let pieceInput = row.querySelector(".pieces");

    let caseVal = Number(caseInput?.value) || 0;
    let trayVal = Number(trayInput?.value) || 0;
    let pieceVal = Number(pieceInput?.value) || 0;

    // ✅ Include all values (including LOSS) in total pieces
    grandTotalPieces += (caseVal * 360) + (trayVal * 30) + pieceVal;

    // ❌ Exclude LOSS row from PIECES column total
    if (sizeName !== "LOSS") {
        caseTotal += caseVal;
        trayTotal += trayVal;
        pieceTotal += pieceVal;
    }
});

document.getElementById("totalCases").value = caseTotal;
document.getElementById("totalTrays").value = trayTotal;
document.getElementById("totalPieces").value = pieceTotal;
document.getElementById("grandTotalPieces").value = grandTotalPieces;


    // Compute total production
    let caseInput = Number(document.getElementById("caseInput").value) || 0;
    let trayInput = Number(document.getElementById("trayInput").value) || 0;
    let totalProduction = (caseInput * 360) + (trayInput * 30);
    document.getElementById("totalOutput").value = totalProduction;

    // Compute broken eggs (Good Cracks)
    let bcaseInput = Number(document.getElementById("bcaseInput").value) || 0;
    let btrayInput = Number(document.getElementById("btrayInput").value) || 0;
    let bpiecesInput = Number(document.getElementById("bpiecesInput").value) || 0;
    let btotalBroken = (bcaseInput * 360) + (btrayInput * 30) + bpiecesInput;
    document.getElementById("btotalPieces").value = btotalBroken;

    // Compute broken eggs (Bad Cracks)
    let bbcaseInput = Number(document.getElementById("bbcaseInput").value) || 0;
    let bbtrayInput = Number(document.getElementById("bbtrayInput").value) || 0;
    let bbpiecesInput = Number(document.getElementById("bbpiecesInput").value) || 0;
    let bbtotalBroken = (bbcaseInput * 360) + (bbtrayInput * 30) + bbpiecesInput;
    document.getElementById("bbtotalPieces").value = bbtotalBroken;

    // Compute total broken eggs
    let totalBrokenPieces = btotalBroken + bbtotalBroken;
    let totalBrokenCase = Math.floor(totalBrokenPieces / 360);
    let remainingAfterCases = totalBrokenPieces % 360;
    let totalBrokenTray = Math.floor(remainingAfterCases / 30);
    let totalBrokenFinalPieces = remainingAfterCases % 30;

    // Update total broken eggs
    document.getElementById("totalBrokenCase").value = totalBrokenCase;
    document.getElementById("totalBrokenTray").value = totalBrokenTray;
    document.getElementById("totalBrokenEggs").value = totalBrokenPieces;
    document.getElementById("totalBrokenPieces").value = totalBrokenFinalPieces;

    // Update "Broken" row in table dynamically
    document.querySelectorAll("#tableBody tr").forEach(row => {
        let firstCellText = row.cells[0]?.textContent.trim().toLowerCase();
        if (firstCellText === "broken") {
            row.cells[3].querySelector("input").value = totalBrokenCase;
            row.cells[4].querySelector("input").value = totalBrokenTray;
            row.cells[5].querySelector("input").value = totalBrokenFinalPieces;
        }
    });

    // Compute percentage per row
    let totalPercentage = 0;
    let boldLossTotal = 0;

    document.querySelectorAll("tbody tr").forEach(row => {
        let sizeName = row.cells[0].textContent.trim();
		    // Change font color of LOSS pieces input
    if (sizeName === "LOSS") {
        let lossPiecesInput = row.querySelector(".pieces");
        if (lossPiecesInput) {
            lossPiecesInput.style.color = "red";
        }
    }

        let caseVal = Number(row.querySelector(".cases")?.value) || 0;
        let trayVal = Number(row.querySelector(".trays")?.value) || 0;
        let pieceVal = Number(row.querySelector(".pieces")?.value) || 0;
        let totalPieceVal = (caseVal * 360) + (trayVal * 30) + pieceVal;

        let totalPiecesField = row.querySelector(".totalPiecesRow");
        let percentageField = row.querySelector(".percentageRow");

        if (totalPiecesField) {
            totalPiecesField.value = totalPieceVal;
        }

        if (sizeName === "BOLD" || sizeName === "LOSS") {
            boldLossTotal += totalPieceVal;
        } else if (percentageField) {
            let percentage = totalProduction > 0 ? (totalPieceVal / totalProduction) * 100 : 0;
            percentageField.value = percentage.toFixed(2);
            totalPercentage += percentage;
        }
    });

    // Compute BOLD and LOSS percentage
    let boldLossPercentage = totalProduction > 0 ? (boldLossTotal / totalProduction) * 100 : 0;
    document.getElementById("boldLossPercentage").value = boldLossPercentage.toFixed(2);
    totalPercentage += boldLossPercentage;

    // Update total percentage
    document.getElementById("totalPercentage").value = totalPercentage.toFixed(2);

    // Compute difference
    let difference = grandTotalPieces - totalProduction;
    let sign = difference > 0 ? "+" : "";
    document.getElementById("differenceDisplay").innerText = `DIFFERENCE: ${sign}${difference} pieces`;

    // Display error message if total doesn't match
    let messageDisplay = document.getElementById("messageDisplay");
    if (totalProduction !== grandTotalPieces) {
        messageDisplay.innerText = "ERROR: Hindi tugma ang total production sa nalistang egg sizes. Pakisuri at bilangin muli ang mga itlog.";
        messageDisplay.style.color = "red";
    } else {
        messageDisplay.innerText = "Ang paglista ay tama.";
        messageDisplay.style.color = "green";
    }
}

// Attach debounced input event listeners
const debouncedCalculateTotals = debounce(calculateTotals, 300);

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".cases, .trays, .pieces").forEach(input => {
        input.addEventListener("input", debouncedCalculateTotals);
    });

    document.querySelectorAll("#bcaseInput, #btrayInput, #bpiecesInput, #bbcaseInput, #bbtrayInput, #bbpiecesInput")
        .forEach(input => input.addEventListener("input", debouncedCalculateTotals));

    // Remove non-numeric characters from number fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });
});
function exportTableToCSV() {
    let table = document.getElementById("tableBody");
    let csvContent = [];

    // Get headers
    let headers = ["SIZE", "TOTAL PIECES", "PERCENTAGE (%)", "CASES", "TRAYS", "PIECES"];
    csvContent.push(headers.join(",")); 

    // Loop through each row in the table
    table.querySelectorAll("tr").forEach(row => {
        let rowData = [];
        row.querySelectorAll("td").forEach((cell, index) => {
            let input = cell.querySelector("input");
            let cellText = input ? input.value : cell.textContent.trim();
            rowData.push(cellText);
        });
        csvContent.push(rowData.join(","));
    });

    // Convert to CSV format
    let csvData = csvContent.join("\n");
    let blob = new Blob([csvData], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "Egg_Size_Summary.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
