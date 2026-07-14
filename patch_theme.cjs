const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const twConfig = `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              ink: '#141A17',
              bone: '#ECEBE3',
              sand: '#D4D2C6',
              forest: '#1F3A2E',
              stone: '#767469',
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              serif: ['Playfair Display', 'serif'],
            },
            screens: {
              'xs': '475px',
            }
          }
        }
      }
`;

indexHtml = indexHtml.replace(/tailwind\.config = \{[\s\S]*?\}\s*\}/, twConfig.trim());
indexHtml = indexHtml.replace(/family=Inter:wght@300;400;500;600;700&display=swap"/, 'family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"');
indexHtml = indexHtml.replace(/bg-zinc-50 text-zinc-900/, 'bg-bone text-ink');
indexHtml = indexHtml.replace(/selection:bg-zinc-200 selection:text-zinc-900/, 'selection:bg-sand selection:text-ink');

fs.writeFileSync('index.html', indexHtml);
console.log('index.html updated with new theme');

// Update App.tsx
let app = fs.readFileSync('App.tsx', 'utf8');
app = app.replace(/bg-white/g, 'bg-bone');
app = app.replace(/text-zinc-900/g, 'text-ink');
app = app.replace(/text-zinc-800/g, 'text-ink');
app = app.replace(/text-zinc-700/g, 'text-stone');
app = app.replace(/text-zinc-600/g, 'text-stone');
app = app.replace(/text-zinc-500/g, 'text-stone');
app = app.replace(/text-zinc-400/g, 'text-sand');
app = app.replace(/border-zinc-200/g, 'border-sand');
app = app.replace(/border-zinc-300/g, 'border-stone');
app = app.replace(/border-white\/40/g, 'border-sand');
app = app.replace(/bg-zinc-100/g, 'bg-sand');
app = app.replace(/bg-zinc-50/g, 'bg-bone');
app = app.replace(/bg-zinc-900/g, 'bg-ink');
app = app.replace(/bg-black/g, 'bg-ink');
app = app.replace(/hover:bg-zinc-50/g, 'hover:bg-sand');
app = app.replace(/ring-zinc-400/g, 'ring-stone');
app = app.replace(/ring-zinc-900/g, 'ring-ink');
fs.writeFileSync('App.tsx', app);

console.log('App.tsx updated');

function updateComponentColors(filename) {
    try {
        let content = fs.readFileSync('components/' + filename, 'utf8');
        content = content.replace(/bg-white/g, 'bg-bone');
        content = content.replace(/text-zinc-900/g, 'text-ink');
        content = content.replace(/text-zinc-800/g, 'text-ink');
        content = content.replace(/text-zinc-700/g, 'text-stone');
        content = content.replace(/text-zinc-600/g, 'text-stone');
        content = content.replace(/text-zinc-500/g, 'text-stone');
        content = content.replace(/text-zinc-400/g, 'text-sand');
        content = content.replace(/border-zinc-200/g, 'border-sand');
        content = content.replace(/border-zinc-300/g, 'border-stone');
        content = content.replace(/border-white\/40/g, 'border-sand');
        content = content.replace(/bg-zinc-100/g, 'bg-sand');
        content = content.replace(/bg-zinc-50/g, 'bg-bone');
        content = content.replace(/bg-zinc-900/g, 'bg-ink');
        content = content.replace(/bg-black/g, 'bg-ink');
        content = content.replace(/hover:bg-zinc-50/g, 'hover:bg-sand');
        content = content.replace(/hover:bg-zinc-800/g, 'hover:bg-forest');
        content = content.replace(/ring-zinc-400/g, 'ring-stone');
        content = content.replace(/ring-zinc-900/g, 'ring-ink');
        content = content.replace(/from-zinc-200/g, 'from-sand');
        content = content.replace(/to-zinc-300/g, 'to-stone');
        fs.writeFileSync('components/' + filename, content);
    } catch (e) {
        console.error('Error updating ' + filename);
    }
}

const components = [
    'Header.tsx',
    'LogoSection.tsx',
    'LogoItem.tsx',
    'JobSection.tsx',
    'LaunchSection.tsx',
    'OpenSalesSection.tsx',
    'PipelineCalendar.tsx',
    'Modal.tsx',
    'SettingsModal.tsx',
    'EditLogoModal.tsx',
    'EditPipelineEventModal.tsx'
];

components.forEach(updateComponentColors);

console.log('Components updated');
