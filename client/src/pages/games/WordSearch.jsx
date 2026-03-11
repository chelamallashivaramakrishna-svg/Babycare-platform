import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const WORD_BANKS = [
    ['CAT', 'DOG', 'SUN', 'MOON'],
    ['BIRD', 'FISH', 'TREE', 'RAIN'],
    ['APPLE', 'GRAPE', 'MANGO', 'LEMON'],
    ['TIGER', 'PANDA', 'ZEBRA', 'HIPPO'],
    ['OCEAN', 'RIVER', 'CLOUD', 'STORM', 'GRASS'],
    ['RABBIT', 'PARROT', 'MONKEY', 'FLOWER'],
    ['BANANA', 'CHERRY', 'ORANGE', 'MELON', 'PEACH'],
    ['DOLPHIN', 'PENGUIN', 'GORILLA', 'LIONESS'],
    ['MOUNTAIN', 'SUNSHINE', 'RAINBOW', 'BLUEBIRD'],
    ['ELEPHANT', 'TORTOISE', 'CROCODILE', 'BUTTERFLY'],
];

const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

const buildGrid = (words, gridSize) => {
    const grid = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => '')
    );
    const placed = [];

    for (const word of words) {
        let success = false;
        for (let attempt = 0; attempt < 100; attempt++) {
            const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
            const r = Math.floor(Math.random() * gridSize);
            const c = Math.floor(Math.random() * gridSize);
            const cells = [];
            let ok = true;
            for (let i = 0; i < word.length; i++) {
                const nr = r + dir[0] * i, nc = c + dir[1] * i;
                if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) { ok = false; break; }
                if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { ok = false; break; }
                cells.push({ r: nr, c: nc });
            }
            if (ok) {
                cells.forEach(({ r, c }, i) => { grid[r][c] = word[i]; });
                placed.push({ word, cells });
                success = true;
                break;
            }
        }
        if (!success) return null; // retry
    }

    // Fill blanks
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++)
        for (let c = 0; c < gridSize; c++)
            if (grid[r][c] === '') grid[r][c] = alpha[Math.floor(Math.random() * alpha.length)];

    return { grid, placed };
};

const GRID_SIZES = [8, 8, 9, 9, 10, 10, 11, 11, 12, 12];

const WordSearch = ({ onWin, level }) => {
    const words = WORD_BANKS[Math.min(level - 1, WORD_BANKS.length - 1)];
    const gridSize = GRID_SIZES[Math.min(level - 1, GRID_SIZES.length - 1)];
    const [gameData, setGameData] = useState(null);
    const [selecting, setSelecting] = useState(false);
    const [selected, setSelected] = useState([]);
    const [found, setFound] = useState([]);
    const [won, setWon] = useState(false);
    const foundCells = new Set(found.flatMap(f => gameData?.placed.find(p => p.word === f)?.cells.map(c => `${c.r},${c.c}`) || []));

    const init = useCallback(() => {
        let result = null;
        while (!result) result = buildGrid(words, gridSize);
        setGameData(result);
        setFound([]);
        setSelected([]);
        setWon(false);
    }, [words, gridSize]);

    useEffect(() => { init(); }, [init]);

    const getKey = (r, c) => `${r},${c}`;

    const handleCellDown = (r, c) => {
        setSelecting(true);
        setSelected([{ r, c }]);
    };

    const handleCellEnter = (r, c) => {
        if (!selecting) return;
        const first = selected[0];
        if (!first) return;

        // Determine direction
        const dr = r - first.r, dc = c - first.c;
        const len = Math.max(Math.abs(dr), Math.abs(dc));
        if (len === 0) { setSelected([first]); return; }

        const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
        const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
        const isDiag = Math.abs(dr) === Math.abs(dc);
        const isAligned = dr === 0 || dc === 0 || isDiag;
        if (!isAligned) return;

        const cells = [];
        for (let i = 0; i <= len; i++) cells.push({ r: first.r + stepR * i, c: first.c + stepC * i });
        setSelected(cells);
    };

    const handleCellUp = () => {
        setSelecting(false);
        if (!gameData || selected.length < 2) { setSelected([]); return; }
        const selWord = selected.map(s => gameData.grid[s.r][s.c]).join('');
        const revWord = [...selWord].reverse().join('');
        const match = gameData.placed.find(p => (p.word === selWord || p.word === revWord) && !found.includes(p.word));
        if (match) {
            const newFound = [...found, match.word];
            setFound(newFound);
            if (newFound.length === words.length) {
                setWon(true);
                setTimeout(() => onWin(130 + level * 15), 800);
            }
        }
        setTimeout(() => setSelected([]), 300);
    };

    if (!gameData) return <div className="text-center animate-pulse text-xl font-black">Building Word Search...</div>;

    const selectedSet = new Set(selected.map(s => getKey(s.r, s.c)));
    const cellSize = gridSize <= 9 ? 38 : gridSize <= 11 ? 32 : 28;
    const fontSize = cellSize > 34 ? 15 : 12;

    return (
        <div className="flex flex-col items-center gap-5 w-full select-none" onMouseUp={handleCellUp} onMouseLeave={handleCellUp}>
            <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground">
                <span>🔤 Word Search — Level {level}</span>
                <span>✅ {found.length}/{words.length} found</span>
            </div>

            {/* Word List */}
            <div className="flex flex-wrap gap-2 justify-center">
                {words.map(w => (
                    <span key={w} className={`px-3 py-1.5 rounded-xl text-sm font-extrabold border transition-all ${found.includes(w)
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-300 line-through opacity-60'
                        : 'bg-white dark:bg-slate-800 text-foreground border-border'}`}>
                        {w}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div
                className="grid gap-0.5 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 cursor-crosshair"
                style={{ gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)` }}
            >
                {gameData.grid.map((row, r) =>
                    row.map((letter, c) => {
                        const key = getKey(r, c);
                        const isSel = selectedSet.has(key);
                        const isFound = foundCells.has(key);
                        return (
                            <div
                                key={key}
                                onMouseDown={() => handleCellDown(r, c)}
                                onMouseEnter={() => handleCellEnter(r, c)}
                                style={{ width: cellSize, height: cellSize, fontSize }}
                                className={`flex items-center justify-center rounded-lg font-black transition-colors
                                    ${isSel ? 'bg-blue-500 text-white' :
                                        isFound ? 'bg-green-400 dark:bg-green-600 text-white' :
                                            'text-foreground hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                {letter}
                            </div>
                        );
                    })
                )}
            </div>

            {won && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                    <div className="text-6xl mb-2">🎊</div>
                    <div className="text-2xl font-black text-green-500">All words found!</div>
                </motion.div>
            )}

            <button onClick={init} className="px-5 py-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold rounded-xl hover:bg-blue-200 transition-colors text-sm">
                🔄 New Puzzle
            </button>
            <p className="text-xs text-muted-foreground">Click and drag to select words in any direction (horizontal, vertical, diagonal)</p>
        </div>
    );
};

export default WordSearch;
