import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const MediaCenter = () => {
    const { user } = useContext(AuthContext);
    const [mediaList, setMediaList] = useState([]);
    const [activeTab, setActiveTab] = useState('browse'); // browse, add
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        category: 'Stories',
        minAge: 0,
        minAge: 0,
        maxAge: 5,
    });
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (user && user.role === 'child') {
            const fetchChildData = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`/api/children/${user._id}`, config);
                    setTimeLeft(data.screenTimeLimit - data.screenTimeUsed);
                } catch (error) {
                    console.error("Error fetching child data", error);
                }
            };
            fetchChildData();
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (user && user.role === 'child' && timeLeft > 0) {
            interval = setInterval(async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.put(`/api/children/${user._id}/screentime`, { minutes: 1 }, config);
                    setTimeLeft(data.screenTimeLimit - data.screenTimeUsed);
                } catch (error) {
                    console.error("Error updating screen time", error);
                }
            }, 60000); // 1 minute
        }
        return () => clearInterval(interval);
    }, [user, timeLeft]);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/media', config);
            setMediaList(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/media', formData, config);
            fetchMedia();
            setActiveTab('browse');
            setFormData({ title: '', url: '', category: 'Stories', minAge: 0, maxAge: 5 });
        } catch (error) {
            alert('Error adding media');
        }
    };

    const getYoutubeEmbed = (url) => {
        // Simple regex for youtube ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold flex items-center gap-3">
                    <span className="bg-primary/20 p-2 rounded-xl text-primary">📺</span>
                    Media Center
                </h2>
                {user.role === 'child' && timeLeft !== null && (
                    <div className={`px-5 py-2.5 rounded-xl font-bold shadow-sm border ${timeLeft <= 5 ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'}`}>
                        ⏳ Time Left: {timeLeft > 0 ? timeLeft : 0} mins
                    </div>
                )}
            </div>

            {user.role === 'child' && timeLeft !== null && timeLeft <= 0 ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 bg-card text-card-foreground rounded-3xl shadow-lg border border-red-500/30">
                    <div className="text-6xl mb-6">🛑</div>
                    <h3 className="text-4xl font-extrabold text-red-600 dark:text-red-400 mb-4">Screen Time's Up!</h3>
                    <p className="text-muted-foreground text-lg font-medium">You have reached your daily limit for media time. Go play outside!</p>
                </motion.div>
            ) : (
                <>
                    <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 custom-scrollbar border-b border-border">
                        <button
                            className={`px-5 py-3 font-bold transition-all border-b-2 ${activeTab === 'browse' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setActiveTab('browse')}
                        >
                            Browse Content
                        </button>
                        {user.role === 'parent' && (
                            <button
                                className={`px-5 py-3 font-bold transition-all border-b-2 ${activeTab === 'add' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setActiveTab('add')}
                            >
                                Add Content
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'browse' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {mediaList.length === 0 ? (
                                    <div className="col-span-full text-center p-16 bg-white/40 dark:bg-black/20 rounded-3xl border border-dashed border-primary/30">
                                        <span className="text-6xl mb-4 block animate-bounce">📦</span>
                                        <p className="text-primary font-bold text-xl">No media content found.</p>
                                        <p className="text-muted-foreground font-medium mt-2">Parents can add curated content from the 'Add Content' tab.</p>
                                    </div>
                                ) : mediaList.map(media => {
                                    const videoId = getYoutubeEmbed(media.url);
                                    return (
                                        <motion.div whileHover={{ y: -8, scale: 1.02 }} key={media._id} className="glass-panel rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                                            {videoId ? (
                                                <div className="relative pt-[56.25%] bg-black overflow-hidden">
                                                    <iframe
                                                        className="absolute top-0 left-0 w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title={media.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                                </div>
                                            ) : (
                                                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center font-bold text-primary/60">
                                                    <span className="text-4xl mb-2">🎥</span>
                                                    <span>No Preview Available</span>
                                                </div>
                                            )}
                                            <div className="p-6 flex flex-col flex-grow bg-white/40 dark:bg-black/20 backdrop-blur-sm border-t border-white/50 dark:border-white/5">
                                                <h3 className="font-extrabold text-xl mb-3 text-foreground line-clamp-2 leading-tight">{media.title}</h3>
                                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                                                    <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm">{media.category}</span>
                                                    <span className="text-xs font-bold text-secondary-foreground bg-secondary/30 dark:bg-secondary/10 border border-secondary/50 dark:border-secondary/20 px-3 py-1.5 rounded-lg shadow-sm">
                                                        Ages {media.ageRange?.min || 0}-{media.ageRange?.max || 99}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}

                        {activeTab === 'add' && (
                            <motion.form initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleSubmit} className="glass-panel p-6 md:p-10 rounded-3xl max-w-2xl mx-auto space-y-6">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary flex justify-center items-center gap-2">
                                        <span className="text-3xl text-primary">➕</span> Add New Content
                                    </h3>
                                    <p className="font-medium text-muted-foreground mt-2">Curate safe and fun YouTube videos for your kids.</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-muted-foreground pl-1">Video Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium text-lg" required placeholder="e.g. Learn Colors with Blippi" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-muted-foreground pl-1">YouTube URL</label>
                                    <input type="url" name="url" value={formData.url} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium text-primary" required placeholder="https://youtube.com/watch?v=..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-muted-foreground pl-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-bold text-primary text-lg cursor-pointer appearance-none">
                                        <option value="Stories">📚 Stories</option>
                                        <option value="Education">🧠 Education</option>
                                        <option value="Entertainment">🎪 Entertainment</option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-1.5">
                                        <label className="block text-sm font-bold text-muted-foreground pl-1">Min Age</label>
                                        <input type="number" min="0" name="minAge" value={formData.minAge} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium text-lg" />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <label className="block text-sm font-bold text-muted-foreground pl-1">Max Age</label>
                                        <input type="number" min="0" name="maxAge" value={formData.maxAge} onChange={handleInputChange} className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium text-lg" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full text-primary-foreground font-extrabold text-lg bg-gradient-to-r from-primary to-accent rounded-2xl px-6 py-4 mt-8 hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/50">
                                    Publish to Media Center ✨
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default MediaCenter;
