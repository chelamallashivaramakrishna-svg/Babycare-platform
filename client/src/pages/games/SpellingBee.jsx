import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const WORDS = [
    // 3 letters (Lvl 1-2)
    { w: 'CAT', lvl: 1 }, { w: 'DOG', lvl: 1 }, { w: 'SUN', lvl: 1 }, { w: 'HAT', lvl: 1 }, { w: 'BED', lvl: 1 },
    // 4 letters (Lvl 3-4)
    { w: 'FISH', lvl: 3 }, { w: 'BIRD', lvl: 3 }, { w: 'STAR', lvl: 3 }, { w: 'MOON', lvl: 3 }, { w: 'TREE', lvl: 3 },
    // 5 letters (Lvl 5-6)
    { w: 'APPLE', lvl: 5 }, { w: 'WATER', lvl: 5 }, { w: 'TIGER', lvl: 5 }, { w: 'SMILE', lvl: 5 }, { w: 'TRAIN', lvl: 5 },
    // 6 letters (Lvl 7-8)
    { w: 'PLANET', lvl: 7 }, { w: 'MONKEY', lvl: 7 }, { w: 'CASTLE', lvl: 7 }, { w: 'GUITAR', lvl: 7 }, { w: 'FLOWER', lvl: 7 },
    // 7+ letters (Lvl 9-10)
    { w: 'ELEPHANT', lvl: 9 }, { w: 'DINOSAUR', lvl: 9 }, { w: 'UMBRELLA', lvl: 9 }, { w: 'ASTRONAUT', lvl: 9 }, { w: 'RAINBOW', lvl: 9 }
];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SpellingBee = ({ onWin, level = 1 }) => {
    const [targetWord, setTargetWord] = useState(null);
    const [spelled, setSpelled] = useState('');
    const [letters, setLetters] = useState([]);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const targetScore = 5 + Math.floor(parseInt(level) / 2);

    useEffect(() => {
        generateRound();
        return () => window.speechSynthesis.cancel();
    }, [level]);

    const playDictation = (word) => {
        setIsPlaying(true);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Spell... ${word}`);
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
    };

    const generateRound = () => {
        const lvl = parseInt(level);

        // Find valid words
        const validWords = WORDS.filter(w => w.lvl <= lvl);
        // Heavily weight harder words for higher levels
        const pool = validWords.length > 5 ? validWords.slice(-10) : validWords;
        const selected = pool[Math.floor(Math.random() * pool.length)].w;

        setTargetWord(selected);
        setSpelled('');

        // Generate scatter letters
        let chars = selected.split('');

        // Add decoys if level > 3
        if (lvl > 3) {
            const numDecoys = Math.floor(lvl / 2);
            for (let i = 0; i < numDecoys; i++) {
                chars.push(ALPHA[Math.floor(Math.random() * ALPHA.length)]);
            }
        }

        // Shuffle with random positions for floating effect
        const letterObj = chars.sort(() => Math.random() - 0.5).map((char, i) => ({
            id: i,
            char,
            x: Math.random() * 80 + 10, // 10% to 90%
            y: Math.random() * 60 + 20, // 20% to 80%
            delay: Math.random() * 2
        }));

        setLetters(letterObj);

        // Auto-play
        setTimeout(() => playDictation(selected.toLowerCase()), 500);
    };

    const handleTapLetter = (lObj) => {
        const expectedChar = targetWord[spelled.length];

        if (lObj.char === expectedChar) {
            soundManager.playPop();
            const newSpelled = spelled + lObj.char;
            setSpelled(newSpelled);

            // Remove letter from pool
            setLetters(prev => prev.filter(l => l.id !== lObj.id));

            if (newSpelled === targetWord) {
                // Round won
                soundManager.playWin();
                const newScore = score + 1;
                setScore(newScore);

                if (newScore >= targetScore) {
                    setTimeout(() => onWin(20 + parseInt(level) * 5), 1000);
                } else {
                    setTimeout(generateRound, 1500);
                }
            }
        } else {
            soundManager.playLose();
            // Jiggle effect or error?
            const updated = [...letters];
            const idx = updated.findIndex(l => l.id === lObj.id);
            if (idx !== -1) {
                updated[idx].error = true;
                setLetters(updated);
                setTimeout(() => {
                    setLetters(prev => prev.map(l => l.id === lObj.id ? { ...l, error: false } : l));
                }, 500);
            }
        }
    };

    if (!targetWord) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center w-full h-[600px] max-w-4xl mx-auto py-4 relative">
            <h3 className="text-3xl font-black mb-2 text-yellow-600 dark:text-yellow-400">Spelling Bee</h3>
            <p className="mb-4 font-bold text-muted-foreground">Score: {score} / {targetScore}</p>

            {/* Answer Slots */}
            <div className="flex gap-2 mb-8 bg-slate-100 dark:bg-slate-800 p-6 rounded-3xl shadow-inner border-4 border-slate-200 dark:border-slate-700">
                {targetWord.split('').map((char, i) => (
                    <div
                        key={i}
                        className={`w-12 h-16 md:w-16 md:h-20 border-b-8 flex items-end justify-center pb-2 text-4xl md:text-5xl font-black transition-colors ${i < spelled.length ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-slate-300 dark:border-slate-600 text-transparent'
                            }`}
                    >
                        {i < spelled.length ? char : '_'}
                    </div>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => playDictation(targetWord.toLowerCase())}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg shadow-lg mb-8 transition-colors ${isPlaying ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                    }`}
            >
                {isPlaying ? '🔊 Speaking...' : '🔁 Hear Word'}
            </motion.button>

            {/* Floating Letters Area */}
            <div className="relative w-full flex-1 border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-[3rem] overflow-hidden bg-white/50 dark:bg-slate-900/50">
                <AnimatePresence>
                    {letters.map((lObj) => (
                        <motion.button
                            key={lObj.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: [0, -15, 0],
                                x: [0, 10, -10, 0]
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                                scale: { duration: 0.3 },
                                opacity: { duration: 0.3 },
                                y: { repeat: Infinity, duration: 2 + lObj.delay, ease: "easeInOut" },
                                x: { repeat: Infinity, duration: 3 + lObj.delay, ease: "easeInOut" }
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleTapLetter(lObj)}
                            style={{ left: `${lObj.x}%`, top: `${lObj.y}%` }}
                            className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-5xl font-black shadow-xl border-4 cursor-pointer
                                ${lObj.error ? 'bg-red-500 border-red-700 text-white z-50 animate-shake' : 'bg-gradient-to-br from-yellow-300 to-amber-500 border-yellow-200 text-amber-900 hover:shadow-yellow-500/50'}`}
                        >
                            {lObj.char}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SpellingBee;
