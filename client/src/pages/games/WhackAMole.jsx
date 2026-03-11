import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WhackAMole = ({ onWin, level = 1 }) => {
    const moles = Array(9).fill(false);
    const [score, setScore] = useState(0);
    const [activeMole, setActiveMole] = useState(null);

    // Speed increases based on level. Higher level = smaller numbers = faster popup + faster hide
    const speedMultiplier = parseInt(level) * 30; // 30ms faster per level
    const targetScore = 5 + parseInt(level) * 2; // +2 moles to win per level

    useEffect(() => {
        let mounted = true;
        let timer;
        const popMole = () => {
            if (!mounted) return;
            const randomHole = Math.floor(Math.random() * 9);
            setActiveMole(randomHole);
            timer = setTimeout(() => {
                setActiveMole(null);
                if (mounted) setTimeout(popMole, Math.max(200, Math.random() * 300 + 400 - speedMultiplier));
            }, Math.max(400, Math.random() * 300 + 600 - speedMultiplier));
        };
        setTimeout(popMole, 500);
        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [speedMultiplier]);

    const handleWhack = (index) => {
        if (index === activeMole) {
            setActiveMole(null);
            const newScore = score + 1;
            setScore(newScore);
            if (newScore >= targetScore) {
                onWin(10 + parseInt(level) * 5);
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Whack-A-Mole 🔨</h3>
            <p className="mb-6 font-bold text-muted-foreground text-center">Whack {targetScore} moles to win!</p>

            <div className="grid grid-cols-3 gap-4 w-full max-w-sm p-4 bg-green-500 dark:bg-emerald-800 border-8 border-green-600 rounded-3xl shrink-0">
                {moles.map((_, i) => (
                    <div key={i} className="bg-green-800 dark:bg-emerald-950 rounded-full h-20 w-20 flex items-center justify-center overflow-hidden relative shadow-inner mx-auto">
                        <AnimatePresence>
                            {activeMole === i && (
                                <motion.div
                                    initial={{ y: 50 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 50 }}
                                    onClick={() => handleWhack(i)}
                                    className="cursor-pointer text-5xl absolute pb-2"
                                >
                                    🐹
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
            <div className="mt-6 font-bold text-2xl text-card-foreground">Score: {score}/{targetScore}</div>
        </div>
    );
};

export default WhackAMole;
