import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a professional PDF progress report for an individual student
 * @param {object} student - Student data with progress
 * @param {Array} modules - Available modules
 * @returns {void} - Downloads PDF
 */
export const generateStudentProgressPDF = (student, modules = []) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Branding Colors
    const colors = {
        primary: [30, 58, 138],   // Navy Blue
        secondary: [100, 116, 139], // Slate
        accent: [59, 130, 246],    // Blue
        success: [21, 128, 61],    // Green
        danger: [185, 28, 28],     // Red
        bg: [248, 250, 252]        // Slate 50
    };

    // --- HEADER ---
    pdf.setFillColor(...colors.primary);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REPORTE DE PROGRESO ACADÉMICO', 20, 25);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, 20, 32);

    // --- STUDENT INFO ---
    let yPos = 50;
    pdf.setTextColor(...colors.primary);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATOS DEL ESTUDIANTE', 20, yPos);

    yPos += 8;
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos, 80, yPos);

    yPos += 10;
    pdf.autoTable({
        startY: yPos,
        margin: { left: 20 },
        tableWidth: pageWidth - 40,
        theme: 'plain',
        body: [
            ['Nombre:', student.name || 'N/A', 'Nivel:', student.progress?.level || 1],
            ['Rol:', student.role || 'N/A', 'XP Total:', student.progress?.xp || 0],
            ['Estado Examen:', student.progress?.examenPassed ? 'APROBADO' : 'PENDIENTE', 'Últ. Actividad:', student.lastUpdate ? new Date(student.lastUpdate).toLocaleDateString() : 'N/A']
        ],
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: colors.secondary, cellWidth: 30 },
            1: { cellWidth: 60 },
            2: { fontStyle: 'bold', textColor: colors.secondary, cellWidth: 30 },
            3: { fontStyle: 'bold' }
        }
    });

    yPos = pdf.lastAutoTable.finalY + 15;

    // --- MODULE PROGRESS ---
    pdf.setTextColor(...colors.primary);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESGLOSE DE MÓDULOS', 20, yPos);

    yPos += 8;
    pdf.line(20, yPos, 80, yPos);

    const moduleData = modules
        .filter(m => m.type !== 'exam' && m.type !== 'desa' && m.type !== 'glossary' && m.type !== 'certificate')
        .map(m => {
            const isComp = student.progress?.[`${m.id}Completed`];
            return [
                m.id.toUpperCase(),
                m.title || m.id,
                isComp ? 'COMPLETADO' : 'PENDIENTE'
            ];
        });

    pdf.autoTable({
        startY: yPos + 5,
        margin: { left: 20 },
        tableWidth: pageWidth - 40,
        head: [['ID', 'Módulo', 'Estado']],
        body: moduleData,
        headStyles: { fillColor: colors.primary, textColor: 255 },
        styles: { fontSize: 9 },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 2) {
                if (data.cell.raw === 'COMPLETADO') {
                    pdf.setTextColor(...colors.success);
                    pdf.setFont('helvetica', 'bold');
                } else {
                    pdf.setTextColor(...colors.secondary);
                }
            }
        }
    });

    yPos = pdf.lastAutoTable.finalY + 15;

    // --- EXAM HISTORY ---
    if (student.progress?.examAttempts && student.progress.examAttempts.length > 0) {
        if (yPos > pageHeight - 60) {
            pdf.addPage();
            yPos = 20;
        }

        pdf.setTextColor(...colors.primary);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('HISTORIAL DE EXÁMENES', 20, yPos);

        yPos += 8;
        pdf.line(20, yPos, 80, yPos);

        const examData = student.progress.examAttempts.slice(0, 10).map((att, idx) => [
            idx + 1,
            att.date ? new Date(att.date).toLocaleDateString() : 'N/A',
            `${att.grade?.toFixed(1) || '0.0'}/10.0`,
            att.passed ? 'APROBADO' : 'NO APROBADO'
        ]);

        pdf.autoTable({
            startY: yPos + 5,
            margin: { left: 20 },
            tableWidth: pageWidth - 40,
            head: [['#', 'Fecha', 'Calificación', 'Resultado']],
            body: examData,
            headStyles: { fillColor: colors.accent, textColor: 255 },
            styles: { fontSize: 9 },
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 3) {
                    if (data.cell.raw === 'APROBADO') {
                        pdf.setTextColor(...colors.success);
                        pdf.setFont('helvetica', 'bold');
                    } else {
                        pdf.setTextColor(...colors.danger);
                    }
                }
            }
        });
    }

    // --- FOOTER ---
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.secondary);
        pdf.text(
            `Simulador PAS - Sistema de Gestión de Emergencias | Página ${i} de ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Download
    const fileName = `Reporte_${(student.name || 'estudiante').replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
};

export default { generateStudentProgressPDF };
