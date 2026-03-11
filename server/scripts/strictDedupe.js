const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../client/src/config/gamesConfig.js');

let fileContent = fs.readFileSync(configPath, 'utf8');
const jsonStr = fileContent.substring(
    fileContent.indexOf('['),
    fileContent.lastIndexOf(']') + 1
);
const config = JSON.parse(jsonStr);

// A carefully hand-selected list of perfectly distinct games covering all generic components.
const keepIds = [
    "game_3",   // Color Sorting (ColorSplash)
    "game_22",  // Memory Match Cards (MemoryMatch)
    "game_23",  // Simon Says (SimonSays)
    "game_25",  // Counting Steps / Math (NumberPop)
    "game_60",  // Tag (WhackAMole)
    "game_83",  // Virtual Xylophone (VirtualXylophone)
    "game_86",  // Animal Sound Match (AnimalMatch) - WE NEED TO BUILD THIS OR USE QUIZGAME!
    // Mapped Generic games
    "game_7",   // Finger Painting (DrawCanvas)
    "game_21",  // Alphabet Bingo (QuizGame)
    "game_41",  // The Floor Is Lava (TapGame)
    "game_45",  // Balloon Keep-Up (CatchGame)
    "game_8",   // Play-Doh Stamping (DrawCanvas)
    "game_65",  // Dress-Up Relay (TapGame)
    "game_76",  // Paper Plate Masks (DrawCanvas)
    "game_81",  // Digital Pet Care (CatchGame)
    "game_89",  // Math Balloon Pop (QuizGame or MathBalloon)
];

let curatedGames = config.filter(g => keepIds.includes(g.id));

// Make sure AnimalMatch exists, or map it to QuizGame if it's currently ComingSoon
curatedGames.forEach(g => {
    if (g.component === "ComingSoon") {
        if (g.id === "game_86") g.component = "QuizGame";
    }
});

const newFileContent = `// Auto-generated master config - Strictly Curated to avoid any repetition
export const gamesConfig = ${JSON.stringify(curatedGames, null, 4)};
`;

fs.writeFileSync(configPath, newFileContent);

console.log(`Aggressively deduplicated to ${curatedGames.length} strictly unique games.`);
