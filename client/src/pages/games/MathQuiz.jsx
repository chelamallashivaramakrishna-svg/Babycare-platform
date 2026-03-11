import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const MathQuiz = ({ onWin, level = 1 }) => {
    const [question, setQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'

    const targetScore = 5 + Math.floor(parseInt(level) / 2); // 5 to 10 questions to win

    useEffect(() => {
        generateQuestion();
    }, [level]);

    const generateQuestion = () => {
        let num1, num2, operator, answer;
        const lvl = parseInt(level);

        // Level scaling
        if (lvl <= 2) {
            // Lvl 1-2: Simple addition
            const max = lvl === 1 ? 5 : 10;
            num1 = Math.floor(Math.random() * max) + 1;
            num2 = Math.floor(Math.random() * max) + 1;
            operator = '+';
            answer = num1 + num2;
        } else if (lvl <= 4) {
            // Lvl 3-4: Subtraction and Addition
            const max = lvl === 3 ? 10 : 20;
            num1 = Math.floor(Math.random() * max) + 1;
            num2 = Math.floor(Math.random() * max) + 1;
            if (Math.random() > 0.5) {
                // subtract (ensure num1 > num2)
                if (num1 < num2) [num1, num2] = [num2, num1];
                operator = '-';
                answer = num1 - num2;
            } else {
                operator = '+';
                answer = num1 + num2;
            }
        } else if (lvl <= 7) {
            // Lvl 5-7: Multiplication introduced
            if (Math.random() > 0.6) {
                const max = lvl <= 6 ? 5 : 10;
                num1 = Math.floor(Math.random() * max) + 1;
                num2 = Math.floor(Math.random() * max) + 1;
                operator = '×';
                answer = num1 * num2;
            } else {
                // fall back to addition/subtraction, but larger
                num1 = Math.floor(Math.random() * 30) + 10;
                num2 = Math.floor(Math.random() * 20) + 1;
                operator = Math.random() > 0.5 ? '+' : '-';
                if (operator === '-' && num1 < num2) [num1, num2] = [num2, num1];
                answer = operator === '+' ? num1 + num2 : num1 - num2;
            }
        } else {
            // Lvl 8-10: Division introduced
            const opChoice = Math.random();
            if (opChoice > 0.7) {
                // Division
                num2 = Math.floor(Math.random() * 10) + 1; // divisor
                answer = Math.floor(Math.random() * (lvl === 10 ? 12 : 10)) + 1; // quotient
                num1 = num2 * answer; // dividend
                operator = '÷';
            } else if (opChoice > 0.4) {
                // Multiplication
                num1 = Math.floor(Math.random() * 10) + 2;
                num2 = Math.floor(Math.random() * 10) + 2;
                operator = '×';
                answer = num1 * num2;
            } else {
                // Add/Sub
                num1 = Math.floor(Math.random() * 50) + 10;
                num2 = Math.floor(Math.random() * 50) + 10;
                operator = Math.random() > 0.5 ? '+' : '-';
                if (operator === '-' && num1 < num2) [num1, num2] = [num2, num1];
                answer = operator === '+' ? num1 + num2 : num1 - num2;
            }
        }

        // Generate options
        let options = new Set([answer]);
        while (options.size < 4) {
            // generate plausible wrong answers
            const offset = Math.floor(Math.random() * 10) - 5;
            let fake = answer + offset;
            if (fake === answer || fake < 0) fake = answer + Math.floor(Math.random() * 10) + 1;
            options.add(fake);
        }

        setQuestion({
            text: `${num1} ${operator} ${num2} = ?`,
            answer,
            options: Array.from(options).sort(() => Math.random() - 0.5)
        });
        setFeedback(null);
    };

    const handleAnswer = (opt) => {
        if (feedback) return; // prevent double clicking

        if (opt === question.answer) {
            soundManager.playPop();
            setFeedback('correct');
            setTimeout(() => {
                const newScore = score + 1;
                setScore(newScore);
                if (newScore >= targetScore) {
                    soundManager.playWin();
                    onWin(20 + parseInt(level) * 5);
                } else {
                    generateQuestion();
                }
            }, 800);
        } else {
            soundManager.playLose();
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    if (!question) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center max-w-2xl mx-auto py-8">
            <h3 className="text-3xl font-black mb-2 text-blue-600 dark:text-blue-400">Math Genius</h3>
            <p className="mb-8 font-bold text-muted-foreground text-center">Score: {score} / {targetScore}</p>

            <AnimatePresence mode="popLayout">
                <motion.div
                    key={question.text}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
                    className="w-full flex justify-center mb-12"
                >
                    <div className="bg-white dark:bg-slate-800 px-12 py-8 rounded-[3rem] shadow-xl border-8 border-blue-100 dark:border-blue-900/40">
                        <h2 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-wider">
                            {question.text}
                        </h2>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full px-4">
                {question.options.map((opt, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(opt)}
                        disabled={!!feedback}
                        className={`h-24 md:h-32 text-4xl md:text-5xl font-black rounded-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] transition-colors border-4 
                            ${feedback === 'correct' && opt === question.answer ? 'bg-green-500 border-green-400 text-white shadow-green-700/50' :
                                feedback === 'wrong' && opt !== question.answer ? 'bg-red-200 border-red-300 text-red-400 dark:bg-red-900/30' :
                                    'bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-300 hover:from-blue-300 hover:to-blue-500 shadow-blue-800'}`}
                    >
                        {opt}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {feedback === 'wrong' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-10 bg-red-500 text-white font-bold px-6 py-3 rounded-full shadow-lg"
                    >
                        Oops! Try again.
                    </motion.div>
                )}
                {feedback === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl"
                    >
                        ⭐
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MathQuiz;
