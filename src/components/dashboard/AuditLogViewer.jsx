import React, { useState, useEffect } from 'react';
import { Clock, Download, Filter } from 'lucide-react';
import { getAuditLog, formatAuditEvent } from '../../utils/auditLogger';

const AuditLogViewer = ({ db, firebaseConfigId, student, t, onClose }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadEvents();
    }, [student]);

    const loadEvents = async () => {
        setLoading(true);
        const log = await getAuditLog(db, firebaseConfigId, student.userId);
        setEvents(log);
        setLoading(false);
    };

    const exportCSV = () => {
        const headers = ['Timestamp', 'Event', 'Details'];
        const rows = events.map(e => {
            const formatted = formatAuditEvent(e, t);
            return [e.timestamp, e.type, formatted.text];
        });

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_${student.name}_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

    return (
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="text-2xl font-black text-slate-800">📜 Activity Log</h3>
                    <p className="text-slate-500 text-sm">{student.name} - Last {events.length} events</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2">
                        <Download size={18} /> CSV
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300">
                        Close
                    </button>
                </div>
            </div>

            <div className="p-6 flex gap-2 border-b border-slate-100">
                <Filter size={18} className="text-slate-400 mt-1" />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="flex-1 p-2 border border-slate-200 rounded-lg">
                    <option value="all">All Events</option>
                    <option value="module_complete">Modules</option>
                    <option value="exam_start">Exam Starts</option>
                    <option value="exam_complete">Exam Results</option>
                    <option value="level_up">Level Ups</option>
                </select>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <p className="text-center text-slate-400 py-8">Loading...</p>
                ) : filteredEvents.length === 0 ? (
                    <p className="text-center text-slate-400 py-8 italic">No events recorded yet</p>
                ) : (
                    <div className="space-y-3">
                        {filteredEvents.map((event, idx) => {
                            const formatted = formatAuditEvent(event, t);
                            return (
                                <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                                    <div className="text-3xl">{formatted.icon}</div>
                                    <div className="flex-1">
                                        <p className={`font-bold ${formatted.color}`}>{formatted.text}</p>
                                        <p className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                                            <Clock size={12} /> {formatted.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogViewer;
