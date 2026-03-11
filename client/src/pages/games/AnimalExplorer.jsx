import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const ALL_ANIMALS = [
    { id: 'dog', label: 'Dog', emoji: '🐶', diff: 1 },
    { id: 'cat', label: 'Cat', emoji: '🐱', diff: 1 },
    { id: 'cow', label: 'Cow', emoji: '🐮', diff: 1 },
    { id: 'pig', label: 'Pig', emoji: '🐷', diff: 2 },
    { id: 'duck', label: 'Duck', emoji: '🦆', diff: 2 },
    { id: 'sheep', label: 'Sheep', emoji: '🐑', diff: 2 },
    { id: 'horse', label: 'Horse', emoji: '🐴', diff: 3 },
    { id: 'lion', label: 'Lion', emoji: '🦁', diff: 3 },
    { id: 'monkey', label: 'Monkey', emoji: '🐒', diff: 4 },
    { id: 'bear', label: 'Bear', emoji: '🐻', diff: 4 },
    { id: 'frog', label: 'Frog', emoji: '🐸', diff: 5 },
    { id: 'snake', label: 'Snake', emoji: '🐍', diff: 5 },
    { id: 'elephant', label: 'Elephant', emoji: '🐘', diff: 6 },
    { id: 'tiger', label: 'Tiger', emoji: '🐯', diff: 7 },
    { id: 'mouse', label: 'Mouse', emoji: '🐭', diff: 7 }
];

const AnimalExplorer = ({ onWin, level = 1 }) => {
    const [options, setOptions] = useState([]);
    const [target, setTarget] = useState(null);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const targetScore = 5 + Math.floor(parseInt(level) / 2); // 5 to 10 rounds

    useEffect(() => {
        generateRound();
        // Cleanup speech synthesis on unmount
        return () => window.speechSynthesis.cancel();
    }, [level]);

    const generateRound = () => {
        const lvl = parseInt(level);

        // Number of options increases with level
        let numOptions = 2;
        if (lvl > 2) numOptions = 4;
        if (lvl > 5) numOptions = 6;
        if (lvl > 8) numOptions = 8;

        // Filter valid animals based loosely on level capability
        // (If level is high, include all. If low, include only lower diffs to keep it easy)
        const maxDiff = Math.max(3, lvl);
        const validAnimals = ALL_ANIMALS.filter(a => a.diff <= maxDiff);

        // Shuffle and pick
        const shuffled = [...validAnimals].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, numOptions);

        const targetAnimal = selected[Math.floor(Math.random() * selected.length)];

        setOptions(selected);
        setTarget(targetAnimal);

        // Auto-play the sound with a slight delay so component mounts first
        setTimeout(() => playAnimalSound(targetAnimal.id), 500);
    };

    const playAnimalSound = (animalId) => {
        setIsPlaying(true);
        soundManager.playAnimal(animalId);

        // Estimate speech duration or just show pulsing animation for 2 seconds
        setTimeout(() => setIsPlaying(false), 2000);
    };

    const handleAnswer = (animal) => {
        if (animal.id === target.id) {
            soundManager.playPop();
            const newScore = score + 1;
            setScore(newScore);

            if (newScore >= targetScore) {
                soundManager.playWin();
                onWin(20 + parseInt(level) * 5);
            } else {
                generateRound();
            }
        } else {
            soundManager.playLose();
            // Hint by saying it again
            playAnimalSound(target.id);
        }
    };

    if (!target) return <div>Loading...</div>;

    const gridCols = options.length <= 2 ? 'grid-cols-2' :
        options.length <= 4 ? 'grid-cols-2 md:grid-cols-4' :
            options.length <= 6 ? 'grid-cols-3' : 'grid-cols-4';

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto py-6">
            <h3 className="text-3xl font-black mb-2 text-green-600 dark:text-green-400">Animal Explorer</h3>
            <p className="mb-8 font-bold text-muted-foreground text-center">Score: {score} / {targetScore}</p>

            {/* Massive Play Button / Loudspeaker */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isPlaying ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={isPlaying ? { repeat: Infinity, duration: 0.5 } : {}}
                onClick={() => playAnimalSound(target.id)}
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-6xl shadow-xl border-8 mb-12 transition-colors cursor-pointer
                    ${isPlaying ? 'bg-green-100 border-green-500 shadow-[0_0_30px_rgba(74,222,128,0.6)]' : 'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}
            >
                🔊
            </motion.button>

            <AnimatePresence mode="popLayout">
                <div className={`grid ${gridCols} gap-4 md:gap-8 w-full px-4 justify-items-center`}>
                    {options.map((animal) => (
                        <motion.button
                            key={animal.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAnswer(animal)}
                            className="bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center w-full max-w-[150px] aspect-square transition-colors hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                            <span className="text-6xl md:text-7xl drop-shadow-md mb-2">{animal.emoji}</span>
                            <span className="font-bold text-slate-500 uppercase tracking-widest text-xs hidden sm:block">{animal.label}</span>
                        </motion.button>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
};

export default AnimalExplorer;
