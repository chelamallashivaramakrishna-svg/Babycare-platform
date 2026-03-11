import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audio';

const DrawCanvas = ({ onWin, level = 1 }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ff0000');
    const [progress, setProgress] = useState(0);
    const [stencil, setStencil] = useState(null);

    // Dynamic difficulty: higher level = more required drawing
    const targetProgress = 50 + parseInt(level) * 20;

    useEffect(() => {
        const lvl = parseInt(level);
        // Generate a random stencil based on level
        let newStencil;
        if (lvl <= 3) {
            // Simple lines
            newStencil = <line x1="50" y1="50" x2="250" y2="250" stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" strokeDasharray="10, 10" />;
        } else if (lvl <= 6) {
            // Shapes
            const type = Math.random() > 0.5 ? 'circle' : 'rect';
            if (type === 'circle') {
                newStencil = <circle cx="150" cy="150" r="100" fill="transparent" stroke="#cbd5e1" strokeWidth="20" strokeDasharray="10, 10" />;
            } else {
                newStencil = <rect x="50" y="50" width="200" height="200" fill="transparent" stroke="#cbd5e1" strokeWidth="20" strokeLinejoin="round" strokeDasharray="10, 10" />;
            }
        } else {
            // Complex (Star, House)
            const type = Math.random() > 0.5 ? 'star' : 'triangle';
            if (type === 'star') {
                newStencil = <polygon points="150,25 179,111 269,111 197,165 223,251 150,200 77,251 103,165 31,111 121,111" fill="transparent" stroke="#cbd5e1" strokeWidth="15" strokeLinejoin="round" strokeDasharray="10, 10" />;
            } else {
                newStencil = <polygon points="150,30 270,140 230,270 70,270 30,140" fill="transparent" stroke="#cbd5e1" strokeWidth="20" strokeLinejoin="round" strokeDasharray="10, 10" />;
            }
        }
        setStencil(newStencil);

        // Reset canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = Math.max(10, 25 - lvl); // Brush gets thinner at higher levels
        }
        setProgress(0);
    }, [level]);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        soundManager.playTone(300, 'sine', 0.1, 0.05);
    };

    const draw = (e) => {
        e.preventDefault(); // prevent scrolling while drawing
        if (!isDrawing) return;

        // Provide continuous audio feedback
        if (Math.random() > 0.8) soundManager.playDraw();

        const { offsetX, offsetY } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        setProgress(p => {
            const newP = p + 1;
            if (newP === targetProgress) {
                setTimeout(() => {
                    soundManager.playWin();
                    onWin(20 + parseInt(level) * 5);
                }, 500);
            }
            return Math.min(newP, targetProgress);
        });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e) => {
        if (e.touches && e.touches.length > 0) {
            const rect = canvasRef.current.getBoundingClientRect();
            // Scaling logic for canvas
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;
            return {
                offsetX: (e.touches[0].clientX - rect.left) * scaleX,
                offsetY: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    };

    // Calculate progress ring
    const pct = Math.min(100, (progress / targetProgress) * 100);

    return (
        <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto py-4">
            <h3 className="text-3xl font-black mb-2 text-pink-500 dark:text-pink-400">Magic Canvas</h3>
            <div className="flex items-center gap-4 mb-6">
                <p className="font-bold text-muted-foreground">Trace the stencil! (Level {level})</p>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border-2 border-slate-200 dark:border-slate-700">
                    <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-pink-500" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#f97316', '#000000'].map(c => (
                    <button
                        key={c}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-4 shadow-sm transition-transform hover:scale-110 ${color === c ? 'border-gray-400 scale-125 z-10 shadow-lg' : 'border-white dark:border-slate-800'}`}
                        style={{ backgroundColor: c }}
                        onClick={() => { soundManager.playPop(); setColor(c); }}
                    />
                ))}
            </div>

            <div className="relative border-8 border-slate-200 dark:border-slate-700 rounded-[3rem] overflow-hidden bg-white shadow-xl touch-none">
                {/* Background Stencil Render */}
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-50">
                    <svg width="300" height="300" viewBox="0 0 300 300">
                        {stencil}
                    </svg>
                </div>

                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="relative z-10 touch-none cursor-crosshair mix-blend-multiply opacity-90 w-[300px] h-[300px]"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                <AnimatePresence>
                    {progress >= targetProgress && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl z-20 pointer-events-none drop-shadow-2xl"
                        >
                            ✨
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <p className="mt-8 text-sm font-bold text-slate-400">Brush thickness scales with difficulty.</p>
        </div>
    );
};

export default DrawCanvas;
