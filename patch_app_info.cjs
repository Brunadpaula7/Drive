const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Remove import { InfoBoard }
content = content.replace(/import { InfoBoard } from '.\/components\/InfoBoard';\n/, '');

// Remove <InfoBoard ... />
content = content.replace(/<InfoBoard data={infoBoardData} \/>\n/, '');
content = content.replace(/<InfoBoard data={infoBoardData} \/>/, '');

// Also remove from SettingsModal props
content = content.replace(/infoBoardData=\{infoBoardData\}\n/, '');
content = content.replace(/onSaveInfoBoard=\{data => \{ setInfoBoardData\(data\); saveData\('infoBoardData', data\); \}\}\n/, '');

// Remove infoBoard states
content = content.replace(/const \[infoBoardData, setInfoBoardData\] = useState<InfoBoardData>\(\{ rodadas: \[\], meeting: \[\], lancamentos: \[\] \}\);\n/, '');

// Remove infoBoard from constants import
content = content.replace(/initialInfoBoardData,\n/g, '');

// Also remove from loadData
content = content.replace(/loadData\('infoBoardData', setInfoBoardData, initialInfoBoardData\);\n/g, '');

fs.writeFileSync('App.tsx', content);
console.log("Patched InfoBoard out of App.tsx");
