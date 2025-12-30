import { jsPDF } from 'jspdf';
import { MODULES_ES as MODULES } from '../data/constants';

export const generateCheatSheet = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // --- HELPER: Clean Text ---
    // Fixes common encoding issues for jsPDF standard fonts
    const clean = (str) => {
        if (!str) return "";
        return str
            .replace(/–/g, "-")
            .replace(/—/g, "-")
            .replace(/“/g, '"')
            .replace(/”/g, '"')
            .replace(/’/g, "'")
            .replace(/‘/g, "'")
            .replace(/…/g, "...");
    };

    // --- HELPER: Header & Footer ---
    const drawHeader = (pageNum) => {
        // Red Brand Header
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("GUÍA RÁPIDA DE PRIMEROS AUXILIOS (P.A.S.)", pageWidth / 2, 15, { align: 'center' });

        // Subtitle
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Resumen Ejecutivo de Protocolos Vitales", pageWidth / 2, 25, { align: 'center' });

        // Bookmark
        if (pageNum > 1) {
            doc.setFontSize(10);
            doc.text(`Página ${pageNum}`, pageWidth - 15, 25, { align: 'right' });
        }
    };

    const drawFooter = () => {
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.setFont("helvetica", "italic");
        doc.text("Simulador PAS - OGV Apps", margin, pageHeight - 8);
        doc.text("ogonzalezv01@educarex.es", pageWidth - margin, pageHeight - 8, { align: 'right' });
    };

    // --- INIT ---
    let y = 50;
    let pageNum = 1;
    drawHeader(pageNum);
    drawFooter();

    // Filter relevant modules
    const validModules = MODULES.filter(m => m.content && m.content.steps && m.content.steps.length > 0 && m.type !== 'exam' && m.type !== 'roleplay');

    validModules.forEach((mod) => {
        const modTitle = clean(mod.title);

        // Pre-calculate Box Height
        // Header (10) + Steps
        let boxHeight = 15; // Title space
        const stepLines = []; // Store lines to avoid re-splitting

        // Helper: Reset font for accurate measuring
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        mod.content.steps.forEach(step => {
            const stepTitle = clean(step.title);
            const stepText = clean(step.text);
            const fullLine = `${stepTitle}: ${stepText}`;

            // Adjust width for text (Full width - margin inside box)
            const lines = doc.splitTextToSize(`• ${fullLine}`, contentWidth - 25);
            stepLines.push({ lines, isTip: false });
            boxHeight += (lines.length * 6) + 3; // 5mm per line (approx) + 3mm spacing

            if (step.tip) {
                const tipText = clean(step.tip);
                const tipLines = doc.splitTextToSize(`PRO: ${tipText}`, contentWidth - 25);
                stepLines.push({ lines: tipLines, isTip: true });
                boxHeight += (tipLines.length * 6) + 3;
            }
        });

        boxHeight += 5; // Bottom padding

        // Check overflow
        if (y + boxHeight > pageHeight - 25) {
            doc.addPage();
            pageNum++;
            drawHeader(pageNum);
            drawFooter();
            y = 50;
        }

        // DRAW BOX
        // Background
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

        // Module Title
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(modTitle, margin + 5, y + 10);

        // Content
        let currentY = y + 18;

        stepLines.forEach((item) => {
            if (item.isTip) {
                doc.setTextColor(180, 83, 9); // Amber
                doc.setFont("helvetica", "bolditalic");
                doc.setFontSize(9);
            } else {
                doc.setTextColor(51, 65, 85); // Slate-700
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
            }

            doc.text(item.lines, margin + 5, currentY);
            currentY += (item.lines.length * 6) + 2;
        });

        y += boxHeight + 10; // Margin between boxes
    });

    doc.save("Guía_Oficial_Primeros_Auxilios_OGV.pdf");
};

export const generateDiplomaPDF = async (userName = "ALUMNO", dateLabel = "", t, signatureDataUrl = null) => {
    try {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // --- 1. FONTS & COLORS ---
        const colorNavy = [15, 23, 42];
        const colorGold = [202, 138, 4];
        const colorGoldLight = [234, 179, 8];
        const colorMedicalRed = [159, 18, 57];
        const colorSlate = [71, 85, 105];

        // --- 2. BACKGROUND & BORDERS ---
        // Outer deep navy border
        doc.setFillColor(...colorNavy);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Inner page (slightly off-white/cream for prestige)
        doc.setFillColor(252, 252, 250);
        doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'F');

        // Main Gold Frame
        doc.setDrawColor(...colorGold);
        doc.setLineWidth(1);
        doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'D');

        // Thicker Gold Accent
        doc.setLineWidth(1.8);
        doc.rect(14, 14, pageWidth - 28, pageHeight - 28, 'D');

        // Corner Decorations (Medical Cross Style)
        const drawMedCorner = (x, y) => {
            doc.setDrawColor(...colorGold);
            doc.setLineWidth(0.5);
            // Small cross in corner
            doc.line(x - 4, y, x + 4, y);
            doc.line(x, y - 4, x, y + 4);
            // L-shape
            doc.setLineWidth(2);
            if (x < pageWidth / 2 && y < pageHeight / 2) { // Top Left
                doc.line(12, 40, 12, 12); doc.line(12, 12, 40, 12);
            } else if (x > pageWidth / 2 && y < pageHeight / 2) { // Top Right
                doc.line(pageWidth - 40, 12, pageWidth - 12, 12); doc.line(pageWidth - 12, 12, pageWidth - 12, 40);
            } else if (x > pageWidth / 2 && y > pageHeight / 2) { // Bottom Right
                doc.line(pageWidth - 12, pageHeight - 40, pageWidth - 12, pageHeight - 12); doc.line(pageWidth - 12, pageHeight - 12, pageWidth - 40, pageHeight - 12);
            } else { // Bottom Left
                doc.line(40, pageHeight - 12, 12, pageHeight - 12); doc.line(12, pageHeight - 12, 12, pageHeight - 40);
            }
        };
        drawMedCorner(12, 12);
        drawMedCorner(pageWidth - 12, 12);
        drawMedCorner(pageWidth - 12, pageHeight - 12);
        drawMedCorner(12, pageHeight - 12);

        // --- 3. WATERMARK ---
        doc.setTextColor(242, 242, 240);
        doc.setFontSize(140);
        doc.setFont("times", "bold");
        doc.saveGraphicsState();
        // Background large "PAS"
        doc.text("PAS", pageWidth / 2, pageHeight / 2 + 25, { align: 'center' });
        doc.restoreGraphicsState();

        // --- 4. HEADER ---
        doc.setTextColor(...colorGold);
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text("DEPARTAMENTO DE EDUCACIÓN FÍSICA", pageWidth / 2, 32, { align: 'center' });

        // Decorative line under header
        doc.setDrawColor(...colorGold);
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 50, 36, pageWidth / 2 + 50, 36);

        // Main Title
        doc.setTextColor(...colorNavy);
        doc.setFont("times", "bold");
        doc.setFontSize(50);
        doc.text("CERTIFICADO DE HONOR", pageWidth / 2, 60, { align: 'center' });

        // --- 5. BODY ---
        doc.setTextColor(...colorSlate);
        doc.setFont("times", "italic");
        doc.setFontSize(22);
        doc.text("Por la presente se reconoce y certifica que", pageWidth / 2, 85, { align: 'center' });

        // NAME (Dynamic Size)
        const safeName = String(userName || "ALUMNO").toUpperCase();
        doc.setTextColor(...colorMedicalRed);
        doc.setFont("times", "bold");

        let fontSize = 65;
        doc.setFontSize(fontSize);
        let nameWidth = doc.getTextWidth(safeName);
        const maxNameWidth = pageWidth - 100;

        if (nameWidth > pageWidth - 100) {
            fontSize = Math.floor(65 * ((pageWidth - 100) / nameWidth));
            if (fontSize < 18) fontSize = 18;
            doc.setFontSize(fontSize);
        }
        doc.text(safeName, pageWidth / 2, 115, { align: 'center' });

        // Accent line under name
        doc.setDrawColor(...colorGoldLight);
        doc.setLineWidth(1.2);
        doc.line(pageWidth / 2 - 70, 120, pageWidth / 2 + 70, 120);

        // Achievement Text
        doc.setTextColor(...colorSlate);
        doc.setFont("times", "normal");
        doc.setFontSize(18);
        doc.text("ha demostrado excelencia y dominio teórico-práctico en el programa de", pageWidth / 2, 140, { align: 'center' });
        doc.setFont("times", "bold");
        doc.setTextColor(...colorNavy);
        doc.setFontSize(20);
        doc.text("PRIMEROS AUXILIOS - SOPORTE VITAL BÁSICO (P.A.S.) - DESA", pageWidth / 2, 152, { align: 'center' });

        // --- 6. FOOTER / SIGNATURES ---
        const sigLineY = 178;
        const sigTextY = 185;
        doc.setDrawColor(...colorNavy);
        doc.setLineWidth(0.4);

        // Left: Teacher
        doc.line(40, sigLineY, 110, sigLineY);

        // --- HANDWRITTEN SIGNATURE ---
        if (signatureDataUrl) {
            try {
                // Draw signature above the line
                doc.addImage(signatureDataUrl, 'PNG', 45, sigLineY - 25, 60, 25);
            } catch (e) {
                console.error("Signature image error:", e);
            }
        }

        doc.setTextColor(...colorNavy);
        doc.setFontSize(10);
        doc.setFont("times", "bold");
        doc.text("Orestes González Villanueva", 75, sigTextY, { align: 'center' });
        doc.setFont("times", "normal");
        doc.text("Profesor de Educación Física", 75, sigTextY + 5, { align: 'center' });

        // Center QR Code (Real dynamic QR)
        const verifyUrl = `${window.location.origin}${window.location.pathname}?verify=true&n=${encodeURIComponent(btoa(unescape(encodeURIComponent(safeName))))}&d=${encodeURIComponent(btoa(dateLabel || new Date().toLocaleDateString()))}`;
        const qrSize = 25;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = 162;

        // Using a reliable public QR API
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verifyUrl)}`;

        // HELPER TO LOAD IMAGE from URL
        const loadImage = (url) => new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });

        try {
            const qrImg = await loadImage(qrApiUrl);
            doc.addImage(qrImg, 'PNG', qrX, qrY, qrSize, qrSize);
        } catch (e) {
            doc.setDrawColor(...colorNavy);
            doc.rect(qrX, qrY, qrSize, qrSize, 'D');
        }

        doc.setFontSize(7);
        doc.setTextColor(...colorSlate);
        doc.text("VERIFICACIÓN DE AUTENTICIDAD", pageWidth / 2, qrY + qrSize + 5, { align: 'center' });

        // Right: Date
        doc.line(pageWidth - 110, sigLineY, pageWidth - 40, sigLineY);
        doc.setTextColor(...colorNavy);
        doc.setFontSize(10);
        doc.setFont("times", "bold");
        doc.text("FECHA DE CERTIFICACIÓN", pageWidth - 75, sigTextY, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont("times", "normal");
        doc.text(dateLabel || new Date().toLocaleDateString(), pageWidth - 75, sigTextY + 5, { align: 'center' });

        // --- 7. SAVE ---
        const fileName = `Diploma_PAS_${safeName.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
    } catch (error) {
        console.error("PDF Error:", error);
    }
};
