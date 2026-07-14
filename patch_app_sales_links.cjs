const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const importSearch = `import { PipelineCalendar } from './components/PipelineCalendar';`;
const importReplace = `import { PipelineCalendar } from './components/PipelineCalendar';
import { SalesLinksSection } from './components/SalesLinksSection';`;

const componentSearch = `                <PipelineCalendar data={pipelineData} />
            </div>`;
const componentReplace = `                <PipelineCalendar data={pipelineData} />
                <SalesLinksSection />
            </div>`;

if (code.includes(importSearch) && code.includes(componentSearch)) {
    code = code.replace(importSearch, importReplace);
    code = code.replace(componentSearch, componentReplace);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App.tsx for SalesLinksSection");
} else {
    console.log("Not found in App.tsx");
}
