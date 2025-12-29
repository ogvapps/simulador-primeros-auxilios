import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Lock, RefreshCw, Loader2, Award, Zap, BookOpen, ShieldCheck, UserCheck, HeartPulse, Flame, Wind, Frown, HardHat, Smile, Brain, Syringe, AirVent, Activity, Gauge, Waves, BriefcaseMedical, Siren, MessageSquare, GraduationCap, Trash2, RotateCcw, AlertTriangle, Users, TrendingUp, BarChart3, CheckCircle2, Zap as ZapIcon, BrainCircuit, Clock, Search, Download, Eye, EyeOff, Filter, FileSpreadsheet, X, FileJson, FileText, ChevronDown, Star, Trophy, Settings as SettingsIcon } from 'lucide-react';

import { collection, getDocs, getFirestore, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import AnalyticsDashboard from './AnalyticsDashboard';
import SettingsTab from './SettingsTab';
import LiveClassroom from './LiveClassroom';
import QuestionEditor from './QuestionEditor';
import BenchmarkCard from './BenchmarkCard';
import { generateMentorInsight } from '../../utils/mentorAI';
import { LEVELS, EXAM_QUESTIONS } from '../../data/constants';
import { generateStudentProgressPDF } from '../../utils/studentProgressPDF';
import { STORE_ITEMS } from '../../data/storeCatalog';

const AdminPanel = ({ onBack, db, firebaseConfigId, playSound, t, modules, addToast }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('todos');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [presentationMode, setPresentationMode] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // list, analytics, settings, live
    const [selectedIds, setSelectedIds] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ show: false, student: null });

    const badgeModules = useMemo(() => {
        if (!modules) return [];
        return modules.filter(m => m.type !== 'exam' && m.type !== 'desa' && m.type !== 'glossary' && m.type !== 'certificate' && m.type !== 'timeTrial' && !m.id.startsWith('sim_'));
    }, [modules]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const q = collection(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries');
            const querySnapshot = await getDocs(q);
            const studentsData = [];
            querySnapshot.forEach((doc) => {
                studentsData.push(doc.data());
            });
            studentsData.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
            setStudents(studentsData);
        } catch (error) {
            console.error("Error fetching students:", error);
            if (playSound) playSound('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const stats = useMemo(() => {
        if (!students.length || !badgeModules.length) return null;
        const totalStudents = students.length;
        const totalLevel = students.reduce((acc, s) => acc + (s.progress?.level || 1), 0);
        const avgLevel = (totalLevel / totalStudents).toFixed(1);
        const totalModules = badgeModules.length;
        const totalCompletedModules = students.reduce((acc, s) => {
            const completed = badgeModules.filter(m => s.progress?.[`${m.id}Completed`]).length;
            return acc + completed;
        }, 0);
        const avgCompletion = Math.round((totalCompletedModules / (totalStudents * totalModules)) * 100);
        const passedExam = students.filter(s => s.progress?.examenPassed).length;
        const totalXp = students.reduce((acc, s) => acc + (s.progress?.xp || 0), 0);

        // Count specific modules for chart (optional, kept simple for now)
        return { totalStudents, avgLevel, avgCompletion, passedExam, totalXp };
    }, [students, badgeModules]);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchRole = roleFilter === 'todos' || s.role === roleFilter;
            return matchSearch && matchRole;
        });
    }, [students, searchTerm, roleFilter]);


    // --- ACTIONS ---

    const handleDelete = async (student) => {
        const msg = t?.admin?.confirmDelete?.replace('{name}', student.name) || `Are you sure you want to delete ${student.name}?`;
        if (!confirm(msg)) return;
        try {
            const uid = student.userId;
            if (!uid) return;
            await deleteDoc(doc(db, 'artifacts', firebaseConfigId, 'users', uid, 'progress', 'main'));
            await deleteDoc(doc(db, 'artifacts', firebaseConfigId, 'users', uid, 'profile', 'main'));
            await deleteDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries', uid));
            if (playSound) playSound('success');
            setStudents(prev => prev.filter(s => s.userId !== uid));
        } catch (error) {
            console.error("Error deleting user:", error);
            if (playSound) playSound('error');
            addToast(t?.admin?.errorDelete || "Error deleting user.", 'error');
        }
    };

    const handleReset = async (student) => {
        const msg = t?.admin?.confirmReset?.replace('{name}', student.name) || `Reset progress for ${student.name}?`;
        if (!confirm(msg)) return;
        try {
            const uid = student.userId;
            if (!uid) return;
            const initProgress = { xp: 0, level: 1 };
            await setDoc(doc(db, 'artifacts', firebaseConfigId, 'users', uid, 'progress', 'main'), initProgress);
            await updateDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries', uid), { progress: initProgress, lastUpdate: new Date().toISOString() });
            if (playSound) playSound('success');
            fetchStudents();
        } catch (error) {
            console.error("Error resetting user:", error);
            if (playSound) playSound('error');
        }
    };

    const handleToggleBlock = (student) => {
        setConfirmModal({ show: true, student });
    };

    const confirmBlockAction = async () => {
        const student = confirmModal.student;
        if (!student) return;

        const isBlocked = student.blocked;

        console.log("Processing block action:", { studentId: student.userId, firebaseConfigId, isBlocked });

        try {
            const uid = student.userId;
            if (!uid) throw new Error("Student ID is missing");

            await updateDoc(doc(db, 'artifacts', firebaseConfigId, 'users', uid, 'profile', 'main'), { blocked: !isBlocked });
            await updateDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries', uid), { blocked: !isBlocked });

            if (playSound) playSound('success');
            addToast(isBlocked ? "Usuario desbloqueado" : "Usuario bloqueado", 'success');

            // Update local state
            setStudents(prev => prev.map(s => s.userId === uid ? { ...s, blocked: !isBlocked } : s));
        } catch (error) {
            console.error("Error toggling block DETAILED:", error);
            if (error.code) console.error("Firestore Error Code:", error.code);
            addToast(`Error: ${error.message}`, 'error');
            if (playSound) playSound('error');
        } finally {
            setConfirmModal({ show: false, student: null });
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredStudents.length) setSelectedIds([]);
        else setSelectedIds(filteredStudents.map(s => s.userId));
    };

    const handleBulkDelete = async () => {
        if (!confirm((t?.bulk?.confirmDelete || "Delete {n} users?").replace('{n}', selectedIds.length))) return;
        let count = 0;
        for (const uid of selectedIds) {
            try {
                await deleteDoc(doc(db, 'artifacts', firebaseConfigId, 'users', uid, 'progress', 'main'));
                await deleteDoc(doc(db, 'artifacts', firebaseConfigId, 'users', uid, 'profile', 'main'));
                await deleteDoc(doc(db, 'artifacts', firebaseConfigId, 'public', 'data', 'user_summaries', uid));
                count++;
            } catch (e) { console.error(e); }
        }
        addToast(`${count} users deleted`, 'success');
        setSelectedIds([]);
        fetchStudents();
    };

    const handleExportJSON = () => {
        const exportData = {
            metadata: {
                title: "Simulador PAS - Exportación de Datos",
                generatedDate: new Date().toISOString(),
                version: "2.0.0-Premium",
                stats: {
                    totalStudents: stats.totalStudents,
                    avgLevel: stats.avgLevel,
                    avgCompletion: stats.avgCompletion,
                    passedExam: stats.passedExam
                }
            },
            students: students.map(s => ({
                id: s.userId,
                name: s.name,
                role: s.role,
                lastUpdate: s.lastUpdate,
                progress: s.progress
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Backup_Estudiantes_PAS_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast(t?.toasts?.exportSuccess || "JSON exportado con éxito", 'success');
    };

    const handleBulkDiplomas = async () => {
        const selected = students.filter(s => selectedIds.includes(s.userId) && s.progress?.examenPassed);
        if (!selected.length) {
            addToast(t?.toasts?.noEligibleStudents || "No hay estudiantes elegibles seleccionados", 'warning');
            return;
        }

        addToast(t?.toasts?.generatingDiplomas || "Generando Diplomas Premium...", 'info');
        try {
            const { jsPDF } = await import('jspdf');
            // Landscape, mm, A4
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            selected.forEach((s, i) => {
                if (i > 0) doc.addPage();
                const w = doc.internal.pageSize.width;
                const h = doc.internal.pageSize.height;

                // --- DECORATIVE BORDERS ---
                // Outer gold border
                doc.setDrawColor(218, 165, 32);
                doc.setLineWidth(2);
                doc.rect(10, 10, w - 20, h - 20);

                // Inner thin blue border
                doc.setDrawColor(30, 58, 138);
                doc.setLineWidth(0.5);
                doc.rect(13, 13, w - 26, h - 26);

                // Corner accents (simulated)
                doc.setFillColor(218, 165, 32);
                doc.rect(10, 10, 15, 15, 'F'); // TL
                doc.rect(w - 25, 10, 15, 15, 'F'); // TR
                doc.rect(10, h - 25, 15, 15, 'F'); // BL
                doc.rect(w - 25, h - 25, 15, 15, 'F'); // BR

                // --- CONTENT ---
                // Title
                doc.setFont("times", "bold");
                doc.setFontSize(40);
                doc.setTextColor(30, 58, 138);
                doc.text((t?.diploma?.title || "DIPLOMA DE HONOR").toUpperCase(), w / 2, 50, { align: 'center' });

                // Subtitle
                doc.setFontSize(16);
                doc.setTextColor(100);
                doc.setFont("helvetica", "normal");
                doc.text(t?.diploma?.certifies || "Por el presente se certifica que", w / 2, 70, { align: 'center' });

                // Student Name
                doc.setFont("times", "italic");
                doc.setFontSize(48);
                doc.setTextColor(0);
                doc.text(s.name, w / 2, 95, { align: 'center' });

                // Body text
                doc.setFontSize(14);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(80);
                const bodyMsg = t?.diploma?.body || "Ha completado exitosamente el programa de capacitación en Primeros Auxilios y Soporte Vital Básico.";
                const splitBody = doc.splitTextToSize(bodyMsg, 200);
                doc.text(splitBody, w / 2, 120, { align: 'center' });

                // Meta Info (Date and ID)
                const dateStr = new Date().toLocaleDateString();
                const certId = `CERT-PAS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

                // Signatures
                doc.setDrawColor(150);
                doc.setLineWidth(0.5);
                doc.line(40, 170, 100, 170); // Left sig
                doc.line(w - 100, 170, w - 40, 170); // Right sig

                doc.setFontSize(10);
                doc.setTextColor(120);
                doc.text(t?.diploma?.date || "Fecha", 70, 175, { align: 'center' });
                doc.text(dateStr, 70, 165, { align: 'center' });

                doc.text(t?.diploma?.instructor || "Director General", w - 70, 175, { align: 'center' });
                doc.text("OGV Apps Ed.", w - 70, 165, { align: 'center' });

                // Verification Label
                doc.setFontSize(8);
                doc.setTextColor(180);
                doc.text(`${t?.diploma?.verify || "ID de Verificación"}: ${certId}`, w / 2, 195, { align: 'center' });
            });

            doc.save(`Diplomas_PAS_${selected.length}_Estudiantes.pdf`);
            if (playSound) playSound('success');
            addToast(t?.toasts?.exportSuccess || "Diplomas generados", 'success');
        } catch (e) {
            console.error(e);
            addToast("Error al generar Diplomas PDF", 'error');
        }
    };

    // --- SINGLE EXPORT WRAPPER ---
    const handleDiploma = async (s) => {
        // We reuse handleBulkDiplomas logic by temporarily mocking selection
        const originalSelected = [...selectedIds];
        setSelectedIds([s.userId]);
        setTimeout(() => {
            handleBulkDiplomas();
            setSelectedIds(originalSelected);
        }, 100);
    };

    const handleExportExcel = async () => {
        if (!students.length) return;
        addToast(t?.admin?.generating || "Generating Premium Excel...", 'info');
        try {
            const ExcelJS = (await import('exceljs')).default;
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Simulador PAS - OGV Apps';
            workbook.lastModifiedBy = 'Admin';
            workbook.created = new Date();

            // --- SHEET 1: DASHBOARD ---
            const wsDash = workbook.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });

            // Header
            wsDash.mergeCells('B2:F3');
            const dashHeader = wsDash.getCell('B2');
            dashHeader.value = (t?.export?.summaryTitle || 'REPORTE EJECUTIVO DE PROGRESO').toUpperCase();
            dashHeader.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
            dashHeader.alignment = { vertical: 'middle', horizontal: 'center' };
            dashHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

            // Stats Grid
            const statsLabels = [
                { label: t?.admin?.totalStudents || 'Total Estudiantes', val: stats.totalStudents, col: 'B' },
                { label: t?.admin?.avgLevel || 'Nivel Promedio', val: stats.avgLevel, col: 'C' },
                { label: t?.admin?.globalProgress || 'Progreso Global', val: `${stats.avgCompletion}%`, col: 'D' },
                { label: t?.admin?.examPasses || 'Exámenes Aprobados', val: stats.passedExam, col: 'E' }
            ];

            statsLabels.forEach((item, idx) => {
                const cellLabel = wsDash.getCell(`${item.col}5`);
                const cellVal = wsDash.getCell(`${item.col}6`);

                cellLabel.value = item.label.toUpperCase();
                cellLabel.font = { size: 10, bold: true, color: { argb: 'FF64748B' } };
                cellLabel.alignment = { horizontal: 'center' };

                cellVal.value = item.val;
                cellVal.font = { size: 24, bold: true, color: { argb: 'FF1E293B' } };
                cellVal.alignment = { horizontal: 'center' };

                wsDash.getColumn(item.col).width = 25;
            });

            // Branding
            wsDash.getCell('B8').value = `Generado el: ${new Date().toLocaleString()}`;
            wsDash.getCell('B8').font = { italic: true, color: { argb: 'FF94A3B8' } };

            // --- SHEET 2: DETAILS ---
            const ws = workbook.addWorksheet('Lista de Estudiantes', {
                views: [{ state: 'frozen', ySplit: 1, xSplit: 1 }]
            });

            const headers = [
                t?.admin?.table?.student || 'Estudiante',
                t?.admin?.table?.role || 'Rol',
                t?.admin?.table?.level || 'Nivel',
                'XP Total',
                t?.admin?.table?.finalExam || 'Examen Final',
                '% Progreso'
            ];
            badgeModules.forEach(m => headers.push(m.title));
            headers.push('Última Actividad');

            const headerRow = ws.getRow(1);
            headerRow.values = headers;
            headerRow.height = 25;

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = { bottom: { style: 'thin', color: { argb: 'FF1D4ED8' } } };
            });

            filteredStudents.forEach((s) => {
                const completedCount = badgeModules.filter(m => s.progress?.[`${m.id}Completed`]).length;
                const progressPct = (completedCount / badgeModules.length);

                const rowData = [
                    s.name,
                    s.role,
                    s.progress?.level || 1,
                    s.progress?.xp || 0,
                    s.progress?.examenPassed ? 'APROBADO' : 'PENDIENTE',
                    progressPct
                ];

                badgeModules.forEach(m => rowData.push(s.progress?.[`${m.id}Completed`] ? 'SÍ' : 'NO'));
                rowData.push(s.lastUpdate ? new Date(s.lastUpdate).toLocaleString() : 'N/A');

                const newRow = ws.addRow(rowData);

                // Style Exam cell based on status
                const examCell = newRow.getCell(5);
                if (examCell.value === 'APROBADO') {
                    examCell.font = { color: { argb: 'FF15803D' }, bold: true };
                } else {
                    examCell.font = { color: { argb: 'FF94A3B8' } };
                }

                // Format Pct cell
                const pctCell = newRow.getCell(6);
                pctCell.numFmt = '0%';
            });

            // Auto-width columns
            ws.columns.forEach(column => {
                let maxLen = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const len = cell.value ? cell.value.toString().length : 0;
                    if (len > maxLen) maxLen = len;
                });
                column.width = Math.min(Math.max(12, maxLen + 2), 40);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Reporte_PAS_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();

            addToast(t?.toasts?.exportSuccess || "Excel exportado con éxito", 'success');
            if (playSound) playSound('success');
        } catch (e) {
            console.error(e);
            addToast("Error al generar Excel", 'error');
        }
    };

    const handleExportPDFBulletin = async () => {
        if (!students.length) return;
        addToast(t?.admin?.generating || "Generando Reporte Global...", 'info');
        try {
            const { jsPDF } = await import('jspdf');
            const autoTable = (await import('jspdf-autotable')).default;
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Header
            doc.setFillColor(30, 58, 138);
            doc.rect(0, 0, pageWidth, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text("REPORTE GLOBAL DE RENDIMIENTO", pageWidth / 2, 16, { align: 'center' });

            doc.setTextColor(100);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 35);

            const tableData = filteredStudents.map(s => {
                const comp = badgeModules.filter(m => s.progress?.[`${m.id}Completed`]).length;
                const pct = Math.round((comp / badgeModules.length) * 100);
                return [
                    s.name,
                    s.role,
                    s.progress?.level || 1,
                    s.progress?.xp || 0,
                    s.progress?.examenPassed ? 'APROBADO' : 'PENDIENTE',
                    `${pct}%`
                ];
            });

            autoTable(doc, {
                startY: 40,
                head: [['Estudiante', 'Rol', 'Nivel', 'XP', 'Examen', 'Progreso']],
                body: tableData,
                headStyles: { fillColor: [30, 58, 138], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                margin: { top: 40 },
                styles: { fontSize: 9 }
            });

            doc.save(`Reporte_Global_PAS_${new Date().toISOString().split('T')[0]}.pdf`);
            if (playSound) playSound('success');
            addToast(t?.toasts?.exportSuccess || "Reporte generado con éxito", 'success');
        } catch (e) {
            console.error(e);
            addToast("Error al generar PDF", 'error');
        }
    };

    const handleExportDiplomas = async () => {
        const passing = students.filter(s => s.progress?.examenPassed);
        if (!passing.length) {
            addToast(t?.toasts?.noEligibleStudents || "No hay estudiantes aprobados para diplomas", 'warning');
            return;
        }
        setSelectedIds(passing.map(s => s.userId));
        setTimeout(() => handleBulkDiplomas(), 100);
    };

    // --- RENDER ---

    if (viewMode === 'live') {
        return <LiveClassroom students={students} t={t} onExit={() => setViewMode('list')} db={db} firebaseConfigId={firebaseConfigId} examQuestions={EXAM_QUESTIONS} />;
    }

    return (
        <div className="max-w-7xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow-xl min-h-[80vh] animate-in fade-in slide-in-from-bottom-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 hover:bg-slate-100 p-3 rounded-xl transition-colors group"><ArrowLeft size={24} className="text-slate-400 group-hover:text-slate-800" /></button>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t?.admin?.panelTitle || "Teacher Panel"}</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setViewMode('live')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all animate-pulse">
                        <Zap size={20} /> {t?.live?.launch || "LIVE MODE"}
                    </button>
                    <div className="relative">
                        <button onClick={() => setShowExportMenu(!showExportMenu)} className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 font-bold"><Download size={20} /> {t?.admin?.export || "Export"}</button>
                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                                <button onClick={() => { handleExportExcel(); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium border-b border-slate-50"><FileSpreadsheet size={16} className="text-green-600" /> Excel</button>
                                <button onClick={() => { handleExportPDFBulletin(); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium border-b border-slate-50"><FileText size={16} className="text-red-500" /> PDF Report</button>
                                <button onClick={() => { handleExportDiplomas(); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium border-b border-slate-50"><GraduationCap size={16} className="text-yellow-600" /> All Diplomas</button>
                                <button onClick={() => { handleExportJSON(); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium"><FileJson size={16} className="text-orange-500" /> Backup JSON</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 overflow-x-auto">
                <button onClick={() => setViewMode('list')} className={`pb-2 px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'list' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-400'}`}>
                    <Users size={18} /> {t?.admin?.listTab || "List"}
                </button>
                <button onClick={() => setViewMode('analytics')} className={`pb-2 px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'analytics' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-400'}`}>
                    <BarChart3 size={18} /> {t?.admin?.analyticsTab || "Analytics"}
                </button>
                <button onClick={() => setViewMode('editor')} className={`pb-2 px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'editor' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-400'}`}>
                    <FileText size={18} /> {t?.editor?.title || "Editor"}
                </button>
                <button onClick={() => setViewMode('settings')} className={`pb-2 px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'settings' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-400'}`}>
                    <SettingsIcon size={18} /> {t?.settings?.title || "Settings"}
                </button>
                <button onClick={() => setViewMode('benchmark')} className={`pb-2 px-4 font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'benchmark' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-400'}`}>
                    <Trophy size={18} /> Benchmark
                </button>
            </div>

            {/* Content Views */}
            {viewMode === 'analytics' && <AnalyticsDashboard students={students} badgeModules={badgeModules} t={t} />}
            {viewMode === 'editor' && <QuestionEditor db={db} firebaseConfigId={firebaseConfigId} t={t} addToast={addToast} playSound={playSound} />}
            {viewMode === 'settings' && <SettingsTab db={db} firebaseConfigId={firebaseConfigId} t={t} addToast={addToast} playSound={playSound} />}
            {viewMode === 'benchmark' && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-800">Student Performance Benchmarks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.map(s => (
                            <BenchmarkCard key={s.userId} student={s} db={db} firebaseConfigId={firebaseConfigId} t={t} />
                        ))}
                    </div>
                </div>
            )}

            {viewMode === 'list' && (
                <>
                    {/* Bulk Action Bar */}
                    {selectedIds.length > 0 && (
                        <div className="sticky top-0 z-40 bg-brand-600 text-white p-4 rounded-xl shadow-lg mb-6 flex items-center justify-between animate-in slide-in-from-top-4">
                            <div className="font-bold flex items-center gap-2"><CheckCircle2 /> {(t?.bulk?.selected || "{n} selected").replace('{n}', selectedIds.length)}</div>
                            <div className="flex gap-2">
                                <button onClick={handleBulkDiplomas} className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 rounded-lg font-bold flex items-center gap-2 text-sm"><Award size={16} /> {t?.bulk?.diplomas || "Diplomas"}</button>
                                <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg font-bold flex items-center gap-2 text-sm"><Trash2 size={16} /> {t?.bulk?.delete || "Delete"}</button>
                                <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold"><X size={16} /></button>
                            </div>
                        </div>
                    )}

                    {/* Stats for Mobile/Desktop */}
                    {(!loading && stats && selectedIds.length === 0) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><p className="text-blue-600 text-xs font-bold uppercase">{t?.admin?.totalStudents}</p><p className="text-2xl font-black text-slate-800">{stats.totalStudents}</p></div>
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100"><p className="text-green-600 text-xs font-bold uppercase">{t?.admin?.avgLevel}</p><p className="text-2xl font-black text-slate-800">{stats.avgLevel}</p></div>
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100"><p className="text-purple-600 text-xs font-bold uppercase">{t?.admin?.globalProgress}</p><p className="text-2xl font-black text-slate-800">{stats.avgCompletion}%</p></div>
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><p className="text-yellow-600 text-xs font-bold uppercase">{t?.admin?.examPasses}</p><p className="text-2xl font-black text-slate-800">{stats.passedExam}</p></div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input type="text" placeholder={t?.admin?.searchPlaceholder || "Search..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <button onClick={() => setPresentationMode(!presentationMode)} className={`px-4 py-2 border rounded-lg font-bold ${presentationMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'}`}>
                            {presentationMode ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider">
                                        <th className="p-5 font-bold text-slate-500 w-10">
                                            <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0} className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                                        </th>
                                        <th className="p-5 font-bold text-slate-500">{t?.admin?.table?.student || "Student"}</th>
                                        <th className="p-5 font-bold text-slate-500 hidden md:table-cell">{t?.admin?.table?.role || "Role"}</th>
                                        <th className="p-5 font-bold text-slate-500 text-center">{t?.admin?.table?.level || "Level"}</th>
                                        <th className="p-5 font-bold text-slate-500 text-center">{t?.admin?.table?.finalExam || "Exam"}</th>
                                        <th className="p-5 font-bold text-slate-500 text-center">{t?.admin?.table?.actions || "Actions"}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStudents.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-slate-400 italic">No students found</td></tr> :
                                        filteredStudents.map((s, idx) => (
                                            <tr key={idx} onClick={() => setSelectedStudent(s)} className={`hover:bg-brand-50/30 transition-colors group cursor-pointer border-l-4 ${selectedIds.includes(s.userId) ? 'bg-brand-50 border-l-brand-500' : 'border-l-transparent'} ${s.blocked ? 'bg-red-50/50' : ''}`}>
                                                <td className="p-5" onClick={(e) => e.stopPropagation()}>
                                                    <input type="checkbox" checked={selectedIds.includes(s.userId)} onChange={() => toggleSelect(s.userId)} className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                                                </td>
                                                <td className="p-5 font-bold text-slate-800 flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold bg-slate-100 text-slate-500 shadow-sm border border-slate-200`}>
                                                        {presentationMode ? '*' : (STORE_ITEMS.avatars.find(a => a.id === s.progress?.activeAvatar)?.icon || (s.name || '?').charAt(0))}
                                                    </div>
                                                    {presentationMode ? `Student ${idx + 1}` : s.name}
                                                </td>
                                                <td className="p-5 text-slate-500 text-sm hidden md:table-cell">{s.role}</td>
                                                <td className="p-5 text-center font-black text-slate-700">{s.progress?.level || 1}</td>
                                                <td className="p-5 text-center">{s.progress?.examenPassed ? <span className="text-green-600 font-bold">✔</span> : <span className="text-slate-300 font-bold">-</span>}</td>
                                                <td className="p-5 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {!presentationMode && (
                                                            <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        generateStudentProgressPDF(s, modules);
                                                                    }}
                                                                    className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                                                                    title="Download Progress PDF"
                                                                >
                                                                    <Download size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleToggleBlock(s); }}
                                                                    className={`p-2 transition-colors ${s.blocked ? 'text-red-500 hover:text-red-700' : 'text-slate-400 hover:text-red-500'}`}
                                                                    title={s.blocked ? "Unblock User" : "Block User"}
                                                                >
                                                                    {s.blocked ? <UserCheck size={18} /> : <EyeOff size={18} />}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDelete(s); }}
                                                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                                    title="Delete Student"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div><h3 className="text-2xl font-black text-slate-800">{presentationMode ? 'Detail' : selectedStudent.name}</h3><p className="text-slate-500 font-medium">{selectedStudent.role}</p></div>
                            <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-500" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 text-center"><p className="text-brand-600 text-xs font-bold uppercase">{t?.admin?.detail?.level || "Level"}</p><p className="text-3xl font-black text-brand-800">{selectedStudent.progress?.level || 1}</p></div>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center"><p className="text-yellow-600 text-xs font-bold uppercase">{t?.admin?.detail?.xp || "XP"}</p><p className="text-3xl font-black text-yellow-800">{selectedStudent.progress?.xp || 0}</p></div>
                            </div>

                            {/* AI Mentor Insight */}
                            {(() => {
                                const insight = generateMentorInsight(selectedStudent, badgeModules, t);
                                return (
                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-2xl border-2 border-purple-200 mb-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                                <BrainCircuit size={20} className="text-white" />
                                            </div>
                                            <h4 className="font-black text-purple-900">{t?.mentor?.title || "AI Mentor Insight"}</h4>
                                            <div className={`ml-auto px-2 py-1 rounded-full text-xs font-bold ${insight.riskLevel === 'high' ? 'bg-red-100 text-red-700' : insight.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                {insight.riskLevel.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex gap-2">
                                                <span className="font-bold text-green-700 min-w-[80px]">✅ {t?.mentor?.strength || "Strength"}:</span>
                                                <p className="text-slate-700">{insight.strength}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="font-bold text-orange-700 min-w-[80px]">⚠️ {t?.mentor?.weakness || "Weakness"}:</span>
                                                <p className="text-slate-700">{insight.weakness}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="font-bold text-blue-700 min-w-[80px]">💡 {t?.mentor?.advice || "Advice"}:</span>
                                                <p className="text-slate-700">{insight.advice}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="flex gap-4 mb-8">
                                <button onClick={() => handleDiploma(selectedStudent)} className="flex-1 flex items-center justify-center gap-2 py-3 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"><Award size={20} /> {t?.admin?.detail?.downloadDiploma || "Download Diploma"}</button>
                            </div>
                            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><BookOpen size={20} className="text-slate-400" /> {t?.admin?.detail?.moduleProgress || "Modules"}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {badgeModules.map(m => (
                                    <div key={m.id} className={`flex items-center p-3 rounded-lg border ${selectedStudent.progress?.[`${m.id}Completed`] ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                        <div className={`mr-3 ${selectedStudent.progress?.[`${m.id}Completed`] ? 'text-green-500' : 'text-slate-300'}`}>{selectedStudent.progress?.[`${m.id}Completed`] ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}</div>
                                        <span className={`font-bold text-sm ${selectedStudent.progress?.[`${m.id}Completed`] ? 'text-green-900' : 'text-slate-500'}`}>{m.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end"><button onClick={() => setSelectedStudent(null)} className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900">{t?.admin?.detail?.close || "Close"}</button></div>
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            {confirmModal.show && confirmModal.student && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-full ${confirmModal.student.blocked ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {confirmModal.student.blocked ? <UserCheck size={24} /> : <EyeOff size={24} />}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {confirmModal.student.blocked ? (t?.admin?.confirmUnblockTitle || "Desbloquear Usuario") : (t?.admin?.confirmBlockTitle || "Bloquear Usuario")}
                            </h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            {(t?.admin?.confirmActionBody || "¿Estás seguro de que quieres {action} a {name}?").replace('{action}', confirmModal.student.blocked ? 'desbloquear' : 'bloquear').replace('{name}', confirmModal.student.name || 'este usuario')}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmModal({ show: false, student: null })}
                                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                {t?.common?.cancel || "Cancelar"}
                            </button>
                            <button
                                onClick={confirmBlockAction}
                                className={`px-4 py-2 font-bold rounded-lg text-white transition-colors ${confirmModal.student.blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {confirmModal.student.blocked ? (t?.common?.unblock || "Desbloquear") : (t?.common?.block || "Bloquear")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
