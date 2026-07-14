const fs = require('fs');

function replaceSerif(filename, regex, replacement) {
    try {
        let content = fs.readFileSync('components/' + filename, 'utf8');
        content = content.replace(regex, replacement);
        fs.writeFileSync('components/' + filename, content);
    } catch (e) {
        // ignore
    }
}

// In JobSection
replaceSerif('JobSection.tsx', /<h3 className="text-2xl font-bold text-ink flex items-center">/, '<h3 className="text-3xl font-serif font-medium text-ink flex items-center">');

// In LaunchSection
replaceSerif('LaunchSection.tsx', /<h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mr-3 group-hover:text-ink transition-colors">/g, '<h2 className="text-3xl md:text-4xl font-serif font-medium text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">');

// In LogoSection
replaceSerif('LogoSection.tsx', /<h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mr-3 group-hover:text-ink transition-colors">/g, '<h2 className="text-3xl md:text-4xl font-serif font-medium text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">');

// In OpenSalesSection
replaceSerif('OpenSalesSection.tsx', /<h2 className="text-2xl font-bold text-ink tracking-tight flex items-center">/, '<h2 className="text-3xl font-serif font-medium text-ink tracking-tight flex items-center">');

// In PipelineCalendar
replaceSerif('PipelineCalendar.tsx', /<h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight mr-3 group-hover:text-ink transition-colors">/g, '<h2 className="text-3xl md:text-4xl font-serif font-medium text-ink tracking-tight mr-3 group-hover:text-forest transition-colors">');

// App.tsx
let app = fs.readFileSync('App.tsx', 'utf8');
app = app.replace(/<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink mb-3">/, '<h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-ink mb-3 italic">');
app = app.replace(/<p className="text-lg text-stone max-w-2xl mx-auto font-medium">/, '<p className="text-lg text-stone max-w-2xl mx-auto font-serif italic">');
fs.writeFileSync('App.tsx', app);

// Header.tsx
let header = fs.readFileSync('components/Header.tsx', 'utf8');
header = header.replace(/<h1 className="text-3xl md:text-4xl font-bold text-ink">/, '<h1 className="text-4xl md:text-5xl font-serif font-medium text-ink italic">');
fs.writeFileSync('components/Header.tsx', header);

console.log("Typography updated");
