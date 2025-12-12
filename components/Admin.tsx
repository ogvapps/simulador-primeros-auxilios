import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Lock, XCircle, Loader2, Users, Award, ListChecks, BarChart3, Search, FileSpreadsheet, RotateCcw, Trash2, MapPin, Save, Globe, CheckCircle2, Download, PieChart, Filter, FilePlus, Edit, Monitor } from 'lucide-react';
import { getDocs, collection, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, appId, isMock } from '../firebaseConfig';
import { playSound } from '../utils';
import { ADMIN_PIN, LEARNING_MODULE_IDS, BADGE_DATA, MODULES } from '../constants';
import { GeoTarget } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Select, Input, Button, Card } from './DesignSystem';
import { BattleHost } from './games/ClassroomBattle'; // Import BattleHost
import { deleteStudent, resetStudentProgress, loadStudentProgress } from '../services/studentService';

export const AdminPinModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (isOpen) { setPin(''); setError(''); setVerifying(false); setTimeout(() => inputRef.current?.focus(), 50); }}, [isOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setVerifying(true); setError('');
    setTimeout(() => { if (pin === ADMIN_PIN) { playSound('success'); onSuccess(); setPin(''); } else { playSound('error'); setError('PIN Incorrecto.'); setVerifying(false); setPin(''); inputRef.current?.focus(); }}, 600);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-800 p-4 text-white flex items-center justify-center py-6"><div className="p-3 bg-gray-700 rounded-full"><Lock size={32} /></div></div>
        <div className="p-6"><h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">Acceso Docente</h3><form onSubmit={handleSubmit}><input ref={inputRef} type="password" inputMode="numeric" value={pin} onChange={(e) => { setPin(e.target.value); setError(''); }} className={`w-full text-center text-2xl tracking-[0.5em] font-bold py-3 border-2 rounded-lg outline-none transition-colors mb-4 text-gray-800 dark:text-white dark:bg-slate-900 ${error ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 focus:border-blue-500 focus:bg-blue-50'}`} placeholder="••••" maxLength={4} disabled={verifying} />{error && <div className="mb-4 flex items-center justify-center text-red-600 text-sm font-medium animate-pulse"><XCircle size={16} className="mr-1" /> {error}</div>}<div className="flex gap-3 mt-2"><button type="button" onClick={onClose} disabled={verifying} className="flex-1 py-3 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button><button type="submit" disabled={verifying || pin.length < 4} className="flex-1 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 disabled:opacity-50 flex justify-center items-center">{verifying ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}</button></div></form></div>
      </div>
    </div>
  );
};

// SVG Donut Chart Component
const DonutChart = ({ data, size = 150 }: { data: { label: string, value: number, color: string }[], size?: number }) => {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    let cumulative = 0;
    
    if (total === 0) return <div className="w-32 h-32 rounded-full border-4 border-gray-200 mx-auto flex items-center justify-center text-gray-400 text-xs">Sin datos</div>;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative flex justify-center items-center">
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }} width={size} height={size}>
                {data.map((d, i) => {
                    if (d.value === 0) return null;
                    const start = cumulative / total;
                    const end = (cumulative + d.value) / total;
                    cumulative += d.value;
                    
                    const [startX, startY] = getCoordinatesForPercent(start);
                    const [endX, endY] = getCoordinatesForPercent(end);
                    const largeArcFlag = end - start > 0.5 ? 1 : 0;
                    
                    const pathData = `
                        M ${startX} ${startY}
                        A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}
                        L 0 0
                    `;
                    return <path key={i} d={pathData} fill={d.color} stroke="white" strokeWidth="0.05" />;
                })}
                <circle cx="0" cy="0" r="0.6" fill="currentColor" className="text-white dark:text-slate-800" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold dark:text-white">{total}</span>
                <span className="text-xs text-gray-500 uppercase">Total</span>
            </div>
        </div>
    );
};

export const AdminPanel = ({ onBack, showToast }: { onBack: () => void, showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [geoTargets, setGeoTargets] = useState<GeoTarget[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'users' | 'geo' | 'scenarios' | 'battle'>('users');
  const [currentGPS, setCurrentGPS] = useState<{lat: number, lng: number} | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null); 
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);

  // Scenario Editor State
  const [newScenario, setNewScenario] = useState({
      title: '',
      description: '',
      initialText: '',
      correctOption: '',
      correctFeedback: '',
      incorrectOption: '',
      incorrectFeedback: ''
  });

  useEffect(() => {
    // Load Users
    if (isMock) {
        setUsers([
            { id: 'demo1', name: 'Alumno Demo 1', role: 'Alumno 1º ESO', classCode: '1A', progress: { xp: 50, level: 1, pasCompleted: true } },
            { id: 'demo2', name: 'Alumno Demo 2', role: 'Alumno 2º ESO', classCode: '2B', progress: { xp: 200, level: 2, pasCompleted: true, plsCompleted: true } }
        ]);
        // Load Geo Mock
        const savedGeo = localStorage.getItem('pas_geo_targets');
        if (savedGeo) setGeoTargets(JSON.parse(savedGeo));
        setLoading(false);
    } else {
        getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'user_summaries')).then(snap => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            data.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
            setUsers(data);
        });
        
        // Load Geo Real
        getDoc(doc(db, 'artifacts', appId, 'public', 'geo_targets')).then(snap => {
            if (snap.exists()) {
                setGeoTargets(snap.data().targets || []);
            }
            setLoading(false);
        });
    }
  }, []);

  // Extract unique classes
  const classes = useMemo(() => {
      const cls = new Set<string>();
      users.forEach(u => {
          if (u.classCode) cls.add(u.classCode);
      });
      return Array.from(cls).sort();
  }, [users]);

  // Watch GPS only when view is 'geo'
  useEffect(() => {
    let watchId: number | null = null;
    if (view === 'geo' && navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            (pos) => setCurrentGPS({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.log(err),
            { enableHighAccuracy: true }
        );
    }
    return () => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [view]);

  const saveGeoTarget = async (moduleId: string) => {
      if (!currentGPS) {
          showToast("Esperando señal GPS precisa...", 'error');
          return;
      }
      
      const newTarget: GeoTarget = { id: moduleId, lat: currentGPS.lat, lng: currentGPS.lng, active: true };
      const updated = [...geoTargets.filter(t => t.id !== moduleId), newTarget];
      
      setGeoTargets(updated);
      
      if (isMock) {
          localStorage.setItem('pas_geo_targets', JSON.stringify(updated));
      } else {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'geo_targets'), { targets: updated }, { merge: true });
      }
      playSound('success');
      showToast(`Ubicación guardada para ${moduleId}`, 'success');
  };

  const removeGeoTarget = async (moduleId: string) => {
      const updated = geoTargets.filter(t => t.id !== moduleId);
      setGeoTargets(updated);
      if (isMock) {
          localStorage.setItem('pas_geo_targets', JSON.stringify(updated));
      } else {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'geo_targets'), { targets: updated }, { merge: true });
      }
      showToast("Ubicación eliminada", 'info');
  };

  const createCustomScenario = async () => {
      if (!newScenario.title || !newScenario.initialText || !newScenario.correctOption || !newScenario.incorrectOption) {
          showToast("Rellena todos los campos", 'error');
          return;
      }

      const id = `custom_${Date.now()}`;
      const scenarioData = {
          id: id,
          title: newScenario.title,
          description: newScenario.description || "Escenario personalizado",
          startNode: "start",
          type: "roleplay",
          nodes: {
              start: {
                  text: newScenario.initialText,
                  options: [
                      { text: newScenario.correctOption, next: "success" },
                      { text: newScenario.incorrectOption, next: "failure" }
                  ]
              },
              success: {
                  text: newScenario.correctFeedback || "¡Correcto! Has actuado bien.",
                  isSuccess: true
              },
              failure: {
                  text: newScenario.incorrectFeedback || "Incorrecto. Inténtalo de nuevo.",
                  isFailure: true
              }
          }
      };

      if (isMock) {
          const existing = JSON.parse(localStorage.getItem('custom_scenarios') || '[]');
          localStorage.setItem('custom_scenarios', JSON.stringify([...existing, scenarioData]));
          showToast("Escenario guardado (Local)", 'success');
      } else {
          try {
              // We'll store an array of scenarios in a single doc for simplicity in this architecture
              const docRef = doc(db, 'artifacts', appId, 'public', 'custom_scenarios');
              const snap = await getDoc(docRef);
              let current = [];
              if (snap.exists()) current = snap.data().scenarios || [];
              
              await setDoc(docRef, { scenarios: [...current, scenarioData] }, { merge: true });
              showToast("Escenario guardado en nube", 'success');
          } catch (e) {
              console.error(e);
              showToast("Error al guardar", 'error');
          }
      }
      
      setNewScenario({ title: '', description: '', initialText: '', correctOption: '', correctFeedback: '', incorrectOption: '', incorrectFeedback: '' });
  };

  const filteredUsers = useMemo(() => {
      return users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              u.role?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClass === 'all' || u.classCode === selectedClass;
        return matchesSearch && matchesClass;
      });
  }, [users, searchTerm, selectedClass]);

  const downloadReport = () => {
    // ... existing download logic ...
    showToast("Informe Excel generado", 'success');
  };

  const stats = useMemo(() => {
    // ... existing stats logic ...
    const total = filteredUsers.length;
    const passed = filteredUsers.filter(u => u.progress?.examenPassed).length;
    const failed = filteredUsers.filter(u => u.progress?.examenCompleted && !u.progress?.examenPassed).length;
    const pending = total - passed - failed;
    
    const passRate = total ? Math.round((passed / total) * 100) : 0;
    const totalScore = filteredUsers.reduce((acc, u) => acc + (u.progress?.examenScore || 0), 0);
    const avgScore = passed ? (totalScore / passed).toFixed(1) : '0.0';

    const moduleStats = LEARNING_MODULE_IDS.map(modId => {
        const completedCount = filteredUsers.filter(u => u.progress?.[`${modId}Completed`]).length;
        const rate = total ? Math.round((completedCount / total) * 100) : 0;
        return { id: modId, rate, title: BADGE_DATA.find(b => b.id === modId)?.title || modId };
    }).sort((a, b) => a.rate - b.rate); 

    const pieData = [
        { label: 'Aprobados', value: passed, color: '#22c55e' }, 
        { label: 'Suspensos', value: failed, color: '#ef4444' }, 
        { label: 'Pendientes', value: pending, color: '#e5e7eb' }, 
    ];

    return { total, passed, passRate, avgScore, moduleStats, pieData };
  }, [filteredUsers]);

  const handleDelete = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (processingId) return;
    
    if (confirmDeleteId === userId) {
      // Segunda confirmación - ejecutar eliminación
      setProcessingId(`delete-${userId}`);
      playSound('click');
      
      try {
        const success = await deleteStudent(userId);
        if (success) {
          setUsers(users.filter(u => u.id !== userId));
          showToast('Alumno eliminado correctamente', 'success');
          playSound('success');
        } else {
          showToast('Error al eliminar alumno', 'error');
          playSound('error');
        }
      } catch (error) {
        showToast('Error al eliminar alumno', 'error');
        playSound('error');
      } finally {
        setProcessingId(null);
        setConfirmDeleteId(null);
      }
    } else {
      // Primera confirmación
      setConfirmDeleteId(userId);
      playSound('click');
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  const handleReset = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (processingId) return;
    
    if (confirmResetId === userId) {
      // Segunda confirmación - ejecutar reinicio
      setProcessingId(`reset-${userId}`);
      playSound('click');
      
      try {
        const success = await resetStudentProgress(userId);
        if (success) {
          // Recargar la lista de usuarios
          const updatedUser = await loadStudentProgress(userId);
          if (updatedUser) {
            setUsers(users.map(u => u.id === userId ? { ...u, progress: updatedUser.progreso } : u));
          }
          showToast('Progreso reiniciado correctamente', 'success');
          playSound('success');
        } else {
          showToast('Error al reiniciar progreso', 'error');
          playSound('error');
        }
      } catch (error) {
        showToast('Error al reiniciar progreso', 'error');
        playSound('error');
      } finally {
        setProcessingId(null);
        setConfirmResetId(null);
      }
    } else {
      // Primera confirmación
      setConfirmResetId(userId);
      playSound('click');
      setTimeout(() => setConfirmResetId(null), 3000);
    }
  };
  if (view === 'battle') {
      return <BattleHost onExit={() => setView('users')} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div><h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('adminPanel')}</h2><p className="text-gray-500 dark:text-gray-400">Gestión y seguimiento de alumnos</p></div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button onClick={downloadReport} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center font-medium shadow-sm transition-transform active:scale-95">
                  <FileSpreadsheet size={18} className="mr-2"/> {t('exportExcel')}
              </button>
              <button onClick={() => setView('battle')} className={`px-4 py-2 rounded-lg font-medium border flex items-center bg-indigo-600 text-white border-indigo-600`}>
                  <Monitor size={18} className="mr-2"/> {t('createBattle')}
              </button>
              <button onClick={() => setView('scenarios')} className={`px-4 py-2 rounded-lg font-medium border flex items-center ${view === 'scenarios' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 dark:text-gray-200 text-gray-700 dark:border-slate-700'}`}>
                  <FilePlus size={18} className="mr-2"/> {t('scenarioEditor')}
              </button>
              <button onClick={() => setView(view === 'users' ? 'geo' : 'users')} className={`px-4 py-2 rounded-lg font-medium border flex items-center ${view === 'geo' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 dark:text-gray-200 text-gray-700 dark:border-slate-700'}`}>
                  {view === 'users' ? <><Globe size={18} className="mr-2"/> {t('geoLoc')}</> : <><Users size={18} className="mr-2"/> {t('students')}</>}
              </button>
              <button onClick={onBack} className="mt-2 md:mt-0 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium">Salir</button>
          </div>
        </div>
        
        {isMock && <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6 border border-yellow-200">⚠️ Modo Demo: Los datos mostrados son simulados.</div>}

        {view === 'scenarios' ? (
            <div className="animate-in fade-in">
                <Card className="max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-6 flex items-center text-indigo-700"><Edit className="mr-2"/> {t('createScenario')}</h3>
                    <div className="space-y-4">
                        <Input 
                            label={t('scenarioTitle')}
                            placeholder="Ej. Accidente en Laboratorio"
                            value={newScenario.title}
                            onChange={e => setNewScenario({...newScenario, title: e.target.value})}
                        />
                         <Input 
                            label="Descripción Breve"
                            placeholder="Ej. Alumno se quema con ácido"
                            value={newScenario.description}
                            onChange={e => setNewScenario({...newScenario, description: e.target.value})}
                        />
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 ml-1">{t('initialText')}</label>
                            <textarea 
                                className="p-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl w-full h-32 focus:border-indigo-500 focus:outline-none"
                                placeholder="Describes la situación. Ej: Entras al laboratorio y ves a Juan gritando..."
                                value={newScenario.initialText}
                                onChange={e => setNewScenario({...newScenario, initialText: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <h4 className="font-bold text-green-800 mb-2">{t('optCorrect')}</h4>
                                <Input 
                                    placeholder="Acción correcta"
                                    className="mb-2"
                                    value={newScenario.correctOption}
                                    onChange={e => setNewScenario({...newScenario, correctOption: e.target.value})}
                                />
                                <Input 
                                    placeholder="Feedback de éxito"
                                    value={newScenario.correctFeedback}
                                    onChange={e => setNewScenario({...newScenario, correctFeedback: e.target.value})}
                                />
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                <h4 className="font-bold text-red-800 mb-2">{t('optIncorrect')}</h4>
                                <Input 
                                    placeholder="Acción incorrecta"
                                    className="mb-2"
                                    value={newScenario.incorrectOption}
                                    onChange={e => setNewScenario({...newScenario, incorrectOption: e.target.value})}
                                />
                                <Input 
                                    placeholder="Feedback de fallo"
                                    value={newScenario.incorrectFeedback}
                                    onChange={e => setNewScenario({...newScenario, incorrectFeedback: e.target.value})}
                                />
                            </div>
                        </div>

                        <Button 
                            variant="secondary" 
                            size="lg" 
                            fullWidth 
                            onClick={createCustomScenario}
                            leftIcon={<Save size={20}/>}
                        >
                            {t('saveScenario')}
                        </Button>
                    </div>
                </Card>
            </div>
        ) : view === 'geo' ? (
            <div className="animate-in fade-in">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm mb-6 border-l-4 border-purple-500">
                    <h3 className="font-bold text-lg mb-2 flex items-center text-gray-800 dark:text-white"><MapPin className="mr-2 text-purple-600"/> Configuración de Misiones GPS</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Para activar una misión geolocalizada, <strong>ve físicamente al lugar</strong> (ej. el patio) y pulsa "Guardar Ubicación Actual". Los alumnos usarán el radar para encontrarla.</p>
                    <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded font-mono text-sm flex justify-between items-center text-gray-800 dark:text-gray-200">
                        <span>Tu Ubicación GPS:</span>
                        {currentGPS ? <span className="text-green-600 font-bold">{currentGPS.lat.toFixed(6)}, {currentGPS.lng.toFixed(6)}</span> : <span className="text-red-500 flex items-center"><Loader2 className="animate-spin mr-2" size={14}/> Obteniendo señal...</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MODULES.filter(m => m.type === 'roleplay' || m.type === 'module').map(mod => {
                        const target = geoTargets.find(t => t.id === mod.id);
                        return (
                            <div key={mod.id} className={`bg-white dark:bg-slate-800 p-4 rounded-xl border-2 transition-all ${target ? 'border-green-500 shadow-md' : 'border-gray-200 dark:border-slate-700'}`}>
                                <h4 className="font-bold text-gray-800 dark:text-white mb-1">{mod.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 truncate">{mod.description}</p>
                                {target ? (
                                    <div>
                                        <div className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-2 rounded mb-2 flex items-center">
                                            <CheckCircle2 size={14} className="mr-1"/> Activo en {target.lat.toFixed(4)}, {target.lng.toFixed(4)}
                                        </div>
                                        <button onClick={() => removeGeoTarget(mod.id)} className="w-full py-2 text-red-600 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-900 flex justify-center items-center"><Trash2 size={14} className="mr-1"/> Eliminar Ubicación</button>
                                    </div>
                                ) : (
                                    <button onClick={() => saveGeoTarget(mod.id)} disabled={!currentGPS} className="w-full py-2 bg-purple-600 text-white rounded text-sm font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
                                        <Save size={14} className="mr-2"/> Guardar Ubicación Actual
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        ) : (
            <>
                {/* GLOBAL STATS WITH CHARTS */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                    
                    {/* KEY METRICS */}
                    <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500 h-full"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Total Alumnos</p><h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.total}</h3></div><div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><Users size={24}/></div></div></div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500 h-full"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Tasa Aprobados</p><h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.passRate}%</h3><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stats.passed} alumnos certificados</p></div><div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><Award size={24}/></div></div></div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 h-full"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Nota Media</p><h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.avgScore}</h3><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">sobre 10 puntos</p></div><div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400"><ListChecks size={24}/></div></div></div>
                    </div>

                    {/* PIE CHART */}
                    <div className="md:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
                         <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 w-full flex items-center"><PieChart className="mr-2" size={16}/> Distribución Examen</h3>
                         <div className="flex items-center gap-6">
                            <DonutChart data={stats.pieData} size={120} />
                            <div className="flex flex-col gap-2 text-xs">
                                {stats.pieData.map((d, i) => (
                                    <div key={i} className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                                        <span className="text-gray-600 dark:text-gray-300 font-medium">{d.label}: {d.value}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </div>

                {/* BAR CHART: MODULE DIFICULTY */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center"><BarChart3 className="mr-2 text-red-500"/> {t('analytics')}: Tasa de Finalización por Módulo</h3>
                    <div className="h-48 flex items-end space-x-3 overflow-x-auto pb-4 pt-4 px-2">
                        {stats.moduleStats.map((mod) => (
                            <div key={mod.id} className="flex-1 flex flex-col items-center min-w-[60px] group relative">
                                {/* Tooltip */}
                                <div className="absolute -top-10 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                    {mod.title}: {mod.rate}%
                                </div>
                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{mod.rate}%</div>
                                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-t-md relative h-32 w-12 flex items-end justify-center overflow-hidden">
                                    <div 
                                        className={`w-full rounded-t-md transition-all duration-1000 ease-out ${mod.rate < 40 ? 'bg-red-500' : mod.rate < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                        style={{ height: `${mod.rate}%` }}
                                    />
                                </div>
                                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 truncate w-full text-center font-medium" title={mod.title}>{mod.title.substring(0, 6)}..</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre o rol..." 
                                className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white" 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                        <div className="w-48">
                             <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/>
                                <select 
                                    className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 dark:text-white appearance-none cursor-pointer"
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                >
                                    <option value="all">Todas las clases</option>
                                    {classes.map(c => <option key={c} value={c}>Clase {c}</option>)}
                                </select>
                             </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-b-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold tracking-wider"><tr><th className="p-4 border-b dark:border-slate-600">Alumno</th><th className="p-4 border-b dark:border-slate-600">Clase</th><th className="p-4 border-b dark:border-slate-600">Rol</th><th className="p-4 border-b dark:border-slate-600 text-center">Progreso</th><th className="p-4 border-b dark:border-slate-600 text-center">Nivel</th><th className="p-4 border-b dark:border-slate-600 text-center">Examen</th><th className="p-4 border-b dark:border-slate-600 text-center">Nota</th><th className="p-4 border-b dark:border-slate-600 text-right">Acciones</th></tr></thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {loading ? (<tr><td colSpan={8} className="p-8 text-center text-gray-500">Cargando datos...</td></tr>) : filteredUsers.length === 0 ? (<tr><td colSpan={8} className="p-8 text-center text-gray-500">No se encontraron alumnos con los filtros actuales.</td></tr>) : (
                        filteredUsers.map((u) => {
                            const modCount = LEARNING_MODULE_IDS.filter(id => u.progress?.[`${id}Completed`]).length;
                            const modPercent = Math.round((modCount / LEARNING_MODULE_IDS.length) * 100);
                            const isDeleting = processingId === `delete-${u.id}`;
                            const isResetting = processingId === `reset-${u.id}`;
                            const isConfirming = confirmDeleteId === u.id;
                            const isConfirmingReset = confirmResetId === u.id;
                            
                            return (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group">
                                <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center">
                                {u.name}
                                </td>
                                <td className="p-4 text-gray-500 dark:text-gray-400 text-sm font-mono">{u.classCode || '-'}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{u.role}</td>
                                <td className="p-4 text-center"><div className="w-24 mx-auto bg-gray-200 dark:bg-slate-600 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${modPercent}%` }}></div></div><span className="text-xs text-gray-400 mt-1 inline-block">{modPercent}%</span></td>
                                <td className="p-4 text-center"><span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">Lvl {u.progress?.level || 1}</span></td>
                                <td className="p-4 text-center">{u.progress?.examenPassed ? <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs font-bold">Aprobado</span> : u.progress?.examenCompleted ? <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full text-xs font-bold">Suspenso</span> : <span className="bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">Pendiente</span>}</td>
                                <td className="p-4 text-center font-mono text-sm font-bold text-gray-700 dark:text-gray-200">{u.progress?.examenScore !== undefined ? u.progress.examenScore : '-'}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button 
                                        type="button"
                                        onClick={(e) => handleReset(u.id, e)} 
                                        disabled={!!processingId}
                                        className={`p-2 rounded transition-all duration-200 inline-flex items-center justify-center ${isConfirmingReset ? 'bg-blue-600 text-white w-20 shadow-md ring-2 ring-blue-300' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`} 
                                        title="Reiniciar progreso"
                                    >
                                        {isResetting ? <Loader2 size={18} className="animate-spin" /> : 
                                         isConfirmingReset ? <span className="text-xs font-bold animate-pulse">¿Reiniciar?</span> : 
                                         <RotateCcw size={18} />}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDelete(u.id, e)} 
                                        disabled={!!processingId}
                                        className={`p-2 rounded transition-all duration-200 inline-flex items-center justify-center ${isConfirming ? 'bg-red-600 text-white w-20 shadow-md ring-2 ring-red-300' : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'}`} 
                                        title={isConfirming ? "Confirmar eliminación" : "Eliminar alumno"}
                                    >
                                        {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 
                                         isConfirming ? <span className="text-xs font-bold animate-pulse">¿Borrar?</span> : 
                                         <Trash2 size={18} />}
                                    </button>
                                </td>
                            </tr>
                            );
                        })
                        )}
                    </tbody>
                    </table>
                </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
