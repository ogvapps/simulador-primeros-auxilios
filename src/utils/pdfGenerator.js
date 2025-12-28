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
