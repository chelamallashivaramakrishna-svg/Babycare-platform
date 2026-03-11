const fs = require('fs');
const content = fs.readFileSync('client/src/pages/GameSpace.jsx', 'utf8');
const games = ['MemoryMatch', 'NumberPop', 'ColorSplash', 'MathBalloonPop', 'SpellingBee', 'VirtualXylophone', 'AnimalMatch', 'SimonSays', 'WhackAMole'];

fs.mkdirSync('client/src/pages/games', { recursive: true });

games.forEach(game => {
    // We match from 'const GameName = ...' up until the start of the next component or '// --- Main Page ---'
    // A simpler way: match the function signature and then we just use standard string splitting based on component boundaries since they all start with 'const GameName = ({ onWin }) => {'

    // Split by 'const ' to find the block
    const blocks = content.split('\nconst ');
    const block = blocks.find(b => b.startsWith(game + ' = '));

    if (block) {
        let fileContent = `import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';\n\n`;

        if (game === 'VirtualXylophone') {
            fileContent += `const playNote = (frequency, type = 'sine') => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1);
    } catch (e) {
        console.log("Audio not supported", e);
    }
};\n\n`;
        }

        fileContent += 'const ' + block;
        // Clean up the trailing things if it picked up the next comment block
        // Actually split('\nconst ') safely gives just that block, minus the next const.
        // It might include '// --- Main Page ---' at the end of WhackAMole.
        const cleanBlock = fileContent.split('\n// ---')[0];

        fileContent = cleanBlock + `\nexport default ${game};\n`;
        fs.writeFileSync(`client/src/pages/games/${game}.jsx`, fileContent);
        console.log("Wrote", game);
    }
});
