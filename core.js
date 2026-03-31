// ==========================================
// OneCore Offset Pro - Main Engine (v1.0)
// ==========================================

// UI Elements ko pakadna
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const dashboard = document.getElementById('dashboard');
const infoName = document.getElementById('infoName');
const infoSize = document.getElementById('infoSize');
const infoArch = document.getElementById('infoArch');

// File Upload Event
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // UI Update karna (Naam aur Size)
    fileNameDisplay.innerText = "Selected: " + file.name;
    infoName.innerText = file.name;
    infoSize.innerText = formatBytes(file.size);

    // Dashboard ko visible (ON) karna
    dashboard.style.display = 'block';
    infoArch.innerHTML = "<span style='color: yellow;'>Analyzing Header...</span>";

    // ELF Header check karna (32-bit vs 64-bit detect karne ke liye)
    analyzeELFHeader(file);
});

// Size ko MB/KB mein badalne ka function
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ELF Magic Bytes aur Architecture Check function
function analyzeELFHeader(file) {
    const reader = new FileReader();
    // Hum puri 400MB file nahi padh rahe, sirf shuru ke 64 bytes padh rahe hain (Super fast)
    const blob = file.slice(0, 64); 

    reader.onload = function(e) {
        const buffer = new Uint8Array(e.target.result);

        // Check Magic Bytes: 7F 45 4C 46 (ELF)
        if (buffer[0] !== 0x7F || buffer[1] !== 0x45 || buffer[2] !== 0x4C || buffer[3] !== 0x46) {
            infoArch.innerHTML = "<span style='color: red;'>Error: Not a valid .so (ELF) file!</span>";
            return;
        }

        // Byte index 4 batata hai ki file 32-bit hai ya 64-bit
        const archClass = buffer[4]; 
        let archText = "Unknown Architecture";
        
        if (archClass === 1) {
            archText = "ARMv7 (32-bit)";
        } else if (archClass === 2) {
            archText = "ARM64 (64-bit)";
        }

        // Dashboard pe result print karna
        infoArch.innerHTML = `<span style='color: #00ff66;'>${archText}</span>`;
    };

    reader.readAsArrayBuffer(blob);
}
