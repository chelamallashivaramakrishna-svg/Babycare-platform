import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FamilyContext } from '../context/FamilyContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, PlayCircle, LifeBuoy, Users, PlusCircle, Calendar as CalendarIcon, Clock, LogOut, Edit } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const hoverVariants = {
    hover: { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.98 }
};

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { family, childrenList, createFamily, loading } = useContext(FamilyContext);
    const [familyName, setFamilyName] = useState('');
    const [todayActivities, setTodayActivities] = useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'doctor') {
            navigate('/doctor-dashboard');
        }
    }, [user, navigate]);

    React.useEffect(() => {
        const fetchSchedules = async () => {
            if (childrenList && childrenList.length > 0) {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    let allActivities = [];
                    for (let child of childrenList) {
                        try {
                            const { data } = await axios.get(`/api/schedule/${child._id}`, config);
                            if (data && data.activities) {
                                const mapped = data.activities.map(act => ({
                                    ...act,
                                    childName: child.name,
                                    childId: child._id
                                }));
                                allActivities = [...allActivities, ...mapped];
                            }
                        } catch (err) {
                            console.error(`Error fetching schedule for ${child.name}`, err);
                        }
                    }
                    setTodayActivities(allActivities);
                } catch (error) {
                    console.error("Error fetching schedules:", error);
                }
            }
        };
        if (user && user.role !== 'doctor') {
            fetchSchedules();
        }
    }, [childrenList, user]);

    const handleCreateFamily = async (e) => {
        e.preventDefault();
        await createFamily(familyName);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <motion.div
            className="p-4 md:p-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome back, {user?.name}! ✨</h1>
                    <p className="text-blue-100 mt-1 font-medium text-lg capitalize">{user?.role} Dashboard</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/media" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-semibold transition-all shadow-sm">
                        <PlayCircle size={18} /> Media
                    </Link>
                    <Link to="/support" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-semibold transition-all shadow-sm">
                        <LifeBuoy size={18} /> Support
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-xl font-semibold transition-all shadow-sm">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </motion.div>

            {/* Family Section */}
            {!family ? (
                <motion.div variants={itemVariants} className="bg-card text-card-foreground p-8 rounded-2xl shadow-lg border mb-8 border-l-4 border-l-primary">
                    <h2 className="text-2xl font-bold mb-2">Create Your Family Profile</h2>
                    <p className="text-muted-foreground mb-6">You need to set up a family profile to add children and manage records.</p>
                    <form onSubmit={handleCreateFamily} className="flex flex-col sm:flex-row gap-4 max-w-lg">
                        <input
                            type="text"
                            placeholder="e.g. The Smiths"
                            className="flex-1 bg-background border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            required
                        />
                        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md">
                            Create setup
                        </button>
                    </form>
                </motion.div>
            ) : (
                <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{family.name} Family</h2>
                                <span className="text-sm font-mono bg-muted text-muted-foreground px-2 py-1 rounded-md mt-1 inline-block">Invite Code: {family.inviteCode}</span>
                            </div>
                        </div>
                        <Link to="/add-child" className="mt-4 sm:mt-0 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
                            <PlusCircle size={20} /> Add Child
                        </Link>
                    </div>

                    <h3 className="font-bold text-lg mb-4 text-muted-foreground uppercase tracking-wider text-sm">Children Profiles</h3>
                    {childrenList.length === 0 ? (
                        <div className="text-center p-8 bg-muted/30 rounded-xl border border-dashed">
                            <p className="text-muted-foreground font-medium">No children profiles added yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {childrenList.map((child) => (
                                <motion.div
                                    key={child._id}
                                    variants={hoverVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="bg-background border p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                                    onClick={() => navigate(`/child/${child._id}/health`)}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-inner ${child.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'}`}>
                                            {child.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 relative">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/edit-child/${child._id}`); }}
                                                className="absolute -top-1 -right-1 p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit Profile"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <h4 className="font-extrabold text-xl pr-6 flex justify-between items-center">
                                                <span>{child.name}</span>
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <motion.span whileHover={{ scale: 1.1 }} className="text-xs font-bold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-yellow-200 dark:border-yellow-800/30">
                                                    ⭐ {child.stars || 0}
                                                </motion.span>
                                                <p className="text-xs font-semibold text-muted-foreground">{new Date(child.dob).toLocaleDateString()} • {child.gender}</p>
                                            </div>

                                            <div className="flex gap-2 mt-3">
                                                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md font-bold flex items-center gap-1" title="Brain Games">🧠 {child.gameScores?.brain || 0}</span>
                                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-bold flex items-center gap-1" title="Educational Games">📚 {child.gameScores?.educational || 0}</span>
                                                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-md font-bold flex items-center gap-1" title="Fun Games">🎨 {child.gameScores?.fun || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t flex justify-between items-center text-sm font-semibold text-primary">
                                        <span>View Health Records</span>
                                        <span className="bg-primary/10 p-1.5 rounded-full"><Activity size={14} /></span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* Quick Stats Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Activities Card */}
                <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-md border flex flex-col h-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-lg">
                            <CalendarIcon size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Today's Activities</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {todayActivities.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                                <CalendarIcon size={48} className="mb-2" />
                                <p>No activities scheduled</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {todayActivities.map((act, index) => (
                                    <div key={index} className="pl-4 border-l-2 border-orange-400 relative">
                                        <div className="absolute w-3 h-3 bg-orange-400 rounded-full -left-[7px] top-1.5 ring-4 ring-card"></div>
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-orange-600 dark:text-orange-400">{act.time}</span>
                                            <Link to={`/child/${act.childId}/schedule`} className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{act.childName}</Link>
                                        </div>
                                        <p className="font-semibold mt-1">{act.activity}</p>
                                        {act.notes && <p className="text-sm text-muted-foreground mt-0.5">{act.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Vaccinations Card */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-6 rounded-2xl shadow-md border border-indigo-100 dark:border-indigo-900/30 flex flex-col h-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-card-foreground">Vaccination Alerts</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {childrenList && childrenList.some(c => c.vaccinations?.some(v => v.status === 'pending')) ? (
                            <div className="space-y-4">
                                {childrenList.map(child => {
                                    const pendingVacs = child.vaccinations?.filter(v => v.status === 'pending') || [];
                                    if (pendingVacs.length === 0) return null;
                                    return (
                                        <div key={child._id} className="bg-white/60 dark:bg-black/20 p-4 rounded-xl shadow-sm border border-indigo-50 dark:border-indigo-900/20">
                                            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">{child.name}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {pendingVacs.map((v, i) => (
                                                    <span key={i} className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md">
                                                        {v.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-indigo-400/60">
                                <Activity size={48} className="mb-2" />
                                <p className="font-medium text-center">All up to date!<br />No pending vaccinations.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Screen Time Card */}
                <motion.div variants={itemVariants} className="bg-card text-card-foreground p-6 rounded-2xl shadow-md border flex flex-col h-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Screen Time Status</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {childrenList && childrenList.length > 0 ? (
                            childrenList.map(child => {
                                const used = child.screenTimeUsed || 0;
                                const limit = child.screenTimeLimit || 60;
                                const percentage = Math.min((used / limit) * 100, 100);
                                const isWarning = percentage > 80;

                                return (
                                    <div key={child._id} className="mt-2">
                                        <div className="flex justify-between text-sm font-bold mb-1">
                                            <span>{child.name}</span>
                                            <span className={isWarning ? 'text-red-500' : 'text-green-500'}>{used} / {limit} min</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full ${isWarning ? 'bg-red-500' : 'bg-green-500'}`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                                <Clock size={48} className="mb-2" />
                                <p>No usage data</p>
                            </div>
                        )}
                    </div>
                </motion.div>

            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
