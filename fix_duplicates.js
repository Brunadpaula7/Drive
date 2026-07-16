import fs from 'fs';
let code = fs.readFileSync('constants.ts', 'utf8');

// Find the initialLaunchesData array
const startStr = "export const initialLaunchesData: LaunchProject[] = [";
const startIndex = code.indexOf(startStr);
const endStr = "];\n\nexport const initialRawJobData";
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    let arrayContent = code.substring(startIndex + startStr.length, endIndex);
    
    // We can parse the array using eval or just regex out the objects.
    // However, it's safer to extract it and use a simpler regex or manual parsing.
}
