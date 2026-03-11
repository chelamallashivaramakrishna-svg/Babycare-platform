import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimalMatch = ({ onWin }) => {
    const animals = [
        { emoji: '🐶', sound: 'Woof', name: 'Dog' },
        { emoji: '🐱', sound: 'Meow', name: 'Cat' },
        { emoji: '🐮', sound: 'Moo', name: 'Cow' },
        { emoji: '🦁', sound: 'Roar', name: 'Lion' },
        { emoji: '🐷', sound: 'Oink', name: 'Pig' },
        { emoji: '🐸', sound: 'Ribbit', name: 'Frog' },
        { emoji: '🐑', sound: 'Baa', name: 'Sheep' },
        { emoji: '🦆', sound: 'Quack', name: 'Duck' }
    ];

    const [target, setTarget] = useState(animals[0]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        startRound();
    }, []);

    const startRound = () => {
        // Pick a random animal
        const selected = animals[Math.floor(Math.random() * animals.length)];
        setTarget(selected);

        // Pick 3 wrong options
        const opts = [selected];
        while (opts.length < 4) {
            const wrong = animals[Math.floor(Math.random() * animals.length)];
            if (!opts.find(o => o.name === wrong.name)) {
                opts.push(wrong);
            }
        }
        setOptions(opts.sort(() => Math.random() - 0.5));
    };

    const handleGuess = (animal) => {
        if (animal.name === target.name) {
            onWin(15);
            startRound();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400">Animal Sounds 🐾</h3>
            <p className="mb-2 text-lg font-bold text-muted-foreground">Which animal says...</p>
            <div className="text-5xl font-black text-cyan-500 my-6 animate-pulse bg-cyan-100 dark:bg-cyan-900/40 px-8 py-4 rounded-3xl border-4 border-cyan-200 dark:border-cyan-800">
                "{target.sound}!"
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                {options.map((animal, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGuess(animal)}
                        className="bg-card border-4 border-cyan-100 dark:border-cyan-900/30 p-4 rounded-3xl text-6xl shadow-md flex items-center justify-center hover:border-cyan-400 transition-colors"
                    >
                        {animal.emoji}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default AnimalMatch;
