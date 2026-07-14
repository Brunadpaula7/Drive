const fs = require('fs');
let code = fs.readFileSync('components/SettingsModal.tsx', 'utf8');

// replace props
code = code.replace("    infoBoardData: InfoBoardData;\n", "");
code = code.replace("    onSaveInfoBoard: (data: InfoBoardData) => void;\n", "");

// replace from destructured props
code = code.replace("    infoBoardData,\n", "");
code = code.replace("    onSaveInfoBoard,\n", "");

// remove local state
code = code.replace("    const [localInfoBoard, setLocalInfoBoard] = useState(infoBoardData);\n", "");

// remove local state from useEffect
code = code.replace("        setLocalInfoBoard(infoBoardData);\n", "");

// remove render info board block
const regexInfoBoard = /<div className="space-y-4">[\s\S]*?<h3 className="text-lg font-semibold text-zinc-800">Quadro de Avisos<\/h3>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
code = code.replace(regexInfoBoard, "");

// remove save logic
code = code.replace("        onSaveInfoBoard(localInfoBoard);\n", "");

fs.writeFileSync('components/SettingsModal.tsx', code);
console.log('SettingsModal.tsx patched');
