import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const MemoryMatch = ({ onWin, level = 1 }) => {
    // 15 distinct emojis for up to 15 pairs
    const emojis = ['🎈', '⭐', '🚀', '🚗', '🐱', '🍕', '⚽', '🎸', '🍎', '🤖', '👑', '🌈', '🍦', '💎', '🎨'];
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);

    useEffect(() => {
        // dynamic pairs based on level: Lvl 1 = 3 pairs (6 cards), Lvl 10 = 12 pairs (24 cards)
        const numPairs = Math.min(2 + parseInt(level), 15);
        const selectedEmojis = emojis.slice(0, numPairs);
        const deck = [...selectedEmojis, ...selectedEmojis];
        setCards(deck.sort(() => Math.random() - 0.5));
        setFlipped([]);
        setSolved([]);
    }, [level]);

    const handleFlip = (index) => {
        if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;

        soundManager.playPop(); // small click
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
                // Match!
                setTimeout(() => soundManager.playTone(600, 'sine', 0.1, 0.3), 200);
                setSolved([...solved, ...newFlipped]);
                setFlipped([]);
                if (solved.length + 2 === cards.length) {
                    soundManager.playWin();
                    setTimeout(() => onWin(20 + parseInt(level) * 5), 800);
                }
            } else {
                // No match
                setTimeout(() => soundManager.playLose(), 300);
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    // Calculate grid columns dynamically to keep it looking nice
    const numCards = cards.length;
    let gridCols = 'grid-cols-4';
    if (numCards <= 6) gridCols = 'grid-cols-3';
    else if (numCards <= 12) gridCols = 'grid-cols-4';
    else if (numCards <= 20) gridCols = 'grid-cols-5';
    else gridCols = 'grid-cols-6';

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-4">
            <h3 className="text-3xl font-black mb-2 text-purple-600 dark:text-purple-400">Memory Match Pro</h3>
            <p className="mb-6 font-bold text-muted-foreground">Level {level} • Find the matching pairs!</p>

            <div className={`grid ${gridCols} gap-2 md:gap-4 w-full justify-items-center`}>
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || solved.includes(index);
                    const isSolved = solved.includes(index);
                    return (
                        <motion.div
                            key={index}
                            whileHover={!isFlipped ? { scale: 1.05 } : {}}
                            whileTap={!isFlipped ? { scale: 0.95 } : {}}
                            onClick={() => handleFlip(index)}
                            className={`w-[70px] h-[70px] sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center text-3xl md:text-5xl rounded-2xl cursor-pointer shadow-lg transition-all border-4 
                                ${isSolved ? 'bg-green-100 border-green-300 dark:bg-green-900/40 dark:border-green-800' :
                                    isFlipped ? 'bg-white border-purple-200 dark:bg-gray-800 dark:border-purple-800' :
                                        'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300 dark:border-purple-500 text-transparent'}`}
                        >
                            <AnimatePresence>
                                {isFlipped && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                        {card}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default MemoryMatch;
