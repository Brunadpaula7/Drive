const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const regex = /<Header coverPhotoUrl=\{coverPhotoUrl\} \/>\s*<SalesLinksSection \/>\s*<LogoSection[\s\S]*?<PipelineCalendar data=\{pipelineData\} \/>/m;

const match = content.match(regex);
if (match) {
    let replaced = match[0]
        .replace(/\s*<JobSection jobs=\{parsedJobs\} onRefresh=\{handleRefreshJobs\} isRefreshing=\{isRefreshingJobs\} \/>/, '');
    
    // Insert JobSection after SalesLinksSection
    replaced = replaced.replace(
        /<SalesLinksSection \/>/,
        '<SalesLinksSection />\n                <JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} />'
    );
    
    content = content.replace(match[0], replaced);
    fs.writeFileSync('App.tsx', content);
    console.log("Patched JobSection order successfully");
} else {
    console.log("No match found");
}
