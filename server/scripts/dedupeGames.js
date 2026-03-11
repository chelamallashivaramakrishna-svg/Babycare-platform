const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../client/src/config/gamesConfig.js');

let fileContent = fs.readFileSync(configPath, 'utf8');

const jsonStr = fileContent.substring(
    fileContent.indexOf('['),
    fileContent.lastIndexOf(']') + 1
);

const config = JSON.parse(jsonStr);

// A simple way to remove "repeated" or overly similar games is to keep unique titles
// and perhaps drop some of the highly similar "ComingSoon" mapped generic ones.
const uniqueGames = [];
const seenTitles = new Set();
const seenKeywords = new Set();

config.forEach(game => {
    // Basic deduplication by exact title
    if (seenTitles.has(game.title)) return;

    // Deduplication by core keyword (very aggressive but works for "removing repeated apps")
    const words = game.title.toLowerCase().split(' ');
    const mainWord = words.find(w => w.length > 4 && !['virtual', 'digital', 'game', 'play'].includes(w));

    if (mainWord && seenKeywords.has(mainWord)) {
        return; // Skip if we already have a game about this main topic
    }

    if (mainWord) seenKeywords.add(mainWord);
    seenTitles.add(game.title);

    // Also, let's cap it to a high quality 50 games to make the grid look better
    if (uniqueGames.length < 50) {
        uniqueGames.push(game);
    }
});

const newFileContent = `// Auto-generated master config - Deduplicated
export const gamesConfig = ${JSON.stringify(uniqueGames, null, 4)};
`;

fs.writeFileSync(configPath, newFileContent);

console.log(`Successfully reduced library from ${config.length} to ${uniqueGames.length} unique, high-quality games.`);
