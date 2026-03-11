import React, { useState, useEffect, useContext, Suspense, lazy } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { gamesConfig } from '../config/gamesConfig';
import { soundManager } from '../utils/audio';

// Lazy load premium game components dynamically
const gameComponents = {
    // New Premium Games
    MazeRunner: React.lazy(() => import('./games/MazeRunner')),
    KingPath: React.lazy(() => import('./games/KingPath')),
    SlidingPuzzle: React.lazy(() => import('./games/SlidingPuzzle')),
    WordSearch: React.lazy(() => import('./games/WordSearch')),
    // Existing Games
    MathQuiz: React.lazy(() => import('./games/MathQuiz')),
    WorldQuiz: React.lazy(() => import('./games/WorldQuiz')),
    SpellingBee: React.lazy(() => import('./games/SpellingBee')),
    MemoryMatch: React.lazy(() => import('./games/MemoryMatch')),
    SimonSays: React.lazy(() => import('./games/SimonSays')),
    CatchGame: React.lazy(() => import('./games/CatchGame')),
};

const GameSpace = () => {
    const { user } = useContext(AuthContext);
    const [childProfile, setChildProfile] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null); // 'brain', 'educational', 'fun'
    const [selectedGame, setSelectedGame] = useState(null); // The full game config object
    const [activeLevel, setActiveLevel] = useState(null); // the chosen level to play
    const [showCelebration, setShowCelebration] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);

    // Fetch child's full profile to get completedLevels
    useEffect(() => {
        const fetchChild = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/children/${user._id}`, config);
                setChildProfile(data);
            } catch (error) {
                console.error("Failed to fetch child profile", error);
            }
        };
        fetchChild();
    }, [user._id, user.token]);

    const handleWin = async (points) => {
        soundManager.playWin();
        setEarnedPoints(points);
        setShowCelebration(true);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/children/${user._id}/game-score`, { category: selectedGame.category, score: points }, config);

            // Increment level progession
            const nextLevel = activeLevel + 1;
            const res = await axios.put(`/api/children/${user._id}/levels`, { gameId: selectedGame.id, levelReached: nextLevel }, config);
            if (res.data.completedLevels) {
                setChildProfile(prev => prev ? { ...prev, completedLevels: res.data.completedLevels } : prev);
            }
        } catch (error) {
            console.error("Error updating score", error);
        }

        setTimeout(() => setShowCelebration(false), 3000);
        setActiveLevel(null); // Return to level selector
    };

    const renderLevelPicker = () => {
        const progress = childProfile?.completedLevels?.find(l => l.gameId === selectedGame.id);
        const maxUnlocked = progress ? progress.maxLevelUnlocked : 1;

        const levelButtons = [];
        for (let i = 1; i <= selectedGame.maxLevel; i++) {
            const isUnlocked = i <= maxUnlocked;
            levelButtons.push(
                <motion.button
                    key={i}
                    whileHover={isUnlocked ? { scale: 1.05 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => isUnlocked && setActiveLevel(i)}
                    className={`h-20 sm:h-24 rounded-2xl text-2xl font-black shadow-md border-b-4 flex items-center justify-center transition-all ${isUnlocked
                        ? 'bg-primary text-primary-foreground border-primary cursor-pointer hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground border-transparent cursor-not-allowed opacity-60'
                        }`}
                >
                    {isUnlocked ? i : '🔒'}
                </motion.button>
            );
        }

        return (
            <motion.div
                key="levelpicker"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-3xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8 bg-card border rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center">
                        <span className="text-6xl mr-4">{selectedGame.emoji}</span>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black">{selectedGame.title}</h2>
                            <p className="text-muted-foreground font-bold">{selectedGame.description}</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-black text-center mb-6">Select a Level</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                    {levelButtons}
                </div>
            </motion.div>
        );
    };

    const renderGameMenu = () => {
        const filteredGames = gamesConfig.filter(g => g.category === activeCategory);

        return (
            <motion.div
                key="gamelist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {filteredGames.map(game => (
                    <motion.div
                        key={game.id}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { soundManager.playPop(); setSelectedGame(game); }}
                        className={`glass-panel cursor-pointer flex flex-col transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border-t border-l border-white/40 dark:border-white/10 relative overflow-hidden group
                            ${activeCategory === 'brain' ? 'bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20' :
                                activeCategory === 'educational' ? 'bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20' :
                                    'bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20'}`}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-black/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="p-8 relative z-10 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <span className="text-6xl drop-shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{game.emoji}</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/60 dark:bg-black/40 text-foreground px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md border border-white/50 dark:border-white/10">
                                    {game.maxLevel} Lvl
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-foreground mb-3 leading-tight tracking-tight">{game.title}</h3>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{game.description}</p>
                            </div>
                            <div className="mt-auto pt-6 flex justify-end">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transform group-hover:translate-x-2 transition-transform shadow-sm">
                                    ➔
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-64px)]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center gap-4 relative justify-center mb-4">
                    {(activeCategory || selectedGame) && (
                        <button
                            onClick={() => {
                                if (activeLevel) setActiveLevel(null);
                                else if (selectedGame) setSelectedGame(null);
                                else setActiveCategory(null);
                            }}
                            className="absolute left-0 bg-muted hover:bg-muted/80 text-muted-foreground font-bold py-2 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
                        >
                            ← Back
                        </button>
                    )}

                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                        GameSpace 🎮
                    </h1>
                </div>
                {!selectedGame && <p className="text-lg md:text-xl font-bold text-muted-foreground text-center">Select a category to explore {gamesConfig.length} exciting games!</p>}
            </motion.div>

            <AnimatePresence mode="wait">
                {showCelebration ? (
                    <motion.div
                        key="celebration"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex flex-col items-center justify-center p-12 bg-card border rounded-3xl shadow-2xl max-w-md mx-auto"
                    >
                        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-8xl mb-6">🎉</motion.div>
                        <h2 className="text-4xl font-black text-green-500 mb-2">You Win!</h2>
                        <p className="text-2xl font-bold text-muted-foreground">+{earnedPoints} Points!</p>
                    </motion.div>

                ) : selectedGame && activeLevel ? (
                    <motion.div
                        key="gameArea"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card border text-card-foreground p-8 rounded-3xl shadow-xl relative min-h-[400px] flex items-center justify-center flex-col"
                    >
                        <h2 className="absolute top-4 right-6 text-xl font-black text-muted-foreground opacity-30 uppercase tracking-widest">{selectedGame.title} - Lvl {activeLevel}</h2>
                        <Suspense fallback={<div className="animate-spin text-6xl">⏳</div>}>
                            {React.createElement(gameComponents[selectedGame.component], { onWin: handleWin, level: activeLevel })}
                        </Suspense>
                    </motion.div>
                ) : selectedGame ? (
                    renderLevelPicker()
                ) : activeCategory ? (
                    renderGameMenu()
                ) : (
                    <motion.div
                        key="categories"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { soundManager.playPop(); setActiveCategory('brain'); }}
                            className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-12 rounded-[2rem] shadow-xl cursor-pointer flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-8xl mb-6 group-hover:scale-110 transition-transform group-hover:-rotate-6 drop-shadow-md">🧠</span>
                            <h3 className="text-3xl lg:text-4xl font-black mb-2 drop-shadow-sm">Brain Games</h3>
                            <p className="font-bold opacity-90 text-lg">Memory & Logic</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { soundManager.playPop(); setActiveCategory('educational'); }}
                            className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-12 rounded-[2rem] shadow-xl cursor-pointer flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-8xl mb-6 group-hover:scale-110 transition-transform group-hover:rotate-6 drop-shadow-md">📚</span>
                            <h3 className="text-3xl lg:text-4xl font-black mb-2 drop-shadow-sm">Learn & Play</h3>
                            <p className="font-bold opacity-90 text-lg">Math, Spelling & Puzzles</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { soundManager.playPop(); setActiveCategory('fun'); }}
                            className="bg-gradient-to-br from-green-400 to-green-600 text-white p-12 rounded-[2rem] shadow-xl cursor-pointer flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-8xl mb-6 group-hover:scale-110 transition-transform group-hover:-rotate-3 drop-shadow-md">🎨</span>
                            <h3 className="text-3xl lg:text-4xl font-black mb-2 drop-shadow-sm">Fun Games</h3>
                            <p className="font-bold opacity-90 text-lg">Colors, Sound & Action</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default GameSpace;
