import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const QuizGame = ({ onWin, level = 1 }) => {
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const questionsNeeded = 3 + parseInt(level);

    const generateQuestion = () => {
        const types = ['math', 'color', 'animal'];
        const type = types[Math.floor(Math.random() * types.length)];
        let q = '';
        let options = [];
        let answer = '';

        if (type === 'math') {
            const a = Math.floor(Math.random() * (5 + parseInt(level))) + 1;
            const b = Math.floor(Math.random() * (5 + parseInt(level))) + 1;
            q = `What is ${a} + ${b}?`;
            answer = (a + b).toString();
            options = [answer, (a + b + 1).toString(), (Math.abs(a - b)).toString(), (a + b + 2).toString()].sort(() => Math.random() - 0.5);
        } else if (type === 'color') {
            const colors = [
                { name: 'Red', hex: 'bg-red-500' }, { name: 'Blue', hex: 'bg-blue-500' },
                { name: 'Green', hex: 'bg-green-500' }, { name: 'Yellow', hex: 'bg-yellow-500' }
            ];
            const target = colors[Math.floor(Math.random() * colors.length)];
            q = `Which color is ${target.name}?`;
            answer = target.hex;
            options = colors.map(c => c.hex).sort(() => Math.random() - 0.5);
        } else {
            const animals = [
                { emoji: '🐶', name: 'Dog' }, { emoji: '🐱', name: 'Cat' },
                { emoji: '🐮', name: 'Cow' }, { emoji: '🐷', name: 'Pig' }
            ];
            const target = animals[Math.floor(Math.random() * animals.length)];
            q = `Find the ${target.name}!`;
            answer = target.emoji;
            options = animals.map(a => a.emoji).sort(() => Math.random() - 0.5);
        }

        setQuestion({ q, options, answer, type });
        setFeedback(null);
    };

    useEffect(() => {
        generateQuestion();
    }, [level]);

    const handleAnswer = (opt) => {
        if (opt === question.answer) {
            soundManager.playPop();
            setFeedback('✅ Correct!');
            setTimeout(() => {
                const newScore = score + 1;
                setScore(newScore);
                if (newScore >= questionsNeeded) {
                    onWin(15 + parseInt(level) * 5);
                } else {
                    generateQuestion();
                }
            }, 1000);
        } else {
            soundManager.playLose();
            setFeedback('❌ Try again!');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    if (!question) return null;

    return (
        <div className="flex flex-col items-center text-center w-full max-w-md">
            <h3 className="text-2xl font-bold mb-2 text-indigo-500">Brain Quiz 🧠</h3>
            <p className="mb-8 font-bold text-muted-foreground">Answer {questionsNeeded} questions to win! ({score}/{questionsNeeded})</p>

            <div className="bg-muted p-8 rounded-3xl w-full shadow-inner mb-8 min-h-[150px] flex flex-col justify-center relative">
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-3xl z-10 text-3xl font-black"
                        >
                            {feedback}
                        </motion.div>
                    )}
                </AnimatePresence>
                <h2 className="text-3xl font-black">{question.q}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                {question.options.map((opt, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (question.type === 'animal') {
                                const names = { '🐶': 'dog', '🐱': 'cat', '🐮': 'cow', '🐷': 'pig' };
                                soundManager.playAnimal(names[opt] || 'animal');
                            }
                            handleAnswer(opt);
                        }}
                        className={`h-24 text-4xl font-black rounded-2xl shadow-md flex items-center justify-center cursor-pointer transition-colors ${question.type === 'color' ? opt : 'bg-card border-2 hover:bg-muted'}`}
                    >
                        {question.type !== 'color' && opt}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default QuizGame;
