import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FamilyContext } from '../context/FamilyContext';
import { useParams } from 'react-router-dom';
import { Plus, Save, Clock, Trash2, Calendar, CheckCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DailySchedule = () => {
    const { user } = useContext(AuthContext);
    const { childrenList } = useContext(FamilyContext);
    const { childId } = useParams(); // Optional if we select via dropdown

    // If childId is in URL, use it. Otherwise default to first child.
    const [selectedChildId, setSelectedChildId] = useState(childId || (childrenList[0]?._id || ''));

    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newItem, setNewItem] = useState({ time: '', activity: '', notes: '' });

    useEffect(() => {
        if (selectedChildId) {
            fetchSchedule();
        }
    }, [selectedChildId]);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/schedule/${selectedChildId}`, config);
            // API returns { child, activities: [] } or null
            setSchedule(data?.activities || []);
        } catch (error) {
            console.error("Error fetching schedule", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.time || !newItem.activity) return;

        const updatedSchedule = [...schedule, newItem].sort((a, b) => a.time.localeCompare(b.time));
        setSchedule(updatedSchedule);
        setNewItem({ time: '', activity: '', notes: '' });

        await saveSchedule(updatedSchedule);
    };

    const handleDeleteItem = async (index) => {
        const updatedSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(updatedSchedule);
        await saveSchedule(updatedSchedule);
    };

    const saveSchedule = async (newActivities) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/schedule/${selectedChildId}`, { activities: newActivities }, config);
        } catch (error) {
            console.error("Error saving schedule", error);
            alert("Failed to save changes");
        }
    };

    const handleCompleteItem = async (index) => {
        // Mark item as completed
        const updatedSchedule = [...schedule];
        if (updatedSchedule[index].completed) return; // Already completed

        updatedSchedule[index] = { ...updatedSchedule[index], completed: true };
        setSchedule(updatedSchedule);
        await saveSchedule(updatedSchedule);

        // Award a star to the child
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/children/${selectedChildId}/stars`, { points: 1 }, config);

            // Note: In real app we might trigger a global toast or star animation here
        } catch (error) {
            console.error("Error awarding star", error);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                        <span className="bg-primary/20 p-2 rounded-xl text-primary"><Calendar size={28} /></span>
                        Daily Routine
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Manage activities and award stars for completion!</p>
                </div>

                {childrenList.length > 0 && (
                    <select
                        className="bg-background border border-border text-foreground font-bold px-4 py-2.5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={selectedChildId}
                        onChange={(e) => setSelectedChildId(e.target.value)}
                    >
                        {childrenList.map(c => <option key={c._id} value={c._id}>{c.name}'s Schedule</option>)}
                    </select>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Add New Activity Form - Parents Only */}
                {user.role !== 'doctor' && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1 glass-panel p-6 rounded-3xl h-fit">
                        <h2 className="font-extrabold text-xl mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                            <Plus size={24} className="text-primary" /> Add Activity
                        </h2>
                        <form onSubmit={handleAddItem} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-muted-foreground">Time</label>
                                <input
                                    type="time"
                                    required
                                    value={newItem.time}
                                    onChange={e => setNewItem({ ...newItem, time: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-muted-foreground">Activity</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Breakfast, Nap"
                                    value={newItem.activity}
                                    onChange={e => setNewItem({ ...newItem, activity: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-muted-foreground">Notes (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 2 scoops of formula"
                                    value={newItem.notes}
                                    onChange={e => setNewItem({ ...newItem, notes: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 font-medium"
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:bg-primary/90 flex justify-center items-center gap-2 mt-2">
                                Add to Schedule ✨
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Schedule List */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`glass-panel p-6 rounded-3xl ${user.role === 'doctor' ? 'md:col-span-3' : 'md:col-span-2'}`}>
                    <h2 className="font-extrabold text-xl mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                        <Clock className="text-primary" /> Current Routine
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-10 font-bold text-muted-foreground animate-pulse">Loading schedule...</div>
                    ) : schedule.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed flex flex-col items-center">
                            <span className="text-5xl mb-4">📝</span>
                            <p className="font-bold text-lg">No activities scheduled yet.</p>
                            <p className="text-sm opacity-70">Start by adding one from the form!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {schedule.map((item, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        key={`${item.time}-${index}`}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${item.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-white/40 dark:bg-black/20 border-white/20 hover:bg-white/60 dark:hover:bg-black/40 shadow-sm'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`font-extrabold px-3 py-1.5 rounded-lg text-sm h-fit whitespace-nowrap ${item.completed ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100' : 'bg-primary/10 text-primary'}`}>
                                                {item.time}
                                            </div>
                                            <div className={item.completed ? 'opacity-50 line-through transition-all' : 'transition-all'}>
                                                <h3 className="font-bold text-lg leading-tight">{item.activity}</h3>
                                                {item.notes && <p className="text-sm text-muted-foreground font-medium mt-1">{item.notes}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!item.completed && user.role === 'parent' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleCompleteItem(index)}
                                                    className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400 p-2 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition flex items-center gap-1 shadow-sm font-bold text-xs"
                                                    title="Complete & Get Star"
                                                >
                                                    <Star size={16} fill="currentColor" /> Earn
                                                </motion.button>
                                            )}
                                            {item.completed && (
                                                <span className="text-green-500 font-bold text-sm flex items-center gap-1"><CheckCircle size={16} /> Done</span>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteItem(index)}
                                                className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-2 rounded-xl transition ml-2"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default DailySchedule;
