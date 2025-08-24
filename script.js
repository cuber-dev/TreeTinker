// === Elements ===
const jsonInput = document.getElementById("jsonInput");
const treeView = document.getElementById("treeView");

const loadFileBtn = document.getElementById("loadFileBtn");
const downloadBtn = document.getElementById("downloadBtn");
const formatBtn = document.getElementById("formatBtn");
const minifyBtn = document.getElementById("minifyBtn");
const validateBtn = document.getElementById("validateBtn");

// Hidden file input for load
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".json,application/json";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

// === Functions ===
function updateTreeView(jsonText) {
  const treeCode = document.getElementById("treeCode");
  try {
    const parsed = JSON.parse(jsonText);
    const pretty = JSON.stringify(parsed, null, 2);
    
    // Assign hljs class for JSON
    treeCode.className = "language-json";
    treeCode.textContent = pretty;
    
    // Highlight.js magic ✨
    treeCode.textContent = pretty;
    Prism.highlightElement(treeCode);
  } catch {
    treeCode.className = "";
    treeCode.textContent = "❌ Invalid JSON";
  }
}
function loadJSONFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    jsonInput.value = e.target.result;
    updateTreeView(jsonInput.value);
  };
  reader.readAsText(file);
}

function downloadJSON() {
  const blob = new Blob([jsonInput.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function formatJSON() {
  try {
    const obj = JSON.parse(jsonInput.value);
    jsonInput.value = JSON.stringify(obj, null, 2);
    updateTreeView(jsonInput.value);
  } catch {
    alert("Invalid JSON: Cannot format");
  }
}

function minifyJSON() {
  try {
    const obj = JSON.parse(jsonInput.value);
    jsonInput.value = JSON.stringify(obj);
    updateTreeView(jsonInput.value);
  } catch {
    alert("Invalid JSON: Cannot minify");
  }
}

function validateJSON() {
  try {
    JSON.parse(jsonInput.value);
    alert("✅ Valid JSON");
  } catch {
    alert("❌ Invalid JSON");
  }
}

// === Event Listeners ===
fileInput.addEventListener("change", loadJSONFile);

loadFileBtn.addEventListener("click", () => fileInput.click());
downloadBtn.addEventListener("click", downloadJSON);
formatBtn.addEventListener("click", formatJSON);
minifyBtn.addEventListener("click", minifyJSON);
validateBtn.addEventListener("click", validateJSON);

// Live update tree as user types
jsonInput.addEventListener("input", () => {
  updateTreeView(jsonInput.value);
});


// Copy JSON from pretty view
function copyJSON() {
  const treeCode = document.getElementById("treeCode");
  const text = treeCode.textContent;
  
  if (!text.trim()) return;
  
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log("✅ JSON copied to clipboard");
      showCopyStatus("Copied!");
    })
    .catch(err => {
      console.error("❌ Failed to copy JSON:", err);
      showCopyStatus("Copy failed");
    });
}

// Optional: temporary status message beside the button
function showCopyStatus(message) {
  let status = document.getElementById("copyStatus");
  
  if (!status) {
    status = document.createElement("span");
    status.id = "copyStatus";
    status.style.marginLeft = "8px";
    status.style.fontSize = "0.9em";
    status.style.color = "var(--accent-color, green)";
    document.getElementById("copyBtn").after(status);
  }
  
  status.textContent = message;
  
  setTimeout(() => {
    status.textContent = "";
  }, 1500);
}

// Attach event listener
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("copyBtn").addEventListener("click", copyJSON);
});