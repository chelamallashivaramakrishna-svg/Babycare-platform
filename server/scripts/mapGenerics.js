const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../client/src/config/gamesConfig.js');

let fileContent = fs.readFileSync(configPath, 'utf8');

// The file looks like: export const gamesConfig = [\n...\n];
// We need to parse the JSON array from within it.
const jsonStr = fileContent.substring(
    fileContent.indexOf('['),
    fileContent.lastIndexOf(']') + 1
);

const config = JSON.parse(jsonStr);

let mappedCount = 0;

config.forEach(game => {
    if (game.component === 'ComingSoon') {
        const text = (game.title + ' ' + game.description).toLowerCase();

        let newComponent = 'ComingSoon';

        if (text.match(/draw|paint|color|trace|art/)) {
            newComponent = 'DrawCanvas';
        } else if (text.match(/catch|drop|fall|throw/)) {
            newComponent = 'CatchGame';
        } else if (text.match(/quiz|math|number|alphabet|word|letter/)) {
            newComponent = 'QuizGame';
        } else if (text.match(/tap|hit|smash|pop/)) {
            newComponent = 'TapGame';
        } else {
            // Pick a random one from the generals to ensure "most" are built
            const generals = ['DrawCanvas', 'CatchGame', 'QuizGame', 'TapGame'];
            newComponent = generals[Math.floor(Math.random() * generals.length)];
        }

        game.component = newComponent;
        mappedCount++;
    }
});

const newFileContent = `// Auto-generated 100 games master config
export const gamesConfig = ${JSON.stringify(config, null, 4)};
`;

fs.writeFileSync(configPath, newFileContent);

console.log(`Successfully mapped ${mappedCount} generic games into the config.`);
