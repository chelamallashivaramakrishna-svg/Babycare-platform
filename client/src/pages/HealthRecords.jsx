import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import GrowthChart from '../components/GrowthChart';
import { motion } from 'framer-motion';

const HealthRecords = () => {
    const { childId } = useParams();
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');
    const [formData, setFormData] = useState({
        type: 'vaccination',
        title: '',
        notes: '',
        height: '',
        weight: '',
        date: '',
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchRecords();
    }, [childId]);

    const fetchRecords = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/health/${childId}/`, config); // endpoint issue?
            // Wait, route is /api/health/:childId ??
            // In healthRoutes.js: router.get('/:childId', ...);
            // Correct.
            setRecords(data);

            // Filter for growth chart
            const growth = data.filter(r => r.type === 'growth' || r.metrics?.height || r.metrics?.weight);
            setGrowthData(growth.map(r => ({
                date: r.date,
                height: r.metrics?.height,
                weight: r.metrics?.weight
            })));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        const data = new FormData();
        data.append('childId', childId);
        data.append('type', formData.type);
        data.append('title', formData.title);
        data.append('notes', formData.notes);
        data.append('date', formData.date);
        if (formData.height) data.append('height', formData.height);
        if (formData.weight) data.append('weight', formData.weight);
        if (file) data.append('attachments', file);

        try {
            await axios.post('/api/health', data, config);
            fetchRecords(); // Refresh
            setActiveTab('list');
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding record');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
                <span className="bg-primary/20 p-2 rounded-xl text-primary">🏥</span>
                Health Records
            </h2>

            <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                <button
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${activeTab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => setActiveTab('list')}
                >
                    Timeline
                </button>
                <button
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${activeTab === 'chart' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => setActiveTab('chart')}
                >
                    Growth Chart
                </button>
                <button
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${activeTab === 'add' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Record
                </button>
            </div>

            {activeTab === 'chart' && <GrowthChart data={growthData} />}

            {activeTab === 'list' && (
                <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 space-y-8 pl-6 md:pl-10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/20 before:to-transparent before:w-0.5 before:-left-[1px]">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        {records.map(record => {
                            const isDoctorNote = record.doctor || record.type === 'prescription';
                            let icon = '📝';
                            let markerColor = 'bg-gray-400';

                            switch (record.type) {
                                case 'vaccination': icon = '💉'; markerColor = 'bg-blue-500'; break;
                                case 'growth': icon = '📏'; markerColor = 'bg-green-500'; break;
                                case 'visit': icon = '🩺'; markerColor = 'bg-purple-500'; break;
                                case 'prescription': icon = '💊'; markerColor = 'bg-indigo-500'; break;
                                default: icon = '📄'; markerColor = 'bg-orange-500';
                            }

                            return (
                                <motion.div whileHover={{ scale: 1.01 }} key={record._id} className="relative group">
                                    {/* Timeline Marker */}
                                    <div className={`absolute -left-[45px] md:-left-[61px] top-4 w-10 h-10 ${markerColor} rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-background z-10 text-lg transition-transform group-hover:scale-110`}>
                                        {icon}
                                    </div>

                                    <div className={`glass-panel p-6 md:p-8 rounded-3xl transition-all ${isDoctorNote ? 'border-indigo-200/50 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-900/10' : ''}`}>
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                                            <div>
                                                <h4 className={`font-extrabold text-2xl ${isDoctorNote ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400' : 'text-foreground'}`}>{record.title}</h4>
                                                {isDoctorNote && (
                                                    <span className="inline-flex items-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1.5 rounded-lg mt-2 font-extrabold shadow-sm border border-indigo-200 dark:border-indigo-800">
                                                        🩺 Verified by {record.doctor?.name ? `Dr. ${record.doctor.name}` : 'Doctor'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start md:items-end">
                                                <span className="text-sm text-foreground font-extrabold bg-white/60 dark:bg-black/40 px-4 py-1.5 rounded-full shadow-sm border border-border">
                                                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-extrabold">{record.type}</span>
                                            </div>
                                        </div>

                                        {record.notes && (
                                            <div className="mt-5 text-foreground/90 whitespace-pre-wrap bg-white/50 dark:bg-black/20 p-5 rounded-2xl text-sm border border-white/40 dark:border-white/5 leading-relaxed font-medium">
                                                {record.notes}
                                            </div>
                                        )}

                                        {record.metrics && (record.metrics.height || record.metrics.weight) && (
                                            <div className="mt-5 bg-white/60 dark:bg-black/30 border border-white/50 dark:border-white/10 shadow-sm inline-flex divide-x divide-border rounded-2xl tracking-wide overflow-hidden">
                                                {record.metrics.height && <span className="px-5 py-3 text-sm text-muted-foreground font-medium">Height: <span className="text-primary font-extrabold ml-1">{record.metrics.height} cm</span></span>}
                                                {record.metrics.weight && <span className="px-5 py-3 text-sm text-muted-foreground font-medium">Weight: <span className="text-primary font-extrabold ml-1">{record.metrics.weight} kg</span></span>}
                                            </div>
                                        )}

                                        {record.attachments && record.attachments.map((att, index) => (
                                            <div key={index} className="mt-5">
                                                <a href={`${att.url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white flex items-center text-sm font-extrabold bg-primary/10 hover:bg-primary px-5 py-2.5 rounded-xl inline-flex w-fit transition-all shadow-sm border border-primary/20">
                                                    📎 View Attached Form ({att.name})
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                        {records.length === 0 && (
                            <div className="text-center p-12 bg-white/40 dark:bg-black/20 rounded-3xl border border-dashed border-primary/30 ml-4 md:ml-12">
                                <span className="text-5xl mb-4 block animate-bounce">📋</span>
                                <p className="text-primary font-bold text-xl">No health timeline events yet.</p>
                                <p className="text-muted-foreground font-medium mt-2">Add a record to start building the medical history.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {activeTab === 'add' && (
                <motion.form initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleSubmit} className="glass-panel p-6 md:p-10 rounded-3xl max-w-2xl mx-auto space-y-6">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">New Entry</h3>
                        <p className="font-medium text-muted-foreground mt-2">Keep your child's medical history accurate and up-to-date.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-sm font-bold text-muted-foreground pl-1">Record Type</label>
                            <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-bold text-primary text-lg cursor-pointer appearance-none">
                                <option value="vaccination">💉 Vaccination</option>
                                <option value="growth">📏 Growth Metric</option>
                                <option value="visit">🩺 Doctor Visit</option>
                                <option value="other">📄 Other Notes</option>
                            </select>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-sm font-bold text-muted-foreground pl-1">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium" required placeholder="e.g. 6-Month Checkup" />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-sm font-bold text-muted-foreground pl-1">Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-bold text-primary" />
                        </div>

                        {formData.type === 'growth' && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-muted-foreground pl-1">Height (cm)</label>
                                    <input type="number" name="height" value={formData.height} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium text-lg" placeholder="e.g. 75" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-muted-foreground pl-1">Weight (kg)</label>
                                    <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium text-lg" placeholder="e.g. 9.5" />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-muted-foreground pl-1">Detailed Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all h-40 resize-none custom-scrollbar font-medium" placeholder="Doctor's advice, reactions, or specific observations..."></textarea>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-muted-foreground pl-1">Upload Documents (Optional)</label>
                        <div className="bg-white/30 dark:bg-black/10 border-2 border-dashed border-primary/30 rounded-2xl p-4 hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                            <input type="file" onChange={handleFileChange} className="w-full text-muted-foreground file:cursor-pointer file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-extrabold file:bg-primary file:text-primary-foreground hover:file:opacity-90 transition-all" />
                        </div>
                    </div>

                    <button type="submit" className="w-full text-primary-foreground font-extrabold text-lg bg-gradient-to-r from-primary to-accent rounded-2xl px-6 py-4 mt-8 hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/50">
                        Save Timeline Event ✨
                    </button>
                </motion.form>
            )}
        </div>
    );
};

export default HealthRecords;
