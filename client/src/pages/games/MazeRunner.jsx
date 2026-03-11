import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// Maze generation using Recursive Backtracker
const generateMaze = (rows, cols) => {
    const grid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => ({
            r, c, visited: false,
            walls: { top: true, right: true, bottom: true, left: true }
        }))
    );
    const stack = [];
    const start = grid[0][0];
    start.visited = true;
    stack.push(start);

    const dirs = [
        { dr: -1, dc: 0, wall: 'top', opposite: 'bottom' },
        { dr: 1, dc: 0, wall: 'bottom', opposite: 'top' },
        { dr: 0, dc: -1, wall: 'left', opposite: 'right' },
        { dr: 0, dc: 1, wall: 'right', opposite: 'left' },
    ];

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = dirs
            .map(d => ({ ...d, nr: current.r + d.dr, nc: current.c + d.dc }))
            .filter(d => d.nr >= 0 && d.nr < rows && d.nc >= 0 && d.nc < cols && !grid[d.nr][d.nc].visited);

        if (neighbors.length === 0) {
            stack.pop();
        } else {
            const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
            current.walls[chosen.wall] = false;
            grid[chosen.nr][chosen.nc].walls[chosen.opposite] = false;
            grid[chosen.nr][chosen.nc].visited = true;
            stack.push(grid[chosen.nr][chosen.nc]);
        }
    }
    return grid;
};

const LEVEL_CONFIG = [
    { rows: 5, cols: 5 },
    { rows: 6, cols: 6 },
    { rows: 7, cols: 7 },
    { rows: 8, cols: 8 },
    { rows: 9, cols: 9 },
    { rows: 10, cols: 10 },
    { rows: 11, cols: 11 },
    { rows: 12, cols: 12 },
    { rows: 13, cols: 13 },
    { rows: 15, cols: 15 },
];

const CELL_SIZE = 38;

const MazeRunner = ({ onWin, level }) => {
    const { rows, cols } = LEVEL_CONFIG[Math.min(level - 1, LEVEL_CONFIG.length - 1)];
    const [maze, setMaze] = useState(null);
    const [pos, setPos] = useState({ r: 0, c: 0 });
    const [won, setWon] = useState(false);
    const [trail, setTrail] = useState([{ r: 0, c: 0 }]);
    const [moves, setMoves] = useState(0);
    const containerRef = useRef(null);

    const initMaze = useCallback(() => {
        setMaze(generateMaze(rows, cols));
        setPos({ r: 0, c: 0 });
        setTrail([{ r: 0, c: 0 }]);
        setWon(false);
        setMoves(0);
    }, [rows, cols]);

    useEffect(() => { initMaze(); }, [initMaze]);

    useEffect(() => {
        if (won) return;
        const handleKey = (e) => {
            if (!maze) return;
            const { r, c } = pos;
            const cell = maze[r][c];
            let nr = r, nc = c;
            if (e.key === 'ArrowUp' && !cell.walls.top) { nr = r - 1; }
            else if (e.key === 'ArrowDown' && !cell.walls.bottom) { nr = r + 1; }
            else if (e.key === 'ArrowLeft' && !cell.walls.left) { nc = c - 1; }
            else if (e.key === 'ArrowRight' && !cell.walls.right) { nc = c + 1; }
            else return;

            e.preventDefault();
            const newPos = { r: nr, c: nc };
            setPos(newPos);
            setMoves(m => m + 1);
            setTrail(t => [...t, newPos]);
            if (nr === rows - 1 && nc === cols - 1) {
                setWon(true);
                setTimeout(() => onWin(100 + (level * 20)), 800);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [maze, pos, won, rows, cols, level, onWin]);

    const move = (dir) => {
        if (!maze || won) return;
        const { r, c } = pos;
        const cell = maze[r][c];
        let nr = r, nc = c;
        if (dir === 'up' && !cell.walls.top) nr = r - 1;
        else if (dir === 'down' && !cell.walls.bottom) nr = r + 1;
        else if (dir === 'left' && !cell.walls.left) nc = c - 1;
        else if (dir === 'right' && !cell.walls.right) nc = c + 1;
        else return;

        const newPos = { r: nr, c: nc };
        setPos(newPos);
        setMoves(m => m + 1);
        setTrail(t => [...t, newPos]);
        if (nr === rows - 1 && nc === cols - 1) {
            setWon(true);
            setTimeout(() => onWin(100 + (level * 20)), 800);
        }
    };

    if (!maze) return <div className="text-center text-2xl font-black animate-pulse">Generating Maze...</div>;

    const trailSet = new Set(trail.map(p => `${p.r},${p.c}`));
    const W = cols * CELL_SIZE + 2;
    const H = rows * CELL_SIZE + 2;

    return (
        <div className="flex flex-col items-center gap-6 w-full select-none" ref={containerRef}>
            <div className="flex items-center gap-8 text-sm font-bold text-muted-foreground">
                <span>🎯 Level {level} — {rows}×{cols} Maze</span>
                <span>👣 Moves: {moves}</span>
                <span className="text-xs">Arrow keys or tap buttons below</span>
            </div>

            <div className="relative overflow-auto max-w-full">
                <svg width={W} height={H} style={{ display: 'block' }}>
                    {/* Trail */}
                    {trail.map((p, i) => (
                        <rect key={i}
                            x={p.c * CELL_SIZE + 2} y={p.r * CELL_SIZE + 2}
                            width={CELL_SIZE - 2} height={CELL_SIZE - 2}
                            fill="#6366f155" rx="4"
                        />
                    ))}

                    {/* Goal */}
                    <text x={(cols - 1) * CELL_SIZE + CELL_SIZE / 2} y={(rows - 1) * CELL_SIZE + CELL_SIZE / 2 + 8}
                        textAnchor="middle" fontSize="22">🏁</text>

                    {/* Walls */}
                    {maze.map(row => row.map(cell => {
                        const x = cell.c * CELL_SIZE;
                        const y = cell.r * CELL_SIZE;
                        return (
                            <g key={`${cell.r},${cell.c}`} stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
                                {cell.walls.top && cell.r === 0 && <line x1={x} y1={y} x2={x + CELL_SIZE} y2={y} />}
                                {cell.walls.top && cell.r > 0 && <line x1={x} y1={y} x2={x + CELL_SIZE} y2={y} />}
                                {cell.walls.left && <line x1={x} y1={y} x2={x} y2={y + CELL_SIZE} />}
                                {cell.walls.bottom && <line x1={x} y1={y + CELL_SIZE} x2={x + CELL_SIZE} y2={y + CELL_SIZE} />}
                                {cell.walls.right && <line x1={x + CELL_SIZE} y1={y} x2={x + CELL_SIZE} y2={y + CELL_SIZE} />}
                            </g>
                        );
                    }))}

                    {/* Player */}
                    <motion.text
                        x={pos.c * CELL_SIZE + CELL_SIZE / 2}
                        y={pos.r * CELL_SIZE + CELL_SIZE / 2 + 8}
                        textAnchor="middle" fontSize="22"
                        animate={{ x: pos.c * CELL_SIZE + CELL_SIZE / 2, y: pos.r * CELL_SIZE + CELL_SIZE / 2 + 8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >🧒</motion.text>
                </svg>
            </div>

            {won && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                    <div className="text-6xl mb-2">🎉</div>
                    <div className="text-2xl font-black text-green-500">Maze Solved in {moves} moves!</div>
                </motion.div>
            )}

            {/* Mobile Controls */}
            <div className="grid grid-cols-3 gap-2 mt-2">
                <div />
                <button onClick={() => move('up')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-black w-14 h-14 rounded-2xl text-xl shadow-md active:scale-95 transition-transform">↑</button>
                <div />
                <button onClick={() => move('left')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-black w-14 h-14 rounded-2xl text-xl shadow-md active:scale-95 transition-transform">←</button>
                <button onClick={initMaze} className="bg-muted hover:bg-muted/80 text-muted-foreground font-black w-14 h-14 rounded-2xl text-sm shadow-md active:scale-95 transition-transform">↺</button>
                <button onClick={() => move('right')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-black w-14 h-14 rounded-2xl text-xl shadow-md active:scale-95 transition-transform">→</button>
                <div />
                <button onClick={() => move('down')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-black w-14 h-14 rounded-2xl text-xl shadow-md active:scale-95 transition-transform">↓</button>
                <div />
            </div>
        </div>
    );
};

export default MazeRunner;
