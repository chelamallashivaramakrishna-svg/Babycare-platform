import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const TapGame = ({ onWin, level = 1 }) => {
    const [score, setScore] = useState(0);
    const [targets, setTargets] = useState([]);

    const targetScore = 20 + parseInt(level) * 5;
    const spawnRate = Math.max(500, 1500 - parseInt(level) * 100);
    const disappearTime = Math.max(800, 2000 - parseInt(level) * 150);

    useEffect(() => {
        let mounted = true;
        const spawnTarget = () => {
            if (!mounted) return;
            const newTarget = {
                id: Date.now(),
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10,
                emoji: ['🎯', '🎈', '⭐', '🐞'][Math.floor(Math.random() * 4)]
            };
            setTargets(prev => [...prev, newTarget]);

            setTimeout(() => {
                if (mounted) {
                    setTargets(prev => prev.filter(t => t.id !== newTarget.id));
                }
            }, disappearTime);

            setTimeout(spawnTarget, spawnRate);
        };

        spawnTarget();
        return () => mounted = false;
    }, [spawnRate, disappearTime]);

    const handleTap = (id) => {
        soundManager.playPop();
        setTargets(prev => prev.filter(t => t.id !== id));
        const newScore = score + 1;
        setScore(newScore);
        if (newScore >= targetScore) {
            onWin(25 + parseInt(level) * 5);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg h-96 relative overflow-hidden bg-green-50 dark:bg-green-950 rounded-3xl border-4 border-green-200">
            <div className="absolute top-4 left-4 z-10 font-black text-2xl text-green-600">Score: {score}/{targetScore}</div>
            <h3 className="absolute top-4 right-4 z-10 text-xl font-bold text-green-400 opacity-50">Tap Fast!</h3>

            <AnimatePresence>
                {targets.map(target => (
                    <motion.div
                        key={target.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        style={{ left: `${target.x}%`, top: `${target.y}%` }}
                        onClick={() => handleTap(target.id)}
                        className="absolute text-5xl cursor-pointer hover:scale-110 active:scale-90 select-none pb-4"
                    >
                        {target.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TapGame;
