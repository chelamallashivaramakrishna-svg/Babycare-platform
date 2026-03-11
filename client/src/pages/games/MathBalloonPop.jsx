import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MathBalloonPop = ({ onWin }) => {
    const [equation, setEquation] = useState({ q: '', a: 0 });
    const [options, setOptions] = useState([]);

    useEffect(() => {
        startRound();
    }, []);

    const startRound = () => {
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * 5) + 1;
        const answer = num1 + num2;
        setEquation({ q: `${num1} + ${num2} = ?`, a: answer });

        const opts = [answer];
        while (opts.length < 4) {
            const wrong = Math.floor(Math.random() * 10) + 1;
            if (!opts.includes(wrong)) opts.push(wrong);
        }
        setOptions(opts.sort(() => Math.random() - 0.5));
    };

    const handlePop = (num) => {
        if (num === equation.a) {
            onWin(15);
            startRound();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">Math Balloon Pop 🎈</h3>
            <p className="mb-6 font-bold text-3xl text-card-foreground">{equation.q}</p>
            <div className="flex gap-6 mt-8">
                {options.map((opt, i) => (
                    <motion.button
                        key={i}
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePop(opt)}
                        className="w-20 h-24 rounded-t-full rounded-b-[40%] bg-pink-500 flex flex-col items-center justify-center text-white text-3xl font-bold shadow-xl relative border-b-4 border-pink-700"
                    >
                        {opt}
                        <div className="absolute -bottom-6 w-1 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default MathBalloonPop;
