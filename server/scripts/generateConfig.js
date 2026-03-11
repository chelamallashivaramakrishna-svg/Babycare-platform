const fs = require('fs');
const md = fs.readFileSync('100_Kids_Games_Ideas.md', 'utf8');
const lines = md.split('\n');
const games = [];
let category = 'fun';
const emojis = ['🎲', '🎮', '🧩', '🎈', '🎨', '🌟', '🐾', '🎵', '🧠', '🏃'];
lines.forEach(line => {
    if (line.includes('Sensory')) category = 'fun';
    if (line.includes('Cognitive')) category = 'brain';
    if (line.includes('Physical')) category = 'fun';
    if (line.includes('Creative')) category = 'fun';
    if (line.includes('Digital')) category = 'educational';

    // Look for numbers like "1. **Peek-a-boo:** Description"
    const match = line.match(/^(\d+)\.\s\*\*(.*?):\*\*(.*)/);
    if (match) {
        const id = 'game_' + match[1];
        const title = match[2].trim();
        const description = match[3].trim();
        const emoji = emojis[parseInt(match[1]) % emojis.length];

        let maxLevel = 5;
        if (category === 'brain') maxLevel = 10;
        else if (category === 'educational') maxLevel = 8;

        let component = null;
        if (match[1] === '22') component = 'MemoryMatch';
        if (match[1] === '23') component = 'SimonSays';
        if (match[1] === '83') component = 'VirtualXylophone';
        if (match[1] === '86') component = 'AnimalMatch';
        if (match[1] === '89') component = 'MathBalloonPop';
        if (match[1] === '90') component = 'SpellingBee';
        if (match[1] === '25') component = 'NumberPop';
        if (match[1] === '3') component = 'ColorSplash';
        if (match[1] === '60') component = 'WhackAMole';

        games.push({ id, title, description, category, emoji, maxLevel, component: component || 'ComingSoon' });
    }
});
const content = `// Auto-generated 100 games master config\nexport const gamesConfig = ` + JSON.stringify(games, null, 4) + ';\n';
fs.mkdirSync('client/src/config', { recursive: true });
fs.writeFileSync('client/src/config/gamesConfig.js', content);
console.log('Successfully generated 100 game configs!');
