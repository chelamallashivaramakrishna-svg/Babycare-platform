import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ColorSplash = ({ onWin }) => {
    const colors = [
        { name: 'Red', hex: '#ef4444' },
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Green', hex: '#22c55e' },
        { name: 'Yellow', hex: '#eab308' }
    ];

    // Pick a random target color
    const [targetColor, setTargetColor] = useState(colors[0]);
    // Display names randomly
    const [displayOptions, setDisplayOptions] = useState([]);

    useEffect(() => {
        startRound();
    }, []);

    const startRound = () => {
        const target = colors[Math.floor(Math.random() * colors.length)];
        setTargetColor(target);
        setDisplayOptions([...colors].sort(() => Math.random() - 0.5));
    };

    const handleGuess = (color) => {
        if (color.name === targetColor.name) {
            onWin(10); // 10 points
            startRound(); // Restart immediately or user can leave
        } else {
            // Wrong guess animation could be added here
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Color Splash 🎨</h3>
            <p className="mb-6 font-bold text-muted-foreground text-center">Click the button that matches this color:</p>

            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 rounded-2xl shadow-xl mb-8 border-4 border-card"
                style={{ backgroundColor: targetColor.hex }}
            />

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                {displayOptions.map(color => (
                    <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGuess(color)}
                        className="py-3 px-6 rounded-xl font-bold text-white shadow-md transition-colors"
                        style={{ backgroundColor: color.hex }}
                    >
                        {color.name}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};


export default ColorSplash;
