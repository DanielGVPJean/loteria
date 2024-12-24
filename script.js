// Convertir cm a píxeles (asumiendo una densidad de píxeles de 96 DPI)
const cmToPixels = (cm) => cm * 37.7952;

// Dimensiones de la hoja carta
const CARD_WIDTH = cmToPixels(21.59);
const CARD_HEIGHT = cmToPixels(27.94);
const MARGIN = cmToPixels(0.25);

// Configuración de la cuadrícula
const GRID_ROWS = 4;
const GRID_COLS = 3;

// Elementos del DOM
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const generateButton = document.getElementById('generateButton');
const downloadButton = document.getElementById('downloadButton');

// Configurar el canvas
canvas.width = CARD_WIDTH;
canvas.height = CARD_HEIGHT;

// Función para obtener imágenes aleatorias
async function getRandomImages(count) {
    const images = [];
    const usedIndices = new Set();

    while (images.length < count) {
        const index = Math.floor(Math.random() * 30) + 1; // Asumimos que hay 30 imágenes
        if (!usedIndices.has(index)) {
            usedIndices.add(index);
            const img = new Image();
            img.src = `images/${index}.png`;
            await new Promise((resolve) => {
                img.onload = resolve;
            });
            images.push(img);
        }
    }

    return images;
}

// Función para dibujar la cuadrícula de imágenes
function drawImageGrid(images) {
    ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    const cellWidth = (CARD_WIDTH - MARGIN * (GRID_COLS + 1)) / GRID_COLS;
    const cellHeight = (CARD_HEIGHT - MARGIN * (GRID_ROWS + 1)) / GRID_ROWS;

    images.forEach((img, index) => {
        const row = Math.floor(index / GRID_COLS);
        const col = index % GRID_COLS;

        const x = MARGIN + col * (cellWidth + MARGIN);
        const y = MARGIN + row * (cellHeight + MARGIN);

        const scale = Math.min(cellWidth / img.width, cellHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        const centerX = x + (cellWidth - scaledWidth) / 2;
        const centerY = y + (cellHeight - scaledHeight) / 2;

        ctx.drawImage(img, centerX, centerY, scaledWidth, scaledHeight);
    });
}

// Función para generar una nueva tarjeta
async function generateNewCard() {
    const images = await getRandomImages(GRID_ROWS * GRID_COLS);
    drawImageGrid(images);
}

// Función para descargar el PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: [21.59, 27.94]
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, 21.59, 27.94);
    pdf.save('tarjeta.pdf');
}

// Event listeners
generateButton.addEventListener('click', generateNewCard);
downloadButton.addEventListener('click', downloadPDF);

// Generar la primera tarjeta al cargar la página
generateNewCard();