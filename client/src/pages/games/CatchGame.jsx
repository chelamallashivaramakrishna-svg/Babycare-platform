import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const CatchGame = ({ onWin, level = 1 }) => {
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);
    const [basketX, setBasketX] = useState(50); // percentage 0-100
    const containerRef = useRef(null);
    const requestRef = useRef();

    const targetScore = 15 + parseInt(level) * 5;

    // Difficulty logic
    const baseSpeedMs = Math.max(400, 1600 - parseInt(level) * 120);
    const fallDuration = Math.max(1.5, 4 - parseInt(level) * 0.25); // seconds
    const bombChance = Math.min(0.5, 0.1 + (parseInt(level) * 0.05));

    useEffect(() => {
        let mounted = true;
        const spawnItem = () => {
            if (!mounted) return;
            const isBad = Math.random() < bombChance;
            const emojiList = isBad ? ['💣', '🕷️', '🌵'] : ['🍎', '🍌', '🍓', '🥕', '🥦'];
            const newItem = {
                id: Date.now(),
                x: Math.random() * 80 + 10, // 10% to 90%
                y: 0, // 0 to 100
                emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
                isBad
            };
            setItems(prev => [...prev, newItem]);
            setTimeout(spawnItem, baseSpeedMs);
        };

        spawnItem();
        return () => mounted = false;
    }, [baseSpeedMs, bombChance]);

    // Handle collision detection loop
    const checkCollisions = () => {
        setItems(prev => {
            let processed = [...prev];
            const toRemove = new Set();

            // Move items down manually for collision tracking
            // 60fps, we want it to cross 100% in `fallDuration` seconds
            const stepY = 100 / (fallDuration * 60);

            for (let i = 0; i < processed.length; i++) {
                let item = processed[i];
                item.y += stepY;

                if (item.y >= 90 && item.y <= 100) {
                    // Check intersection with basket
                    // Basket is at basketX, width ~ 20%
                    if (Math.abs(item.x - basketX) < 15) {
                        toRemove.add(item.id);
                        if (item.isBad) {
                            soundManager.playLose();
                            setScore(s => Math.max(0, s - 3));
                        } else {
                            soundManager.playPop();
                            setScore(s => {
                                const ns = s + 1;
                                if (ns >= targetScore) {
                                    setTimeout(() => {
                                        soundManager.playWin();
                                        onWin(20 + parseInt(level) * 5);
                                    }, 100);
                                }
                                return ns;
                            });
                        }
                    }
                } else if (item.y > 110) {
                    toRemove.add(item.id);
                }
            }

            if (toRemove.size > 0) {
                return processed.filter(i => !toRemove.has(i.id));
            }
            return processed;
        });

        requestRef.current = requestAnimationFrame(checkCollisions);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(checkCollisions);
        return () => cancelAnimationFrame(requestRef.current);
    }, [basketX]); // Restart loop with current basketX

    const handlePointerMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        let clientX;
        if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
        else clientX = e.clientX;

        let xPos = ((clientX - rect.left) / rect.width) * 100;
        xPos = Math.max(5, Math.min(95, xPos));
        setBasketX(xPos);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto py-4">
            <div className="flex justify-between w-full mb-4 px-4 items-end">
                <div>
                    <h2 className="text-3xl font-black text-orange-500">Fruit Catcher</h2>
                    <p className="text-muted-foreground font-bold">Level {level} • Target: {targetScore}</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-orange-500">{score}</div>
                </div>
            </div>

            <div
                ref={containerRef}
                className="w-full h-[500px] relative overflow-hidden bg-gradient-to-b from-blue-200 to-blue-400 dark:from-blue-900 dark:to-blue-950 rounded-[3rem] border-8 border-blue-100 dark:border-blue-800 shadow-inner touch-none cursor-none"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerMove}
            >
                {/* Render falling items */}
                {items.map(item => (
                    <div
                        key={item.id}
                        className="absolute text-4xl sm:text-5xl -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                        }}
                    >
                        {item.emoji}
                    </div>
                ))}

                {/* Render Basket */}
                <div
                    className="absolute bottom-4 -translate-x-1/2 w-24 h-16 sm:w-32 sm:h-20 bg-orange-800 rounded-b-3xl border-t-8 border-orange-700 flex items-center justify-center text-4xl shadow-xl z-20"
                    style={{ left: `${basketX}%` }}
                >
                    <span className="opacity-50 drop-shadow-md">🧺</span>
                </div>

                {/* Foreground Grass Decoration */}
                <div className="absolute bottom-0 w-full h-8 bg-green-500 dark:bg-green-700 rounded-b-[2.5rem] flex divide-x divide-transparent gap-1 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-green-400 dark:bg-green-600 rounded-t-full transform -translate-y-2 opacity-30"></div>
                    ))}
                </div>
            </div>
            <p className="mt-6 text-muted-foreground font-bold">Drag or tap the screen to move the basket!</p>
        </div>
    );
};

export default CatchGame;
