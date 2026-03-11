import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Send, User as UserIcon, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Smart Parenting Assistant. Ask me anything about your child's health, sleep, or nutrition.", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

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
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        "What should I feed my 6 month old?",
        "My baby has a fever",
        "How much sleep does a newborn need?",
        "Vaccination schedule"
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-80px)] glass-panel max-w-4xl mx-auto rounded-2xl relative overflow-hidden my-4 border-0">
            {/* Header */}
            <div className="bg-primary p-4 md:p-5 text-primary-foreground flex items-center shadow-md">
                <Bot className="w-8 h-8 mr-3" />
                <div>
                    <h1 className="text-xl font-bold">Smart Parenting Assistant</h1>
                    <p className="text-sm font-medium opacity-90">AI-powered guidance for your child's care</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-background custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            key={index}
                            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'} items-end`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 mb-1 ${msg.isBot ? 'bg-primary/20 text-primary mr-2 md:mr-3' : 'bg-muted text-muted-foreground ml-2 md:ml-3'}`}>
                                    {msg.isBot ? <Bot size={20} /> : <UserIcon size={20} />}
                                </div>
                                <div className={`p-3 md:p-4 rounded-2xl shadow-sm text-sm md:text-base font-medium leading-relaxed ${msg.isBot ? 'bg-card border text-card-foreground rounded-bl-sm' : 'bg-primary text-primary-foreground rounded-br-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-center space-x-2 bg-card border p-4 rounded-2xl rounded-bl-none shadow-sm ml-10">
                            <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce"></div>
                            <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 md:p-5 bg-card border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3 font-bold">Suggested Questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(q)}
                                className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary/20 transition-all border border-primary/20"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 md:p-5 bg-card border-t border-border flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 p-3.5 bg-background border border-border text-foreground font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                    <Send size={22} />
                </button>
            </form>
        </motion.div>
    );
};

export default Chatbot;
