import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// King moves: can move 1 step in any of 8 directions
const LEVEL_CONFIG = [
    { size: 4, obstacles: 2 },
    { size: 5, obstacles: 4 },
    { size: 5, obstacles: 6 },
    { size: 6, obstacles: 7 },
    { size: 6, obstacles: 9 },
    { size: 7, obstacles: 10 },
    { size: 7, obstacles: 13 },
    { size: 8, obstacles: 14 },
    { size: 8, obstacles: 16 },
    { size: 9, obstacles: 18 },
];

const KING_DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const generateLevel = (size, obstacles) => {
    const start = { r: 0, c: 0 };
    const goal = { r: size - 1, c: size - 1 };
    const blocked = new Set();

    while (blocked.size < obstacles) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        const key = `${r},${c}`;
        if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) continue;
        blocked.add(key);
    }

    // BFS to verify path exists
    const visited = new Set(['0,0']);
    const queue = [{ r: 0, c: 0 }];
    let reachable = false;
    while (queue.length > 0) {
        const { r, c } = queue.shift();
        if (r === goal.r && c === goal.c) { reachable = true; break; }
        for (const [dr, dc] of KING_DIRS) {
            const nr = r + dr, nc = c + dc;
            const key = `${nr},${nc}`;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && !blocked.has(key) && !visited.has(key)) {
                visited.add(key);
                queue.push({ r: nr, c: nc });
            }
        }
    }

    if (!reachable) return generateLevel(size, obstacles); // retry
    return { size, blocked, start, goal };
};

const KingPath = ({ onWin, level }) => {
    const cfg = LEVEL_CONFIG[Math.min(level - 1, LEVEL_CONFIG.length - 1)];
    const [levelData, setLevelData] = useState(null);
    const [pos, setPos] = useState({ r: 0, c: 0 });
    const [path, setPath] = useState([{ r: 0, c: 0 }]);
    const [won, setWon] = useState(false);
    const [moves, setMoves] = useState(0);

    const init = useCallback(() => {
        const data = generateLevel(cfg.size, cfg.obstacles);
        setLevelData(data);
        setPos({ r: 0, c: 0 });
        setPath([{ r: 0, c: 0 }]);
        setWon(false);
        setMoves(0);
    }, [cfg.size, cfg.obstacles]);

    useEffect(() => { init(); }, [init]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!levelData || won) return;
            const map = {
                'ArrowUp': [-1, 0], 'ArrowDown': [1, 0],
                'ArrowLeft': [0, -1], 'ArrowRight': [0, 1],
                'q': [-1, -1], 'e': [-1, 1], 'z': [1, -1], 'c': [1, 1],
            };
            const dir = map[e.key];
            if (!dir) return;
            e.preventDefault();
            const nr = pos.r + dir[0], nc = pos.c + dir[1];
            const key = `${nr},${nc}`;
            if (nr < 0 || nr >= levelData.size || nc < 0 || nc >= levelData.size) return;
            if (levelData.blocked.has(key)) return;
            const newPos = { r: nr, c: nc };
            setPos(newPos);
            setMoves(m => m + 1);
            setPath(p => [...p, newPos]);
            if (nr === levelData.goal.r && nc === levelData.goal.c) {
                setWon(true);
                setTimeout(() => onWin(120 + level * 18), 800);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [levelData, pos, won, level, onWin]);

    const handleCellClick = (r, c) => {
        if (!levelData || won) return;
        const key = `${r},${c}`;
        if (levelData.blocked.has(key)) return;
        const dr = Math.abs(r - pos.r), dc = Math.abs(c - pos.c);
        if (dr > 1 || dc > 1) return; // Must be adjacent (king move)
        if (dr === 0 && dc === 0) return;
        const newPos = { r, c };
        setPos(newPos);
        setMoves(m => m + 1);
        setPath(p => [...p, newPos]);
        if (r === levelData.goal.r && c === levelData.goal.c) {
            setWon(true);
            setTimeout(() => onWin(120 + level * 18), 800);
        }
    };

    if (!levelData) return <div className="text-center animate-pulse text-2xl font-black">Setting up board...</div>;

    const { size, blocked, goal } = levelData;
    const pathSet = new Set(path.map(p => `${p.r},${p.c}`));
    const cellSize = size <= 5 ? 64 : size <= 7 ? 52 : 44;

    return (
        <div className="flex flex-col items-center gap-6 w-full select-none">
            <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground flex-wrap justify-center">
                <span>♛ King's Path — Level {level}</span>
                <span>🚶 Moves: {moves}</span>
                <span className="text-xs opacity-70">Click adjacent cells or use arrow keys + Q/E/Z/C for diagonals</span>
            </div>

            <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-3xl shadow-xl border border-amber-200 dark:border-amber-800">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, ${cellSize}px)` }}>
                    {Array.from({ length: size }, (_, r) =>
                        Array.from({ length: size }, (_, c) => {
                            const key = `${r},${c}`;
                            const isBlocked = blocked.has(key);
                            const isGoal = r === goal.r && c === goal.c;
                            const isPos = pos.r === r && pos.c === c;
                            const isPath = pathSet.has(key);
                            const isAdjacent = !isBlocked && !isPos && Math.abs(r - pos.r) <= 1 && Math.abs(c - pos.c) <= 1;
                            const isStart = r === 0 && c === 0;

                            return (
                                <motion.div
                                    key={key}
                                    whileTap={!isBlocked ? { scale: 0.88 } : {}}
                                    onClick={() => handleCellClick(r, c)}
                                    style={{ width: cellSize, height: cellSize, fontSize: cellSize > 52 ? 22 : 18 }}
                                    className={`rounded-xl flex items-center justify-center font-black cursor-pointer transition-colors border-2
                                        ${isBlocked ? 'bg-slate-700 dark:bg-slate-900 border-slate-600 cursor-not-allowed' :
                                            isGoal ? 'bg-green-400 dark:bg-green-600 border-green-500 text-white' :
                                                isPos ? 'bg-amber-500 border-amber-600 text-white shadow-lg' :
                                                    isPath ? 'bg-amber-200 dark:bg-amber-800 border-amber-300 dark:border-amber-700' :
                                                        isAdjacent ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 hover:bg-amber-200' :
                                                            isStart ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700' :
                                                                'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                                >
                                    {isBlocked ? '🪨' : isPos ? '♛' : isGoal ? '🏆' : isPath ? '·' : isStart ? '🔵' : ''}
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {won ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                    <div className="text-6xl mb-2">👑</div>
                    <div className="text-2xl font-black text-amber-500">King reached the goal in {moves} moves!</div>
                </motion.div>
            ) : (
                <div className="flex gap-4 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-4 h-4 bg-amber-500 rounded inline-block" />You (King)</span>
                    <span className="flex items-center gap-1"><span className="w-4 h-4 bg-green-400 rounded inline-block" />Goal</span>
                    <span className="flex items-center gap-1"><span className="w-4 h-4 bg-slate-700 rounded inline-block" />Blocked</span>
                    <span className="flex items-center gap-1"><span className="w-4 h-4 bg-amber-100 dark:bg-amber-900/50 rounded border border-amber-300 inline-block" />Reachable</span>
                </div>
            )}

            <button onClick={init} className="px-5 py-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold rounded-xl hover:bg-amber-200 transition-colors shadow-sm text-sm">
                🔄 New Board
            </button>
        </div>
    );
};

export default KingPath;
