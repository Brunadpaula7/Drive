const fs = require('fs');

const sectionWrapperRegex = /<section[^>]*className="[^"]*"[^>]*>/g;
const newSectionWrapper = '<section className="bg-white p-6 md:p-8 lg:p-10 rounded-[2rem] shadow-sm border border-sand/40 my-8 transition-all duration-300 w-full relative overflow-hidden">';

function uniformizeComponent(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        
        // 1. Uniformize the `<section>` wrappers
        // Find all <section tags that have a className and replace their className
        content = content.replace(/<section(.*?)className="[^"]*"(.*?)>/g, '<section$1className="bg-white p-6 md:p-8 lg:p-10 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-sand/40 my-8 transition-all duration-500 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]"$2>');
        
        // 2. Uniformize Headers
        // Look for the flex container of the header
        // This is a bit tricky, let's just target the headings themselves
        // JobSection, SalesLinksSection, CertidoesSection use <h3 className="text-3xl font-serif...
        // LogoSection, PipelineCalendar use <h2 className="text-3xl md:text-4xl font-serif...
        // LaunchSection uses <h2 className="text-2xl md:text-3xl font-bold...
        
        content = content.replace(/<h3 className="text-3xl font-serif font-medium text-ink flex items-center">/g, '<h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight">');
        content = content.replace(/<h2 className="text-3xl md:text-4xl font-serif font-medium text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">/g, '<h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">');
        content = content.replace(/<h2 className="text-2xl md:text-3xl font-bold text-center text-ink tracking-tight mr-3 group-hover:text-ink transition-colors">/g, '<h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">');
        
        // Let's also fix the SVG chevron
        content = content.replace(/className={\`w-6 h-6 text-sand group-hover:text-ink transition-transform duration-300 \${isOpen \? 'rotate-180' : ''}\`}/g, 'className={`w-7 h-7 text-stone group-hover:text-ink transition-transform duration-500 ease-in-out ${isOpen ? \'rotate-180\' : \'\'}`}');
        
        // Fix the header flex container if it's justify-center to justify-between
        content = content.replace(/className="flex items-center justify-center mb-8 cursor-pointer group select-none"/g, 'className="flex items-center justify-between mb-8 cursor-pointer group select-none print:hidden"');
        content = content.replace(/className="flex items-center justify-between mb-6 cursor-pointer group select-none print:hidden"/g, 'className="flex items-center justify-between mb-8 cursor-pointer group select-none print:hidden"');
        
        // Also ensure JobSection has justify-between
        content = content.replace(/className="flex items-center justify-between mb-6 cursor-pointer group select-none"/g, 'className="flex items-center justify-between mb-8 cursor-pointer group select-none print:hidden"');
        
        fs.writeFileSync(filename, content);
        console.log(`Uniformized ${filename}`);
    } catch (e) {
        console.error(`Error in ${filename}:`, e);
    }
}

const components = [
    'components/JobSection.tsx',
    'components/LaunchSection.tsx',
    'components/OpenSalesSection.tsx',
    'components/CertidoesSection.tsx',
    'components/LogoSection.tsx',
    'components/PipelineCalendar.tsx',
    'components/SalesLinksSection.tsx'
];

components.forEach(uniformizeComponent);
