import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

// Base Datasets
const COLORS = [
    { label: 'Red', val: 'bg-red-500' }, { label: 'Blue', val: 'bg-blue-500' },
    { label: 'Green', val: 'bg-green-500' }, { label: 'Yellow', val: 'bg-yellow-400' },
    { label: 'Purple', val: 'bg-purple-500' }, { label: 'Orange', val: 'bg-orange-500' },
    { label: 'Pink', val: 'bg-pink-500' }, { label: 'Black', val: 'bg-black' },
    { label: 'White', val: 'bg-white border-2 border-gray-300' }, { label: 'Brown', val: 'bg-[#8B4513]' }
];

const COUNTRIES = [
    { label: 'United States', flag: '🇺🇸', capital: 'Washington, D.C.' },
    { label: 'United Kingdom', flag: '🇬🇧', capital: 'London' },
    { label: 'Canada', flag: '🇨🇦', capital: 'Ottawa' },
    { label: 'Australia', flag: '🇦🇺', capital: 'Canberra' },
    { label: 'Japan', flag: '🇯🇵', capital: 'Tokyo' },
    { label: 'Germany', flag: '🇩🇪', capital: 'Berlin' },
    { label: 'France', flag: '🇫🇷', capital: 'Paris' },
    { label: 'India', flag: '🇮🇳', capital: 'New Delhi' },
    { label: 'Brazil', flag: '🇧🇷', capital: 'Brasília' },
    { label: 'Mexico', flag: '🇲🇽', capital: 'Mexico City' },
    { label: 'China', flag: '🇨🇳', capital: 'Beijing' },
    { label: 'Italy', flag: '🇮🇹', capital: 'Rome' },
    { label: 'Spain', flag: '🇪🇸', capital: 'Madrid' },
    { label: 'South Africa', flag: '🇿🇦', capital: 'Pretoria' },
    { label: 'Egypt', flag: '🇪🇬', capital: 'Cairo' }
];

const WorldQuiz = ({ onWin, level = 1 }) => {
    const [question, setQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState(null); // 'correct', 'wrong'

    const targetScore = 5 + Math.floor(parseInt(level) / 2); // 5 to 10 rounds

    useEffect(() => {
        generateRound();
    }, [level]);

    const generateRound = () => {
        const lvl = parseInt(level);
        let qType = 'color'; // color, flag, capital

        // Difficulty scaling
        if (lvl <= 3) {
            qType = 'color';
        } else if (lvl <= 6) {
            qType = Math.random() > 0.3 ? 'flag' : 'color';
        } else {
            const r = Math.random();
            if (r > 0.6) qType = 'capital';
            else if (r > 0.2) qType = 'flag';
            else qType = 'color';
        }

        let targetObj, optionsArr;
        let promptText = "";

        if (qType === 'color') {
            const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
            optionsArr = shuffled.slice(0, 4);
            targetObj = optionsArr[Math.floor(Math.random() * 4)];
            promptText = `Find the color ${targetObj.label}`;

            setQuestion({
                type: 'color',
                text: promptText,
                target: targetObj,
                options: optionsArr
            });
        }
        else if (qType === 'flag') {
            const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5);
            optionsArr = shuffled.slice(0, 4);
            targetObj = optionsArr[Math.floor(Math.random() * 4)];
            promptText = `Which flag is ${targetObj.label}?`;

            setQuestion({
                type: 'flag',
                text: promptText,
                target: targetObj,
                options: optionsArr
            });
        }
        else if (qType === 'capital') {
            const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5);
            optionsArr = shuffled.slice(0, 4);
            targetObj = optionsArr[Math.floor(Math.random() * 4)];
            promptText = `What is the capital of ${targetObj.label}?`;

            setQuestion({
                type: 'capital',
                text: promptText,
                target: targetObj,
                options: optionsArr
            });
        }

        setStatus(null);
    };

    const handleAnswer = (opt) => {
        if (status) return;

        let isCorrect = false;
        if (question.type === 'color' && opt.label === question.target.label) isCorrect = true;
        if (question.type === 'flag' && opt.label === question.target.label) isCorrect = true;
        if (question.type === 'capital' && opt.capital === question.target.capital) isCorrect = true;

        if (isCorrect) {
            soundManager.playPop();
            setStatus('correct');
            setTimeout(() => {
                const newScore = score + 1;
                setScore(newScore);
                if (newScore >= targetScore) {
                    soundManager.playWin();
                    onWin(20 + parseInt(level) * 5);
                } else {
                    generateRound();
                }
            }, 800);
        } else {
            soundManager.playLose();
            setStatus('wrong');
            setTimeout(() => setStatus(null), 1000);
        }
    };

    if (!question) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center max-w-2xl mx-auto py-8">
            <h3 className="text-3xl font-black mb-2 text-yellow-600 dark:text-yellow-400">World Safari</h3>
            <p className="mb-8 font-bold text-muted-foreground text-center">Score: {score} / {targetScore}</p>

            <AnimatePresence mode="popLayout">
                <motion.div
                    key={question.text}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    className="w-full flex justify-center mb-8 px-4 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
                        {question.text}
                        {question.type === 'capital' && <span className="block text-6xl mt-4">{question.target.flag}</span>}
                    </h2>
                </motion.div>
            </AnimatePresence>

            <div className={`grid grid-cols-2 gap-4 w-full px-4 ${question.type === 'capital' ? 'gap-y-6' : ''}`}>
                {question.options.map((opt, i) => {
                    let content;
                    let bgClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                    let textClass = 'text-slate-800 dark:text-white text-3xl md:text-5xl';

                    if (question.type === 'color') {
                        content = '';
                        bgClass = opt.val;
                    } else if (question.type === 'flag') {
                        content = opt.flag;
                        textClass = 'text-7xl md:text-8xl';
                    } else if (question.type === 'capital') {
                        content = opt.capital;
                        textClass = 'text-2xl md:text-3xl font-bold p-4';
                        bgClass = 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 text-white shadow-yellow-900/20';
                        // override text wrapper
                        textClass = 'text-xl md:text-3xl font-black text-white';
                    }

                    // Status highlighting
                    const isTarget = opt === question.target;
                    if (status === 'correct' && isTarget) {
                        bgClass += ' ring-8 ring-green-400 scale-105 z-10';
                    } else if (status === 'wrong' && !isTarget) { // simplistic wrong logic
                        bgClass += ' opacity-50 grayscale';
                    }

                    return (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(opt)}
                            disabled={!!status}
                            className={`h-32 md:h-40 rounded-3xl shadow-xl transition-all border-4 flex items-center justify-center cursor-pointer relative overflow-hidden ${bgClass}`}
                        >
                            <span className={textClass}>{content}</span>
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {status === 'wrong' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-10 bg-red-500 text-white font-bold px-6 py-3 rounded-full shadow-lg"
                    >
                        Keep looking!
                    </motion.div>
                )}
                {status === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl z-50 drop-shadow-2xl"
                    >
                        🌍
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WorldQuiz;
