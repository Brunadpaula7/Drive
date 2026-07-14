const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace("import { InfoBoard } from './components/InfoBoard';\n", "");
code = code.replace("    initialInfoBoardData,\n", "");
code = code.replace("InfoBoardData, ", "");
code = code.replace("const [infoBoardData, setInfoBoardData] = useState<InfoBoardData>({ rodadas: [], meeting: [], lancamentos: [] });\n", "");
code = code.replace("        loadData('infoBoardData', setInfoBoardData, initialInfoBoardData);\n", "");
code = code.replace("                <InfoBoard data={infoBoardData} />\n", "");
code = code.replace("                infoBoardData={infoBoardData}\n", "");
code = code.replace("                onSaveInfoBoard={data => { setInfoBoardData(data); saveData('infoBoardData', data); }}\n", "");

fs.writeFileSync('App.tsx', code);
console.log('App.tsx patched to remove InfoBoard');
