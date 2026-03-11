import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const defaultAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const Support = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('contact'); // contact, create, list

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/support', config);
            setTickets(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/support', { subject, message }, config);
            fetchTickets();
            setActiveTab('list');
            setSubject('');
            setMessage('');
            alert('Ticket created successfully');
        } catch (error) {
            alert('Error creating ticket');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 md:p-8 max-w-5xl mx-auto">
            <div className="mb-8 font-bold text-3xl flex items-center gap-3">
                <span className="bg-primary/20 p-2 rounded-xl text-primary">🤝</span>
                <h2>Support Center</h2>
            </div>

            <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                <button
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${activeTab === 'contact' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => setActiveTab('contact')}
                >
                    Contact Info
                </button>
                <button
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${activeTab === 'create' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => setActiveTab('create')}
                >
                    Open Ticket
                </button>
                <button
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${activeTab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => setActiveTab('list')}
                >
                    My Tickets
                </button>
            </div>

            {activeTab === 'contact' && (
                <motion.div {...defaultAnimation} className="glass-panel p-6 md:p-8 rounded-3xl max-w-lg">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><span className="text-blue-500">📞</span> Contact Support</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg text-green-600 dark:text-green-400">📱</div>
                            <div>
                                <p className="text-sm text-muted-foreground font-semibold">Phone</p>
                                <p className="font-bold">8639648563</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-600 dark:text-purple-400">✉️</div>
                            <div>
                                <p className="text-sm text-muted-foreground font-semibold">Email</p>
                                <p className="font-bold text-primary">shivaramak120@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-muted-foreground bg-muted/50 p-4 rounded-xl border border-dashed font-medium">Our support team is available 24/7 for assistance with medical records or app issues.</p>
                </motion.div>
            )}

            {activeTab === 'create' && (
                <motion.form {...defaultAnimation} onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-3xl max-w-lg space-y-5">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><span className="text-orange-500">📝</span> Open New Ticket</h3>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-muted-foreground">Subject</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Brief issue description" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-muted-foreground">Message</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all h-32 resize-none custom-scrollbar" placeholder="Detailed explanation..." required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground font-bold px-4 py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md">Submit Ticket ✨</button>
                </motion.form>
            )}

            {activeTab === 'list' && (
                <motion.div {...defaultAnimation} className="space-y-4 max-w-3xl">
                    {tickets.length === 0 && (
                        <div className="text-center p-12 bg-muted/30 rounded-3xl border border-dashed">
                            <span className="text-4xl mb-4 block">🎫</span>
                            <p className="text-muted-foreground font-bold text-lg">No tickets found.</p>
                            <p className="text-sm text-muted-foreground">You haven't opened any support tickets yet.</p>
                        </div>
                    )}
                    {tickets.map(ticket => (
                        <motion.div whileHover={{ scale: 1.01 }} key={ticket._id} className="glass-panel p-5 rounded-2xl hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-extrabold text-lg">{ticket.subject}</h4>
                                <span className={`px-3 py-1 font-bold rounded-lg text-xs uppercase tracking-wider ${ticket.status === 'open' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-muted text-muted-foreground'}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-muted-foreground bg-muted/40 p-3 flex-1 rounded-xl text-sm border-l-4 border-l-primary mb-3">{ticket.message}</p>
                            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><span className="text-[10px]">🕒</span> Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default Support;
