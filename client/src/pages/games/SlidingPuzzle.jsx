import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LEVEL_SIZES = [3, 3, 4, 4, 4, 5, 5, 5, 6, 6]; // grid size per level

const createSolvedBoard = (size) =>
    Array.from({ length: size * size }, (_, i) => (i === size * size - 1 ? 0 : i + 1));

const shuffleBoard = (solved, moves = 200) => {
    const size = Math.round(Math.sqrt(solved.length));
    let board = [...solved];
    const dirs = [-1, 1, -size, size];

    for (let i = 0; i < moves; i++) {
        const blank = board.indexOf(0);
        const validMoves = dirs.map(d => blank + d).filter(n => {
            if (n < 0 || n >= board.length) return false;
            if (dirs[0] === blank - n && blank % size === 0) return false;
            if (dirs[1] === n - blank && blank % size === size - 1) return false;
            return true;
        });
        const pick = validMoves[Math.floor(Math.random() * validMoves.length)];
        [board[blank], board[pick]] = [board[pick], board[blank]];
    }
    return board;
};

const SlidingPuzzle = ({ onWin, level }) => {
    const size = LEVEL_SIZES[Math.min(level - 1, LEVEL_SIZES.length - 1)];
    const [board, setBoard] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);
    const [won, setWon] = useState(false);
    const [shake, setShake] = useState(null);

    const init = useCallback(() => {
        const s = createSolvedBoard(size);
        const b = shuffleBoard(s, 150 + level * 20);
        setSolved(s);
        setBoard(b);
        setMoves(0);
        setWon(false);
    }, [size, level]);

    useEffect(() => { init(); }, [init]);

    const isSolved = (b, s) => b.every((v, i) => v === s[i]);

    const handleTile = (idx) => {
        if (won) return;
        const blank = board.indexOf(0);
        const validNeighbors = [idx - 1, idx + 1, idx - size, idx + size];
        const colOk = Math.abs((idx % size) - (blank % size)) + Math.abs(Math.floor(idx / size) - Math.floor(blank / size)) === 1;

        if (validNeighbors.includes(blank) && colOk) {
            const newBoard = [...board];
            [newBoard[blank], newBoard[idx]] = [newBoard[idx], newBoard[blank]];
            setBoard(newBoard);
            setMoves(m => m + 1);
            if (isSolved(newBoard, solved)) {
                setWon(true);
                setTimeout(() => onWin(150 + level * 15), 800);
            }
        } else {
            setShake(idx);
            setTimeout(() => setShake(null), 300);
        }
    };

    const cellSize = size <= 4 ? 80 : size <= 5 ? 64 : 56;

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex items-center gap-8 text-sm font-bold text-muted-foreground">
                <span>🧩 Level {level} — {size}×{size} Puzzle</span>
                <span>🔀 Moves: {moves}</span>
            </div>

            <div
                className="relative grid gap-1.5 p-3 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-3xl shadow-xl border border-violet-200 dark:border-violet-800"
                style={{ gridTemplateColumns: `repeat(${size}, ${cellSize}px)` }}
            >
                {board.map((val, idx) => (
                    <AnimatePresence key={val} mode="popLayout">
                        {val === 0 ? (
                            <div
                                key="blank"
                                style={{ width: cellSize, height: cellSize }}
                                className="rounded-2xl bg-white/20 border-2 border-dashed border-violet-300 dark:border-violet-700"
                            />
                        ) : (
                            <motion.button
                                key={val}
                                layout
                                layoutId={String(val)}
                                onClick={() => handleTile(idx)}
                                animate={shake === idx ? { x: [-6, 6, -6, 6, 0] } : {}}
                                transition={shake === idx ? { duration: 0.3 } : { type: 'spring', stiffness: 400, damping: 30 }}
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.93 }}
                                style={{ width: cellSize, height: cellSize, fontSize: cellSize > 64 ? 22 : 18 }}
                                className={`rounded-2xl font-black shadow-md flex items-center justify-center cursor-pointer select-none transition-colors
                                    ${val === solved[idx]
                                        ? 'bg-emerald-500 text-white shadow-emerald-300 dark:shadow-emerald-900'
                                        : 'bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {val}
                            </motion.button>
                        )}
                    </AnimatePresence>
                ))}
            </div>

            {won ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                    <div className="text-6xl mb-2">🎊</div>
                    <div className="text-2xl font-black text-emerald-500">Solved in {moves} moves!</div>
                </motion.div>
            ) : (
                <button onClick={init}
                    className="px-6 py-3 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 font-bold rounded-2xl hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors shadow-sm">
                    🔀 Shuffle Again
                </button>
            )}

            <div className="text-xs text-muted-foreground font-medium mt-1">
                💡 Tap a tile next to the blank space to slide it. Green tiles = correct position!
            </div>
        </div>
    );
};

export default SlidingPuzzle;
