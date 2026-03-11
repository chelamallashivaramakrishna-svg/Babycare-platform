import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const SimonSays = ({ onWin, level = 1 }) => {
    const colors = [
        { c: 'bg-red-500 border-red-400', freq: 329.63 }, // E4
        { c: 'bg-blue-500 border-blue-400', freq: 440.00 }, // A4
        { c: 'bg-green-500 border-green-400', freq: 277.18 }, // C#4
        { c: 'bg-yellow-500 border-yellow-400', freq: 164.81 } // E3
    ];
    const [sequence, setSequence] = useState([]);
    const [playerTurn, setPlayerTurn] = useState(false);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [activeColor, setActiveColor] = useState(null);

    // Target sequence length increases with level (Lvl 1 = 3, Lvl 10 = 12)
    const targetLength = 2 + parseInt(level);
    // Speed increases with level
    const playDelay = Math.max(200, 800 - (parseInt(level) * 40));

    useEffect(() => {
        nextLevel([]);
    }, [level]);

    const playNode = (idx) => {
        soundManager.playTone(colors[idx].freq, 'sine', 0.2, 0.4);
    };

    const nextLevel = (currentSeq) => {
        setPlayerTurn(false);
        const newSeq = [...currentSeq, Math.floor(Math.random() * 4)];
        setSequence(newSeq);
        setPlayerIndex(0);

        let i = 0;
        const interval = setInterval(() => {
            if (i >= newSeq.length) {
                clearInterval(interval);
                setActiveColor(null);
                setPlayerTurn(true);
                return;
            }
            setActiveColor(newSeq[i]);
            playNode(newSeq[i]);
            setTimeout(() => setActiveColor(null), playDelay / 2);
            i++;
        }, playDelay);
    };

    const handleTap = (colorIndex) => {
        if (!playerTurn) return;

        if (colorIndex === sequence[playerIndex]) {
            setActiveColor(colorIndex);
            playNode(colorIndex);
            setTimeout(() => setActiveColor(null), 200);

            if (playerIndex + 1 === sequence.length) {
                if (sequence.length === targetLength) {
                    setPlayerTurn(false);
                    setTimeout(() => {
                        soundManager.playWin();
                        setSequence([]);
                        onWin(20 + parseInt(level) * 5);
                    }, 500);
                } else {
                    setTimeout(() => nextLevel(sequence), 1000);
                }
            } else {
                setPlayerIndex(playerIndex + 1);
            }
        } else {
            setActiveColor('wrong');
            soundManager.playLose();
            setTimeout(() => {
                setActiveColor(null);
                // Restart current level
                setSequence([]);
                setTimeout(() => nextLevel([]), 500);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-lg mx-auto py-8">
            <h3 className="text-3xl font-black mb-2 text-indigo-600 dark:text-indigo-400">Simon Says</h3>
            <p className="mb-12 font-bold text-muted-foreground text-center">Watch, listen, and repeat! (Target Sequence: {targetLength})</p>

            <div className="grid grid-cols-2 gap-4 w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-slate-800 p-4 rounded-full shadow-2xl relative overflow-hidden ring-8 ring-slate-700">
                {colors.map((colorObj, i) => {
                    const isActive = activeColor === i;
                    const isWrong = activeColor === 'wrong';

                    // Add distinct shapes by bordering the circle container
                    let borderRadius = '';
                    if (i === 0) borderRadius = 'tl-full';
                    if (i === 1) borderRadius = 'tr-full';
                    if (i === 2) borderRadius = 'bl-full';
                    if (i === 3) borderRadius = 'br-full';

                    return (
                        <motion.button
                            key={i}
                            whileHover={{ scale: playerTurn ? 1.02 : 1 }}
                            whileTap={{ scale: playerTurn ? 0.95 : 1 }}
                            onClick={() => handleTap(i)}
                            className={`w-full h-full rounded-${borderRadius} border-8 shadow-inner transition-all duration-[50ms]
                                ${isActive ? colorObj.c + ' brightness-150 scale-105 shadow-white/50 z-10' :
                                    isWrong ? 'bg-red-900 border-red-950' :
                                        colorObj.c + ' opacity-75'} 
                            `}
                        />
                    );
                })}

                {/* Center dial face */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-slate-900 rounded-full border-8 border-slate-700 flex items-center justify-center flex-col z-20 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
                    <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Level</span>
                    <span className={`text-4xl font-black ${playerTurn ? 'text-green-400' : 'text-slate-500'}`}>
                        {sequence.length > 0 ? sequence.length : '-'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SimonSays;
