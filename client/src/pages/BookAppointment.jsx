import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FamilyContext } from '../context/FamilyContext';
import { motion } from 'framer-motion';

const BookAppointment = () => {
    const { user } = useContext(AuthContext);
    const { childrenList } = useContext(FamilyContext);
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        childId: '',
        date: '',
        reason: '',
    });
    const [myAppointments, setMyAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [availability, setAvailability] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const fetchMyAppointments = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/appointments', config);
            setMyAppointments(data);
        } catch (error) {
            console.error("Error fetching my appointments", error);
        }
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/appointments/doctors', config);
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching doctors", error);
            }
        };
        fetchDoctors();
        fetchMyAppointments();
    }, [user]);

    useEffect(() => {
        const checkAvailability = async () => {
            if (formData.doctorId && formData.date) {
                setCheckingAvailability(true);
                setAvailability(null);
                setMessage(null);
                try {
                    const dateStr = formData.date.split('T')[0];
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`/api/appointments/doctors/${formData.doctorId}/availability?date=${dateStr}`, config);
                    setAvailability(data);
                } catch (error) {
                    console.error("Error fetching availability", error);
                    setMessage({ type: 'error', text: 'Error checking doctor availability.' });
                } finally {
                    setCheckingAvailability(false);
                }
            } else {
                setAvailability(null);
            }
        };
        // Debounce slightly to prevent rapid calls on typing
        const timeoutId = setTimeout(checkAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.doctorId, formData.date, user.token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/appointments', formData, config);
            setMessage({ type: 'success', text: 'Appointment booked successfully!' });
            fetchMyAppointments();
            setFormData({ doctorId: '', childId: '', date: '', reason: '' });
            setAvailability(null);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error booking appointment' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-8 flex items-center justify-center gap-3">
                <span className="bg-primary/20 p-2 rounded-xl text-primary">🩺</span>
                Book an Appointment
            </h1>
            {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 mb-6 rounded-xl font-bold shadow-sm border ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
                    {message.text}
                </motion.div>
            )}
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 md:p-8 mb-10 max-w-2xl mx-auto space-y-5">
                <div>
                    <label className="block text-sm font-bold mb-2 text-muted-foreground">Select Doctor</label>
                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                        className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-semibold"
                    >
                        <option value="">-- Select a Doctor --</option>
                        {doctors.map(doc => (
                            <option key={doc._id} value={doc._id}>
                                Dr. {doc.name} ({doc.specialization || 'General'})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-muted-foreground">Select Patient (Child)</label>
                    <select
                        name="childId"
                        value={formData.childId}
                        onChange={handleChange}
                        required
                        className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-semibold"
                    >
                        <option value="">-- Select a Patient --</option>
                        {childrenList.map(child => (
                            <option key={child._id} value={child._id}>{child.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-muted-foreground">Date & Time</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-semibold"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-muted-foreground">Reason for Visit</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none custom-scrollbar"
                        placeholder="E.g., High fever, Regular checkup..."
                    ></textarea>
                </div>

                <div className="flex items-center justify-between mt-6 bg-muted/30 p-4 rounded-xl border border-dashed">
                    {checkingAvailability ? (
                        <div className="text-muted-foreground font-bold text-sm flex items-center gap-2"><span>🔄</span> Checking doctor's schedule...</div>
                    ) : availability && (
                        <div className="text-sm w-full">
                            <p className="font-bold mb-1 flex justify-between">Doctor's Hours: <span className="text-primary">{availability.availability.startTime} - {availability.availability.endTime}</span></p>
                            <p className="font-bold flex justify-between">Daily Tokens: <span className={`${availability.availableTokens > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{availability.availableTokens} / {availability.maxTokens} Available</span></p>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || checkingAvailability || (availability && availability.availableTokens <= 0)}
                        className={`w-full bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:bg-primary/90 flex justify-center items-center gap-2 ${(loading || checkingAvailability || (availability && availability.availableTokens <= 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Booking...' : (availability && availability.availableTokens <= 0 ? 'Fully Booked for the Day' : 'Confirm Appointment ✨')}
                    </button>
                </div>
            </motion.form>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><span>📅</span> My Upcoming Appointments</h2>
                {myAppointments.length === 0 ? (
                    <div className="text-center p-12 bg-muted/30 rounded-3xl border border-dashed">
                        <span className="text-4xl mb-4 block">🗓️</span>
                        <p className="text-muted-foreground font-bold text-lg">You have no booked appointments.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myAppointments.map(app => (
                            <motion.div whileHover={{ scale: 1.02 }} key={app._id} className="glass-panel rounded-2xl p-5 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-extrabold text-lg text-primary">Dr. {app.doctor?.name}</h3>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${app.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' :
                                        app.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold mb-3">
                                    Patient: <span className="text-muted-foreground">{app.child?.name}</span>
                                </div>
                                <div className="bg-muted px-4 py-3 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <span className="font-bold flex items-center gap-2"><span>🕒</span> {new Date(app.date).toLocaleDateString()}</span>
                                    <span className="text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md border">{new Date(app.date).toLocaleTimeString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default BookAppointment;
