// Make all table inputs number-only
document.querySelectorAll("table input").forEach(input => {
  input.type = "number";
  input.min = 0;
  input.addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
});

const inputs = document.querySelectorAll("#eggTable input");
const sumCells = document.querySelectorAll("#sumRow .sumCell");
const simpCells = document.querySelectorAll("#simplifiedRow .simpCell");

// ---------------------------
// Save table data to localStorage
// ---------------------------
function saveData() {
  const data = Array.from(inputs).map(input => input.value);

  // Store IDs of hidden rows
  const hiddenRows = Array.from(document.querySelectorAll("[id^='row-']"))
    .filter(row => row.style.display === "none")
    .map(row => row.id);

  localStorage.setItem("eggTableData", JSON.stringify({ data, hiddenRows }));
}

// ---------------------------
// Load table data from localStorage
// ---------------------------
function loadData() {
  const saved = localStorage.getItem("eggTableData");
  if (!saved) return;

  const { data, hiddenRows } = JSON.parse(saved);

  // Restore input values
  inputs.forEach((input, i) => input.value = data[i] || "");

  // Restore hidden rows
  document.querySelectorAll("[id^='row-']").forEach(row => {
    const btn = row.querySelector(".hide-btn");
    if (hiddenRows.includes(row.id)) {
      row.style.display = "none";
      if(btn) btn.textContent = "Show";
    } else {
      row.style.display = "";
      if(btn) btn.textContent = "Hide";
    }
  });

  updateSums();
}

// ---------------------------
// Reset table data
// ---------------------------
function resetData() {
  if (confirm("⚠ Are you sure you want to reset all data? This will clear all entered numbers.")) {
    inputs.forEach(input => input.value = "");
    localStorage.removeItem("eggTableData");
    updateSums();
  }
}

// ---------------------------
// Update SUM TOTAL and SIMPLIFIED TOTAL
// ---------------------------
function updateSums(){
  const sums = Array(sumCells.length).fill(0);

  inputs.forEach((input, idx) => {
    const val = parseFloat(input.value) || 0;
    sums[idx % sums.length] += val;
  });

  sums.forEach((sum, i) => sumCells[i].textContent = sum);

  // Calculate SIMPLIFIED TOTAL
  for(let i = 0; i < sums.length; i += 3) {
    let cs = sums[i], tr = sums[i+1], pcs = sums[i+2];
    if(pcs >= 30){
      let addTr = Math.floor(pcs / 30);
      tr += addTr;
      pcs = pcs % 30;
    }
    if(tr >= 12){
      let addCs = Math.floor(tr / 12);
      cs += addCs;
      tr = tr % 12;
    }
    simpCells[i].textContent = cs;
    simpCells[i+1].textContent = tr;
    simpCells[i+2].textContent = pcs;
  }

  saveData();
}

// ---------------------------
// Input validation for Tr and Pcs columns
// ---------------------------
inputs.forEach((input, idx) => {
  input.addEventListener("input", function() {
    const colPosition = (idx % (13 * 3)) % 3; // 0=Cs, 1=Tr, 2=Pcs
    let val = parseInt(this.value) || 0;

    if (colPosition === 1 && val > 11) {
      alert("Mali ang input: Hindi puwedeng lumampas sa 11 trays");
      this.value = "";
    }
    if (colPosition === 2 && val > 29) {
      alert("Mali ang input: Hindi puwedeng lumampas sa 29 Pcs");
      this.value = "";
    }

    updateSums();
  });
});

// ---------------------------
// Toggle row visibility
// ---------------------------
function toggleRow(b) {
  const row = document.getElementById(`row-${b}`);
  const btn = row.querySelector(".hide-btn");
  if(row.style.display === "none"){
    row.style.display = "";
    btn.textContent = "Hide";
  } else {
    row.style.display = "none";
    btn.textContent = "Show";
  }
  saveData();
}

// Show all rows
function showAllRows(){
  const rows = document.querySelectorAll("[id^='row-']");
  rows.forEach(row => {
    row.style.display = "";
    const btn = row.querySelector(".hide-btn");
    if(btn) btn.textContent = "Hide";
  });
  saveData();
}

// ---------------------------
// Orientation check
// ---------------------------
function checkOrientation(){
  const notice = document.getElementById("rotateNotice");
  if(notice){
    notice.style.display = (window.innerHeight > window.innerWidth) ? "block" : "none";
  }
}

// ---------------------------
// Event listeners
// ---------------------------
window.addEventListener("resize", checkOrientation);
window.addEventListener("load", () => {
  checkOrientation();
  loadData();
});

document.addEventListener("input", e => {
  if (e.target.tagName === "INPUT") saveData();
});
