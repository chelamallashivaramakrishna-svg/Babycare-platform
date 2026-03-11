import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FamilyContext } from '../context/FamilyContext';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors mr-2"
        >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
    );
};

const Navbar = () => {
    const { user, logout, childLogin } = useContext(AuthContext);
    const { childrenList, family } = useContext(FamilyContext);
    const navigate = useNavigate();

    const handleSwitchChild = async (e) => {
        const selectedChildId = e.target.value;
        if (selectedChildId === user._id) return;

        const selectedChild = childrenList.find(c => c._id === selectedChildId);
        if (selectedChild) {
            const pin = window.prompt(`Enter PIN for ${selectedChild.name}:`);
            if (pin) {
                const res = await childLogin(family.inviteCode, pin, selectedChildId);
                if (res.success) {
                    navigate('/media'); // ensure child goes to appropriate portal
                    // Resets select back appropriately because the page reloads context and state
                } else {
                    alert(res.message || "Invalid PIN");
                    e.target.value = user._id; // revert selection
                }
            } else {
                e.target.value = user._id; // revert if cancelled
            }
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                            B
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            BabyCare
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {user ? (
                            <>
                                {user.role === 'child' && childrenList && childrenList.length > 0 ? (
                                    <div className="mr-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                                        <span className="text-sm font-bold text-primary">👋 Hey</span>
                                        <select
                                            value={user._id}
                                            onChange={handleSwitchChild}
                                            className="bg-transparent text-primary font-extrabold cursor-pointer focus:outline-none placeholder:text-primary appearance-none pr-4"
                                            style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234F46E5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.1em top 50%', backgroundSize: '0.65em auto' }}
                                        >
                                            {childrenList.map(child => (
                                                <option key={child._id} value={child._id} className="text-foreground">{child.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <span className="mr-4 px-4 py-1.5 rounded-full bg-secondary/30 dark:bg-secondary/10 border border-secondary/50 dark:border-secondary/20 text-sm font-bold text-secondary-foreground">
                                        Hello, {user.name}
                                    </span>
                                )}

                                {user.role === 'doctor' ? (
                                    <Link to="/doctor-dashboard" className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">Dashboard</Link>
                                ) : (
                                    <>
                                        {user.role !== 'child' && <Link to="/dashboard" className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">Dashboard</Link>}
                                        {user.role !== 'child' && <Link to="/book-appointment" className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">Book Appt.</Link>}
                                        {user.role !== 'child' && <Link to="/nutrition" className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">Nutrition</Link>}
                                        {user.role !== 'child' && <Link to="/chat" className="px-4 py-2 rounded-xl text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1">✨ AI Assistant</Link>}
                                        {user.role !== 'child' && <Link to="/schedule" className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">Schedule</Link>}
                                        {user.role === 'child' && (
                                            <Link to="/gamespace" className="px-4 py-2 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity shadow-md flex items-center gap-1">🎮 GameSpace</Link>
                                        )}
                                    </>
                                )}
                                <div className="h-6 w-px bg-border mx-2"></div>
                                <button onClick={logout} className="px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Logout</button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                                <Link to="/register" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-md">Join Now</Link>
                            </div>
                        )}

                        <div className="ml-2 pl-2 border-l border-border">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile menu button (Simplified for this update) */}
                    <div className="md:hidden flex items-center">
                        <ThemeToggle />
                        <button className="p-2 ml-2 rounded-lg bg-primary/10 text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
