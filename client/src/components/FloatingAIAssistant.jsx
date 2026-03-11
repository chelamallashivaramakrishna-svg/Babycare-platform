import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Bot, X, Send, User as UserIcon, MessageSquareHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const FloatingAIAssistant = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Smart Assistant. Check out some suggested questions below or ask me anything!", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    // Hide the floating button on the main chat page or login/register pages
    if (location.pathname === '/chat' || location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/ai/chat', { question: userMessage.text }, config);

            const botMessage = { text: data.answer, isBot: true };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMsg = error.response?.data?.answer || "Sorry, I'm having trouble connecting right now. Please try again.";
            setMessages(prev => [...prev, { text: errorMsg, isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Popup Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-card text-card-foreground rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border flex flex-col"
                        style={{ height: '500px', maxHeight: '70vh' }}
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center shadow-md z-10">
                            <div className="flex items-center">
                                <Bot className="w-6 h-6 mr-2" />
                                <div>
                                    <h3 className="font-extrabold text-sm">Smart Assistant</h3>
                                    <p className="text-xs font-semibold opacity-90">AI-powered guidance</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-primary/80 p-1.5 rounded-full transition-colors flex items-center justify-center">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background custom-scrollbar">
                            {messages.map((msg, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={index}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`flex max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'} items-end`}>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 ${msg.isBot ? 'bg-primary/20 text-primary mr-2' : 'bg-muted text-muted-foreground ml-2'}`}>
                                            {msg.isBot ? <Bot size={14} /> : <UserIcon size={14} />}
                                        </div>
                                        <div className={`py-2 px-3.5 text-sm font-medium rounded-2xl shadow-sm overflow-hidden ${msg.isBot ? 'bg-card border text-card-foreground rounded-bl-sm prose prose-sm dark:prose-invert max-w-none' : 'bg-primary text-primary-foreground rounded-br-sm'}`}>
                                            {msg.isBot ? (
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center space-x-1.5 bg-card border py-2 px-3 text-card-foreground rounded-2xl rounded-bl-sm shadow-sm ml-9">
                                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}

                            {messages.length === 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-2 mt-4 ml-9"
                                >
                                    {(user?.role === 'Child' ? [
                                        "🎮 Tell me a joke!",
                                        "🦁 What sounds do lions make?",
                                        "🧩 Suggest a fun puzzle game!"
                                    ] : [
                                        "🌡️ What to do for a mild fever?",
                                        "🍼 How often should my newborn eat?",
                                        "📅 When is the next vaccination due?"
                                    ]).map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setInput(suggestion); }}
                                            className="text-xs bg-muted text-muted-foreground border border-border hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors py-1.5 px-3 rounded-full shadow-sm"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-card border-t flex items-center gap-2 z-10 transition-colors">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a question..."
                                className="flex-1 p-2.5 text-sm bg-background border text-foreground font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-md shrink-0 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:bg-primary/90 transition-colors flex items-center justify-center relative group"
                    title="Open AI Assistant"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-primary/30 z-0"
                    />
                    <MessageSquareHeart size={28} className="relative z-10" />
                </motion.button>
            )}
        </div>
    );
};

export default FloatingAIAssistant;
