import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NumberPop = ({ onWin }) => {
    const [numbers, setNumbers] = useState([]);
    const [currentExpected, setCurrentExpected] = useState(1);

    useEffect(() => {
        const nums = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        setNumbers(nums);
    }, []);

    const handlePop = (num) => {
        if (num === currentExpected) {
            setNumbers(numbers.filter(n => n !== num));
            setCurrentExpected(currentExpected + 1);
            if (currentExpected === 5) {
                setTimeout(() => onWin(15), 500); // 15 points
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Order Pop 📚</h3>
            <p className="mb-4 font-bold text-muted-foreground">Click the numbers in order (1 to 5)!</p>
            <div className="flex flex-wrap justify-center gap-4">
                <AnimatePresence>
                    {numbers.map(num => (
                        <motion.button
                            key={num}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePop(num)}
                            className="w-16 h-16 rounded-full bg-blue-500 text-white text-2xl font-bold shadow-lg flex items-center justify-center border-4 border-white/20"
                        >
                            {num}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NumberPop;
