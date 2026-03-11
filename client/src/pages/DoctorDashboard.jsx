import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [families, setFamilies] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments');
    const [selectedChildHistory, setSelectedChildHistory] = useState(null);
    const [childHistoryData, setChildHistoryData] = useState({ healthRecords: [], appointments: [] });
    const [feedbackForm, setFeedbackForm] = useState({ title: '', notes: '', type: 'prescription' });
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'doctor') {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const famRes = await axios.get('/api/family/all', config);
            setFamilies(famRes.data);

            const appRes = await axios.get('/api/appointments', config);
            setAppointments(appRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/appointments/${id}/status`, { status }, config);
            fetchData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const fetchChildHistory = async (child) => {
        setSelectedChildHistory(child);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [healthRes, appRes] = await Promise.all([
                axios.get(`/api/health/${child._id}`, config),
                axios.get(`/api/appointments/child/${child._id}`, config)
            ]);
            setChildHistoryData({ healthRecords: healthRes.data, appointments: appRes.data });
        } catch (error) {
            console.error("Error fetching history", error);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingFeedback(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                }
            };
            const formData = new FormData();
            formData.append('childId', selectedChildHistory._id);
            formData.append('title', feedbackForm.title);
            formData.append('notes', feedbackForm.notes);
            formData.append('type', feedbackForm.type);
            formData.append('date', new Date().toISOString());
            await axios.post('/api/health', formData, config);

            setFeedbackForm({ title: '', notes: '', type: 'prescription' });
            fetchChildHistory(selectedChildHistory);
            alert('Added successfully!');
        } catch (error) {
            console.error("Error adding feedback:", error);
            alert('Failed to add feedback.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-md">
                        🩺
                    </div>
                    Doctor Portal
                </h1>
                <div className="glass-panel px-6 py-3 rounded-2xl shadow-sm border font-bold flex items-center gap-2">
                    <span className="text-2xl">👋</span> Welcome, Dr. <span className="text-primary">{user?.name}</span>
                </div>
            </div>

            <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 custom-scrollbar border-b border-border">
                <button
                    className={`px-5 py-3 font-bold transition-all border-b-2 ${activeTab === 'appointments' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    Appointments
                </button>
                <button
                    className={`px-5 py-3 font-bold transition-all border-b-2 ${activeTab === 'families' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                    onClick={() => setActiveTab('families')}
                >
                    Families & Patients
                </button>
            </div>

            {activeTab === 'appointments' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6 md:p-10">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-2">Upcoming Appointments</h2>
                    {appointments.length === 0 ? (
                        <div className="text-center p-16 bg-white/40 dark:bg-black/20 rounded-3xl border border-dashed border-primary/30">
                            <span className="text-6xl mb-4 block animate-bounce">📅</span>
                            <p className="text-primary font-bold text-xl">No appointments scheduled.</p>
                            <p className="text-muted-foreground font-medium mt-2">Check back later for new patient bookings.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-white/40 dark:border-white/10 shadow-sm bg-white/30 dark:bg-black/20">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-5 border-b border-border bg-white/50 dark:bg-black/40 text-left text-xs font-black text-muted-foreground uppercase tracking-widest rounded-tl-2xl">Date & Time</th>
                                        <th className="px-6 py-5 border-b border-border bg-white/50 dark:bg-black/40 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Patient</th>
                                        <th className="px-6 py-5 border-b border-border bg-white/50 dark:bg-black/40 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Parent</th>
                                        <th className="px-6 py-5 border-b border-border bg-white/50 dark:bg-black/40 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Reason</th>
                                        <th className="px-6 py-5 border-b border-border bg-white/50 dark:bg-black/40 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-5 border-b border-border bg-white/50 dark:bg-black/40 text-left text-xs font-black text-muted-foreground uppercase tracking-widest rounded-tr-2xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((app) => (
                                        <tr key={app._id} className="hover:bg-white/60 dark:hover:bg-black/40 transition-colors border-b last:border-0 border-white/20 dark:border-white/5">
                                            <td className="px-6 py-5 text-sm font-extrabold">
                                                {new Date(app.date).toLocaleDateString()} <br />
                                                <span className="text-primary font-bold text-xs">{new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-extrabold text-foreground">{app.child?.name}</td>
                                            <td className="px-6 py-5 text-sm">
                                                <div className="font-extrabold">{app.parent?.name}</div>
                                                <div className="text-xs text-muted-foreground font-bold">{app.parent?.email}</div>
                                            </td>
                                            <td className="px-6 py-5 text-sm max-w-[200px] font-bold text-muted-foreground truncate">{app.reason}</td>
                                            <td className="px-6 py-5 text-sm">
                                                <span className={`px-4 py-1.5 font-extrabold rounded-xl text-[10px] uppercase tracking-widest shadow-sm border ${app.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                                                    app.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm space-x-3">
                                                {app.status === 'pending' && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                                                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg font-bold shadow-sm transition-colors text-xs"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                                                            className="text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg font-bold transition-colors text-xs"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {app.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                                                        className="text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg font-bold transition-colors text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            )}

            {activeTab === 'families' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <h2 className="text-2xl font-black mb-6">Registered Patients</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {families.map(family => (
                            <motion.div whileHover={{ scale: 1.02 }} key={family._id} className="glass-panel rounded-3xl p-6 flex flex-col h-full border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h3 className="font-extrabold text-2xl mb-6 text-foreground flex items-center gap-3"><span className="text-3xl">👨‍👩‍👧‍👦</span> {family.name}</h3>
                                <div className="mb-6 bg-white/40 dark:bg-black/20 p-5 rounded-2xl flex-1 border border-white/50 dark:border-white/5">
                                    <span className="font-extrabold text-[10px] text-primary uppercase tracking-widest block mb-3">Parents / Guardians</span>
                                    <ul className="space-y-3">
                                        {family.parents && family.parents.map(m => (
                                            <li key={m._id} className="text-sm font-bold flex flex-col">
                                                {m.name}
                                                <span className="text-muted-foreground font-semibold text-xs">{m.email}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white/60 dark:bg-black/40 border-t border-white/50 dark:border-white/10 -mx-6 -mb-6 p-6 rounded-b-3xl">
                                    <span className="font-extrabold text-[10px] text-accent uppercase tracking-widest block mb-4">Children (Patients)</span>
                                    <ul className="space-y-4">
                                        {family.children && family.children.length > 0 ? family.children.map(c => (
                                            <li key={c._id} className="text-sm bg-white/50 dark:bg-black/40 p-4 rounded-2xl border border-white/40 dark:border-white/10 flex flex-col gap-3 shadow-sm">
                                                <div className="font-black text-lg text-foreground flex items-center gap-2">
                                                    {c.name}
                                                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                                        {c.gender.charAt(0).toUpperCase()} • Age {c.dob ? Math.floor((new Date() - new Date(c.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : '?'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => fetchChildHistory(c)}
                                                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm text-xs flex justify-center items-center gap-1"
                                                    >
                                                        Medical Chart ↗
                                                    </button>
                                                </div>
                                            </li>
                                        )) : <li className="text-sm text-muted-foreground italic font-medium">No children listed</li>}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {selectedChildHistory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass-panel rounded-[2rem] border-white/40 shadow-2xl p-6 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                            <button onClick={() => setSelectedChildHistory(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground text-3xl transition-colors bg-white/50 dark:bg-black/50 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-sm">&times;</button>

                            <div className="mb-8">
                                <h2 className="text-4xl font-black flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                    <span className="text-4xl">🧑‍⚕️</span> {selectedChildHistory.name}'s Chart
                                </h2>
                                <p className="text-muted-foreground font-bold mt-2 text-lg">Review history, upcoming vaccines, or add a prescription.</p>
                            </div>

                            {/* Add Feedback / Prescription Form */}
                            <div className="bg-white/50 dark:bg-black/30 p-8 rounded-[2rem] mb-10 border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h3 className="text-2xl font-black text-primary mb-6 flex items-center gap-2"><span>📝</span> Add Doctor Notes / Prescription</h3>
                                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-2">
                                            <label className="block text-sm font-bold text-muted-foreground pl-1">Record Type</label>
                                            <select
                                                value={feedbackForm.type}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                                                className="w-full bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-primary cursor-pointer appearance-none"
                                            >
                                                <option value="prescription">💊 Prescription / Medication</option>
                                                <option value="visit">🩺 Visit Notes / Advice</option>
                                            </select>
                                        </div>
                                        <div className="flex-[2] space-y-2">
                                            <label className="block text-sm font-bold text-muted-foreground pl-1">Diagnosis / Title</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Fever Treatment, Routine Checkup"
                                                value={feedbackForm.title}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                                                className="w-full bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-muted-foreground pl-1">Detailed Instructions</label>
                                        <textarea
                                            required
                                            rows="4"
                                            placeholder="Enter medicine dosage, timing, or general health suggestions here..."
                                            value={feedbackForm.notes}
                                            onChange={(e) => setFeedbackForm({ ...feedbackForm, notes: e.target.value })}
                                            className="w-full bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/10 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none custom-scrollbar font-medium"
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingFeedback}
                                            className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-2xl font-extrabold hover:opacity-90 disabled:opacity-50 transition-all shadow-md flex items-center gap-2 transform hover:-translate-y-1"
                                        >
                                            {isSubmittingFeedback ? 'Saving to Records...' : 'Save to Patient Chart ✨'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="bg-white/40 dark:bg-black/20 p-8 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-sm">
                                    <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground"><span className="text-green-500">💉</span> Upcoming Vaccinations</h3>
                                    {selectedChildHistory.vaccinations && selectedChildHistory.vaccinations.filter(v => v.status === 'pending').length > 0 ? (
                                        <ul className="space-y-4">
                                            {selectedChildHistory.vaccinations.filter(v => v.status === 'pending').map((vaccine, idx) => (
                                                <li key={idx} className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-white/40 dark:border-white/5 font-extrabold text-sm flex justify-between items-center shadow-sm">
                                                    {vaccine.name}
                                                    <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20">Due: {vaccine.dueDate ? new Date(vaccine.dueDate).toLocaleDateString() : 'N/A'}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground font-bold italic">No pending vaccinations found.</p>
                                    )}
                                </div>

                                <div className="bg-white/40 dark:bg-black/20 p-8 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-sm">
                                    <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-foreground"><span className="text-blue-500">🗓️</span> Appointment History</h3>
                                    {childHistoryData.appointments.length > 0 ? (
                                        <div className="space-y-4">
                                            {childHistoryData.appointments.map(app => (
                                                <div key={app._id} className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-white/40 dark:border-white/5 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-sm font-extrabold text-foreground">{app.reason}</span>
                                                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${app.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'}`}>{app.status}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground font-bold">
                                                        <span>Doc: {app.doctor?.name || 'Unknown'}</span>
                                                        <span>{new Date(app.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground font-bold italic">No past appointments recorded.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/30 dark:bg-black/10 p-8 rounded-[2rem] border border-white/40 dark:border-white/5">
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-foreground"><span>📂</span> Full Health Records</h3>
                                {childHistoryData.healthRecords.length > 0 ? (
                                    <div className="space-y-5">
                                        {childHistoryData.healthRecords.map(record => (
                                            <div key={record._id} className="glass-panel p-6 rounded-2xl shadow-sm flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-extrabold text-primary text-xl">{record.title}</span>
                                                    <span className="text-xs font-black text-muted-foreground bg-white/60 dark:bg-black/40 px-3 py-1.5 rounded-xl shadow-sm border border-white/40">{new Date(record.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-foreground bg-white/40 dark:bg-black/20 p-4 rounded-xl border border-white/30 leading-relaxed font-medium">{record.notes}</p>
                                                <div>
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm inline-block mt-1">Type: {record.type}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-12 bg-white/30 dark:bg-black/20 rounded-3xl border border-dashed border-primary/20">
                                        <p className="text-primary font-bold text-lg">No health records exist in the system yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorDashboard;
