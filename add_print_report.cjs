const fs = require('fs');

let appContent = fs.readFileSync('App.tsx', 'utf8');

// import PrintReport
appContent = appContent.replace(
    /import \{ CertidoesSection \} from '\.\/components\/CertidoesSection';/,
    "import { CertidoesSection } from './components/CertidoesSection';\nimport { PrintReport } from './components/PrintReport';"
);

// wrap JobSection
appContent = appContent.replace(
    /<JobSection jobs=\{parsedJobs\} onRefresh=\{handleRefreshJobs\} isRefreshing=\{isRefreshingJobs\} \/>/,
    '<div className="print:hidden">\n                    <JobSection jobs={parsedJobs} onRefresh={handleRefreshJobs} isRefreshing={isRefreshingJobs} />\n                </div>'
);

// wrap LaunchSection
appContent = appContent.replace(
    /<LaunchSection data=\{launchesData\} onProjectClick=\{handleOpenLaunchDetailModal\} \/>/,
    '<div className="print:hidden">\n                    <LaunchSection data={launchesData} onProjectClick={handleOpenLaunchDetailModal} />\n                </div>'
);

// insert PrintReport at the end of the container
appContent = appContent.replace(
    /<div className="print:hidden">\n                    <PipelineCalendar data=\{pipelineData\} \/>\n                    <CertidoesSection \/>\n                <\/div>/,
    '<div className="print:hidden">\n                    <PipelineCalendar data={pipelineData} />\n                    <CertidoesSection />\n                </div>\n                <PrintReport jobs={parsedJobs} launches={launchesData} />'
);

fs.writeFileSync('App.tsx', appContent);
console.log("Added PrintReport to App.tsx");
