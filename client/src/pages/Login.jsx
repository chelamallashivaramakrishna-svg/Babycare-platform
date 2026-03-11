import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [pin, setPin] = useState('');
    const [isChildLogin, setIsChildLogin] = useState(false);
    const { login, childLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;
        if (isChildLogin) {
            result = await childLogin(inviteCode, pin);
        } else {
            result = await login(email, password);
        }

        if (result.success) {
            if (result.user.role === 'doctor') {
                navigate('/doctor-dashboard');
            } else if (result.user.role === 'child') {
                navigate('/media');
            } else {
                navigate('/dashboard');
            }
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
            {/* Background Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            {/* Split Layout Container */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 z-10">

                {/* Left Side Branding (Hidden on small screens) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:flex flex-col flex-1 pr-12 text-foreground"
                >
                    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl animate-float">
                        <div className="text-6xl mb-6">🎈</div>
                        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
                            Welcome to <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">BabyCare</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
                            The all-in-one modern platform for managing your child's health, activities, and digital well-being in a secure environment.
                        </p>

                        <div className="flex gap-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-white dark:border-slate-800 z-30"></div>
                                <div className="w-10 h-10 rounded-full bg-pink-300 border-2 border-white dark:border-slate-800 z-20"></div>
                                <div className="w-10 h-10 rounded-full bg-yellow-300 border-2 border-white dark:border-slate-800 z-10"></div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex text-yellow-500 text-sm">★★★★★</div>
                                <p className="text-xs font-bold text-muted-foreground">Trusted by families worldwide</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-panel p-8 md:p-10 rounded-3xl">
                        <div className="flex justify-center mb-8 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl backdrop-blur-md">
                            <button
                                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${!isChildLogin ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setIsChildLogin(false)}
                            >
                                Parent
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${isChildLogin ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => setIsChildLogin(true)}
                            >
                                Child Mode
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-extrabold mb-2">{isChildLogin ? 'Welcome, Kiddo! 🚀' : 'Sign In'}</h3>
                            <p className="text-muted-foreground font-medium">{isChildLogin ? 'Enter your secret pin to play' : 'Access your family dashboard'}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isChildLogin ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-muted-foreground pl-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="hello@family.com"
                                            className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium placeholder:text-muted-foreground/50"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5 pt-2">
                                        <div className="flex justify-between items-center pr-1">
                                            <label className="text-sm font-bold text-muted-foreground pl-1">Password</label>
                                            <a href="#" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Forgot?</a>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-medium placeholder:text-muted-foreground/50"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-muted-foreground pl-1">Family Invite Code</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. ABCDEF"
                                            className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-bold text-center uppercase tracking-widest text-lg placeholder:text-muted-foreground/40"
                                            value={inviteCode}
                                            onChange={(e) => setInviteCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5 pt-2">
                                        <label className="text-sm font-bold text-muted-foreground pl-1 flex items-center justify-center gap-2"><span className="text-lg">🔒</span> Secret PIN</label>
                                        <input
                                            type="password"
                                            placeholder="1234"
                                            maxLength="4"
                                            className="w-full px-5 py-4 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/40 transition-all font-extrabold text-center tracking-[0.5em] text-3xl placeholder:text-muted-foreground/30 placeholder:tracking-normal placeholder:font-medium placeholder:text-lg"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            required
                                            inputMode="numeric"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="pt-6">
                                <button className="w-full px-6 py-4 text-primary-foreground font-extrabold text-lg bg-gradient-to-r from-primary to-accent rounded-2xl hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/50">
                                    {isChildLogin ? "Let's Play! 🎯" : "Sign In ✨"}
                                </button>
                            </div>
                        </form>

                        {!isChildLogin && (
                            <>
                                <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
                                    Don't have an account? <a href="/register" className="font-bold text-primary hover:text-accent transition-colors">Join BabyCare</a>
                                </p>
                                <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
                                    Are you a doctor? <a href="/doctor-login" className="font-bold text-blue-500 hover:text-blue-600 transition-colors">🩺 Doctor Portal</a>
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
