const fs = require('fs');

let jobSec = fs.readFileSync('components/JobSection.tsx', 'utf8');
jobSec = jobSec.replace(/<label htmlFor="search" className="sr-only">Buscar Job<\/label>/, '<label htmlFor="search" className="sr-only">Buscar Imóvel</label>');
jobSec = jobSec.replace(/placeholder="Buscar por JOB, JT, Empreendimento ou Corretor..."/, 'placeholder="Buscar por código, empreendimento ou corretor..."');
jobSec = jobSec.replace(/<p className="text-zinc-500 text-lg font-medium">Nenhum job encontrado\.<\/p>/, '<p className="text-zinc-500 text-lg font-medium">Nenhum imóvel encontrado.</p>');
jobSec = jobSec.replace(/aria-label=\{\`Job \$\{job\.job\}, \$\{formattedJt\}, \$\{job\.property\}\`\}/, 'aria-label={`Imóvel ${job.job}, ${formattedJt}, ${job.property}`}');
fs.writeFileSync('components/JobSection.tsx', jobSec);

let setMod = fs.readFileSync('components/SettingsModal.tsx', 'utf8');
setMod = setMod.replace(/>Jobs \(Drive\)<\/TabButton>/, '>Revendas (Drive)</TabButton>');
fs.writeFileSync('components/SettingsModal.tsx', setMod);

console.log('Renamed Job to Imóvel/Revendas');
