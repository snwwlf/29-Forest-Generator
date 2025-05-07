// One acre equals 43,560 square feet.
const treeSpaceRequirements = {
    // Hardwoods Section
    'Sugar Maple (Acer saccharum)': 3600,
    'Northern Red Oak (Quercus rubra)': 2400,
    'Yellow Birch (Betula alleghaniensis)': 1500,
    'American Beech (Fagus grandifolia)': 4000,
    'Basswood (Tilia americana)': 2500,
    'White Oak (Quercus alba)': 5000,
    'Paper Birch (Betula papyrifera)': 1800,
    'Black Cherry (Prunus serotina)': 1600,
    'Quaking Aspen (Populus tremuloides)': 750,
    'Black Walnut (Juglans nigra)': 4500,

    // Conifers Section
    'Eastern White Pine (Pinus strobus)': 1000,
    'Red Pine (Pinus resinosa)': 500,
    'Northern White Cedar (Thuja occidentalis)': 225,
    'Eastern Hemlock (Tsuga canadensis)': 1000,
    'Tamarack (Larix laricina)': 225,
    'Balsam Fir (Abies balsamea)': 500,
    'Black Spruce (Picea mariana)': 144,
    'Jack Pine (Pinus banksiana)': 750,
    'Eastern Red Cedar (Juniperas virgiana)': 400,
    'White Spruce (Picea glauca)': 400
};

// Update remaining space dynamically based on user input
function updateRemainingSpace() {
    const acres = parseFloat(document.getElementById('number')?.value) || 0;
    let totalSquareFootage = acres * 43560; 
    let usedSpace = 0;

    document.querySelectorAll('.treeNumber').forEach(tree => {
        const treeCount = parseInt(tree.value) || 0;
        const treeLabel = tree.closest('label').textContent.split(" - ")[0].trim();
        const spacePerTree = treeSpaceRequirements[treeLabel] || 0;

        usedSpace += treeCount * spacePerTree;
    });

    const remainingSpace = totalSquareFootage - usedSpace;
    const acreageLeft = document.getElementById('acreageLeft');
    const submitBtn = document.getElementById('submitBtn');

    if (acreageLeft && submitBtn) {
        if (remainingSpace < 0) {
            acreageLeft.textContent = 'Remaining Space Exceeded! Adjust Acreage or Tree Count!';
            acreageLeft.classList.add('exceeded');
            submitBtn.disabled = true; // Disable submit button when space is exceeded
        } else {
            acreageLeft.textContent = `Remaining Space: ${remainingSpace.toLocaleString()} square feet`;
            acreageLeft.classList.remove('exceeded');
            submitBtn.disabled = false; // Enable submit button when space is valid
        }
    }
}

// Ensure validation runs before allowing PDF creation
function validateSpace() {
    updateRemainingSpace(); // Ensure latest space calculation

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn?.disabled) {
        alert("Error: Cannot generate PDF. Too many trees selected for available acreage.");
        return; // Stop execution
    }

    generatePDF(); // If validation passes, proceed to PDF generation
}

// PDF Generation Function
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Center the title
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Your Forest Selection";
    const textWidth = doc.getTextWidth(titleText);
    const centerPosition = (pageWidth - textWidth) / 2 - 10;

    // Set title styling
    doc.setTextColor(0, 0, 255); // Blue
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(titleText, centerPosition, 20);

    // Get acreage input value
    const acres = document.getElementById('number')?.value || "Not Specified";
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Acreage: ${acres} acres`, 20, 30);

    // Retrieve selected trees inside `generatePDF()`
    const selectedTrees = [];
    document.querySelectorAll('.treeNumber').forEach(input => {
        const treeCount = parseInt(input.value) || 0;
        if (treeCount > 0) {
            const treeLabel = input.closest('label').textContent.trim();
            selectedTrees.push(`${treeLabel} - ${treeCount}`);
        }
    });

    // Add Tree Selections to PDF
    doc.setFontSize(16);
    doc.text("Selected Trees:", 20, 40);

    selectedTrees.forEach((tree, index) => {
        doc.setFontSize(12);
        doc.text(`• ${tree}`, 30, 50 + index * 10);
    });

    // Generate and Download PDF
    doc.save("forest_selection.pdf");
}

// Event Listeners for Interactive Features
document.addEventListener("DOMContentLoaded", function() {
    // Validate input changes
    document.querySelectorAll('.treeNumber').forEach(input => {
        input.addEventListener('input', updateRemainingSpace);
    });

    document.getElementById('number')?.addEventListener('input', updateRemainingSpace);

    // Reset button function
    const resetButton = document.getElementById('resetBtn');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            document.getElementById('number').value = '';

            document.querySelectorAll('.treeNumber').forEach(input => {
                input.value = '';
                input.disabled = false; 
            });

            const acreageLeft = document.getElementById('acreageLeft');
            if (acreageLeft) {
                acreageLeft.textContent = 'Remaining Space: 0 Square Feet';
                acreageLeft.classList.remove('exceeded');
            }

            updateRemainingSpace();
        });
    } else {
        console.error("Error: resetBtn button not found!");
    }

    // 🔥 **Page Color Toggle Fix for ALL Pages**
    const colorButton = document.getElementById("pageColorChanger");
    if (colorButton) {
        colorButton.addEventListener("click", function () {
            document.documentElement.classList.toggle("dark-mode");
            document.documentElement.classList.toggle("light-mode");
        });
    } else {
        console.error("Error: pageColorChanger button not found!");
    }

    // Submit button event listener
    const submitButton = document.getElementById('submitBtn');
    if (submitButton) {
        submitButton.addEventListener('click', validateSpace);
    } else {
        console.error("Error: submitBtn button not found!");
    }
});
