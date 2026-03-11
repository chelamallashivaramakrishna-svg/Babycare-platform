import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DoctorLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            if (result.user.role === 'doctor') {
                navigate('/doctor-dashboard');
            } else {
                setError('Access denied. This portal is for doctors only.');
            }
        } else {
            setError(result.message || 'Invalid credentials. Please try again.');
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">

            {/* Animated Background Elements */}
            <motion.div variants={pulseVariants} animate="animate"
                className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 filter blur-[100px] pointer-events-none" />
            <motion.div variants={pulseVariants} animate="animate" style={{ animationDelay: '1.5s' }}
                className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 filter blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-6 gap-12 z-10">

                {/* Left Side — Branding Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hidden md:flex flex-col flex-1 max-w-lg text-white"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                            🏥
                        </div>
                        <div>
                            <div className="font-black text-xl text-white/90 tracking-tight">BabyCare</div>
                            <div className="text-xs font-bold text-blue-300/80 uppercase tracking-widest">Medical Portal</div>
                        </div>
                    </div>

                    <h1 className="text-5xl font-black leading-tight mb-5 tracking-tight">
                        Doctor's<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                            Command Center
                        </span>
                    </h1>
                    <p className="text-blue-200/80 text-lg font-medium leading-relaxed mb-10">
                        Access patient records, manage appointments, and add medical notes — all in one secure portal.
                    </p>

                    {/* Feature Cards */}
                    <div className="space-y-4">
                        {[
                            { icon: '📅', title: 'Appointment Management', desc: 'Confirm, reschedule or cancel bookings' },
                            { icon: '📋', title: 'Patient Health Charts', desc: 'Full medical history at your fingertips' },
                            { icon: '💊', title: 'Add Prescriptions', desc: 'Write notes directly to patient records' },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.15 }}
                                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4"
                            >
                                <span className="text-2xl">{f.icon}</span>
                                <div>
                                    <div className="font-bold text-white/90 text-sm">{f.title}</div>
                                    <div className="text-blue-300/70 text-xs font-medium">{f.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side — Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 md:p-10 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.5)]">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                animate={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="text-5xl mb-4 inline-block"
                            >
                                🩺
                            </motion.div>
                            <h2 className="text-3xl font-black text-white mb-2">Doctor Sign In</h2>
                            <p className="text-blue-200/70 font-medium text-sm">Authorized medical professionals only</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/20 border border-red-500/40 text-red-200 rounded-2xl px-5 py-4 text-sm font-bold mb-6 flex items-center gap-3"
                            >
                                <span className="text-lg">⚠️</span> {error}
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200/80 pl-1">
                                    Doctor Email ID
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">📧</span>
                                    <input
                                        type="email"
                                        id="doctor-email"
                                        placeholder="doctor@example.com"
                                        className="w-full pl-12 pr-5 py-4 bg-white/10 border border-white/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all font-medium placeholder:text-white/30"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-blue-200/80 pl-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔐</span>
                                    <input
                                        type="password"
                                        id="doctor-password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-5 py-4 bg-white/10 border border-white/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all font-medium placeholder:text-white/30"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    className="w-full py-4 font-extrabold text-white text-lg rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 transition-all shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)] shadow-cyan-500/40"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Verifying credentials...
                                        </span>
                                    ) : (
                                        'Access Portal →'
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-7">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-white/30 font-bold uppercase tracking-widest">Secure Access</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Footer Links */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-blue-200/60 font-medium">
                                Not a doctor?{' '}
                                <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Go to Parent Login
                                </Link>
                            </p>
                            <div className="flex items-center justify-center gap-2 text-xs text-white/25 font-bold">
                                <span>🔒</span> Protected by 256-bit encryption
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DoctorLogin;
