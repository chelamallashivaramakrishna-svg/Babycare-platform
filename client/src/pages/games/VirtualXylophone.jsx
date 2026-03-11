import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const playNote = (frequency, type = 'sine') => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1);
    } catch (e) {
        console.log("Audio not supported", e);
    }
};

const VirtualXylophone = ({ onWin }) => {
    const notes = [
        { note: 'C', freq: 261.63, color: 'bg-red-500' },
        { note: 'D', freq: 293.66, color: 'bg-orange-500' },
        { note: 'E', freq: 329.63, color: 'bg-yellow-400' },
        { note: 'F', freq: 349.23, color: 'bg-green-500' },
        { note: 'G', freq: 392.00, color: 'bg-blue-500' },
        { note: 'A', freq: 440.00, color: 'bg-indigo-500' },
        { note: 'B', freq: 493.88, color: 'bg-purple-500' },
        { note: 'C', freq: 523.25, color: 'bg-pink-500' }
    ];

    const [clicks, setClicks] = useState(0);

    const handleTap = (freq) => {
        playNote(freq, 'triangle');
        const newClicks = clicks + 1;
        setClicks(newClicks);
        if (newClicks >= 15) {
            onWin(10); // Reward free play after 15 taps
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Virtual Xylophone 🎵</h3>
            <p className="mb-8 font-bold text-muted-foreground text-center">Tap the bars to play music! (Play 15 notes to win)</p>

            <div className="flex items-end justify-center gap-2 md:gap-4 h-64 w-full max-w-lg mb-4">
                {notes.map((n, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, y: 10 }}
                        onClick={() => handleTap(n.freq)}
                        className={`w-10 sm:w-12 md:w-16 rounded-t-xl shadow-xl border-x-4 border-t-4 border-white/20 ${n.color}`}
                        style={{ height: `${100 - (i * 5)}%` }} // Decrease height for higher notes
                    >
                    </motion.button>
                ))}
            </div>
            <div className="w-full max-w-lg h-4 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner mb-6 relative">
                <div className="absolute w-full h-1 bg-gray-400 dark:bg-gray-600 top-1.5 rounded-full"></div>
            </div>
        </div>
    );
};

export default VirtualXylophone;
