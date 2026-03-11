import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('parent');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register({ name, email, password, role });
        if (result.success) {
            if (result.user.role === 'doctor') {
                navigate('/doctor-dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 relative overflow-hidden flex-row-reverse">
            {/* Background Animated Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] right-[20%] w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Split Layout Container */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center justify-center p-4 z-10 gap-12">

                {/* Right Side Branding (Hidden on small screens) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:flex flex-col flex-1 pl-12 text-foreground"
                >
                    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl animate-float" style={{ animationDelay: '-3s' }}>
                        <div className="text-6xl mb-6">🌱</div>
                        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
                            Start Your Journey <br />with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">BabyCare</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
                            Create a secure digital space for your family. Monitor growth, track vaccinations, schedule activities, and curate educational fun.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 dark:bg-black/30 p-4 rounded-2xl border border-white/30 dark:border-white/5">
                                <span className="text-2xl mb-2 block">🔒</span>
                                <h4 className="font-bold">Secure</h4>
                            </div>
                            <div className="bg-white/50 dark:bg-black/30 p-4 rounded-2xl border border-white/30 dark:border-white/5">
                                <span className="text-2xl mb-2 block">📊</span>
                                <h4 className="font-bold">Insightful</h4>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Left Side Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-panel p-8 md:p-10 rounded-3xl">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-extrabold mb-2">Create Account</h3>
                            <p className="text-muted-foreground font-medium">Join our community today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-muted-foreground pl-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-5 py-3.5 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-muted-foreground pl-1" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="hello@family.com"
                                    className="w-full px-5 py-3.5 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-muted-foreground pl-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="w-full px-5 py-3.5 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-muted-foreground pl-1">Account Role</label>
                                <select
                                    className="w-full px-5 py-3.5 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-bold text-primary"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="parent">Parent</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="support">Support Agent</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button className="w-full px-6 py-4 text-primary-foreground font-extrabold text-lg bg-gradient-to-r from-primary to-accent rounded-2xl hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/50">
                                    Join BabyCare ✨
                                </button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
                            Already have an account? <a href="/login" className="font-bold text-primary hover:text-accent transition-colors">Sign In</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
