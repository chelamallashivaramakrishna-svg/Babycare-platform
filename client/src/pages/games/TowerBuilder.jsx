import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const COLORS = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500',
    'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500',
    'bg-pink-500', 'bg-teal-500', 'bg-cyan-500'
];

const TowerBuilder = ({ onWin, level = 1 }) => {
    const containerRef = useRef(null);
    const requestRef = useRef();

    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [score, setScore] = useState(0);

    // Dynamic difficulty based on level (1-10)
    const baseWidth = Math.max(10, 80 - (level * 3)); // percentage
    const baseSpeed = 0.5 + (level * 0.2); // percentage per frame
    const targetHeight = 10 + Math.floor(level / 2);

    const initialBottomBlock = {
        x: 50 - (baseWidth / 2),
        width: baseWidth,
        color: 'bg-slate-800 dark:bg-slate-200'
    };

    const [blocks, setBlocks] = useState([initialBottomBlock]);
    const [currentBlock, setCurrentBlock] = useState(null);

    const spawnBlock = (width) => {
        setCurrentBlock({
            x: 0,
            width: width,
            direction: 1, // 1 for right, -1 for left
            color: COLORS[blocks.length % COLORS.length]
        });
    };

    useEffect(() => {
        if (gameState === 'playing' && !currentBlock) {
            spawnBlock(blocks[blocks.length - 1].width);
        }
    }, [blocks, gameState]);

    const updateBlockPosition = () => {
        if (gameState !== 'playing' || !currentBlock) return;

        setCurrentBlock(prev => {
            if (!prev) return prev;
            let newX = prev.x + (baseSpeed * prev.direction);
            let newDir = prev.direction;

            if (newX <= 0) {
                newX = 0;
                newDir = 1;
            } else if (newX + prev.width >= 100) {
                newX = 100 - prev.width;
                newDir = -1;
            }

            return { ...prev, x: newX, direction: newDir };
        });

        requestRef.current = requestAnimationFrame(updateBlockPosition);
    };

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(updateBlockPosition);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, currentBlock?.direction]); // re-run if state changes

    const handleDrop = () => {
        if (gameState !== 'playing' || !currentBlock) return;

        cancelAnimationFrame(requestRef.current);
        const topBlock = blocks[blocks.length - 1];

        const currentLeft = currentBlock.x;
        const currentRight = currentBlock.x + currentBlock.width;
        const topLeft = topBlock.x;
        const topRight = topBlock.x + topBlock.width;

        // Check collision
        if (currentRight < topLeft || currentLeft > topRight) {
            // Missed completely
            soundManager.playLose();
            setGameState('lost');
            setCurrentBlock(prev => ({ ...prev, y: -200 })); // drop off screen
            return;
        }

        // Calculate overlap
        const overlapLeft = Math.max(currentLeft, topLeft);
        const overlapRight = Math.min(currentRight, topRight);
        const newWidth = overlapRight - overlapLeft;

        // Perfect match bonus? (if very close)
        const isPerfect = Math.abs(currentLeft - topLeft) < 2;

        if (isPerfect) {
            soundManager.playWin(); // mini win sound
        } else {
            soundManager.playPop();
        }

        const newBlock = {
            ...currentBlock,
            x: overlapLeft,
            width: newWidth
        };

        const newBlocks = [...blocks, newBlock];
        setBlocks(newBlocks);
        setScore(newBlocks.length - 1);
        setCurrentBlock(null);

        if (newBlocks.length - 1 >= targetHeight) {
            soundManager.playWin();
            setGameState('won');
            setTimeout(() => {
                onWin(50 + (level * 10)); // Reward scales with level
            }, 1500);
        }
    };

    const resetGame = () => {
        soundManager.playPop();
        setBlocks([initialBottomBlock]);
        setCurrentBlock(null);
        setScore(0);
        setGameState('playing');
    };

    // Calculate rendering scale based on height
    const blockHeight = 30; // px
    const containerHeight = 400; // px
    const towerHeight = blocks.length * blockHeight;
    const offset = Math.max(0, towerHeight - containerHeight + (blockHeight * 3));

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-[600px]">
            <div className="flex justify-between w-full mb-4 px-4 items-end">
                <div>
                    <h2 className="text-3xl font-black text-primary">Tower Builder</h2>
                    <p className="text-muted-foreground font-bold">Level {level} • Target: {targetHeight}</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-purple-500">{score}</div>
                    <div className="text-sm font-bold text-muted-foreground">Blocks</div>
                </div>
            </div>

            <div
                ref={containerRef}
                className="w-full h-[400px] bg-slate-100 dark:bg-slate-900 rounded-3xl relative overflow-hidden shadow-inner border-4 border-slate-200 dark:border-slate-800 cursor-pointer"
                onClick={handleDrop}
            >
                {/* Status Overlays */}
                <AnimatePresence>
                    {gameState === 'lost' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-500/20 z-20 flex flex-col items-center justify-center backdrop-blur-sm"
                        >
                            <span className="text-6xl mb-4">💥</span>
                            <h3 className="text-3xl font-black text-red-600 dark:text-red-400 mb-4 drop-shadow-md">Tower Fell!</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); resetGame(); }}
                                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                    {gameState === 'won' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-green-500/20 z-20 flex flex-col items-center justify-center backdrop-blur-sm"
                        >
                            <span className="text-6xl mb-4 text-center">🏆<br /><span className="text-2xl font-black text-green-600 drop-shadow-md">Level Clear!</span></span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* moving camera container */}
                <motion.div
                    className="absolute bottom-0 w-full"
                    animate={{ y: offset }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {/* Render placed blocks */}
                    {blocks.map((block, i) => (
                        <motion.div
                            key={i}
                            layoutId={`block-${i}`}
                            className={`absolute shadow-sm border-t-2 border-white/20 ${block.color}`}
                            style={{
                                left: `${block.x}%`,
                                width: `${block.width}%`,
                                height: `${blockHeight}px`,
                                bottom: `${i * blockHeight}px`,
                                borderTopLeftRadius: '4px',
                                borderTopRightRadius: '4px'
                            }}
                        />
                    ))}

                    {/* Render current moving block */}
                    {currentBlock && gameState === 'playing' && (
                        <div
                            className={`absolute shadow-lg border-t-2 border-white/40 ${currentBlock.color}`}
                            style={{
                                left: `${currentBlock.x}%`,
                                width: `${currentBlock.width}%`,
                                height: `${blockHeight}px`,
                                bottom: `${blocks.length * blockHeight}px`,
                                borderTopLeftRadius: '6px',
                                borderTopRightRadius: '6px',
                                transform: `translateY(${currentBlock.y || 0}px)`,
                                transition: currentBlock.y ? 'transform 0.5s ease-in' : 'none'
                            }}
                        />
                    )}
                </motion.div>
            </div>

            <p className="mt-6 text-muted-foreground font-bold flex items-center gap-2">
                <span className="animate-pulse bg-primary/20 p-2 rounded-lg text-primary">👆</span> Tap anywhere to drop the block!
            </p>
        </div>
    );
};

export default TowerBuilder;
