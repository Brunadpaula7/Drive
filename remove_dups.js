import fs from 'fs';
let code = fs.readFileSync('constants.ts', 'utf8');

const regexToRemove = /\{\s*"id":\s*"(ecoville-figueira|solenne-consciente|city-park-majestic|seren-hausen|city-park-palace|hype-vaca-brava|autentico-flamboyant|legitimo-residencial|olivier-om-home|fr-casa-aurora|capadocia-marista|marista-262)"[\s\S]*?\},/g;

// Only remove the SECOND occurence of each ID.
// The safer way:
let modifiedCode = code;
const ids = [
    'ecoville-figueira',
    'solenne-consciente',
    'city-park-majestic',
    'seren-hausen',
    'city-park-palace',
    'hype-vaca-brava',
    'autentico-flamboyant',
    'olivier-om-home',
    'fr-casa-aurora',
    'capadocia-marista',
];

for (let id of ids) {
    // Find all matches of the object
    const idRegex = new RegExp(`\\{\\s*"id":\\s*"${id}"[\\s\\S]*?\\},`, 'g');
    let match;
    let occurrences = [];
    while ((match = idRegex.exec(modifiedCode)) !== null) {
        occurrences.push({ index: match.index, length: match[0].length, string: match[0] });
    }
    
    // If more than 1, remove all but the first
    if (occurrences.length > 1) {
        // Start removing from the last to avoid shifting indexes
        for (let i = occurrences.length - 1; i > 0; i--) {
            const occ = occurrences[i];
            modifiedCode = modifiedCode.slice(0, occ.index) + modifiedCode.slice(occ.index + occ.length);
        }
    }
}

fs.writeFileSync('constants.ts', modifiedCode);
