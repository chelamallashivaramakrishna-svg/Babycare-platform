import React from 'react';
import { motion } from 'framer-motion';

const ComingSoon = ({ onWin, level }) => {
    return (
        <div className="flex flex-col items-center text-center p-8">
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mb-6"
            >
                🚧
            </motion.div>
            <h3 className="text-4xl font-black mb-4 text-orange-500">Under Construction</h3>
            <p className="text-xl font-bold text-muted-foreground max-w-md">
                This game is currently being built by our dev team! Check back later to play level {level}.
            </p>
            <button
                onClick={() => onWin(5)}
                className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
                Claim 5 Free Points
            </button>
        </div>
    );
};

export default ComingSoon;
