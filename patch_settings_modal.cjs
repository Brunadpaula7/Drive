const fs = require('fs');

let content = fs.readFileSync('components/SettingsModal.tsx', 'utf8');

// Remove infoBoardData from destructuring and use effect
content = content.replace(/infoBoardData,\s*/g, '');
content = content.replace(/onSaveInfoBoard,\s*/g, '');

const effectSearch = `    useEffect(() => {
        if (isOpen) {
            setLocalInfo({
                rodadas: infoBoardData.rodadas.join('\\n'),
                meeting: infoBoardData.meeting.join('\\n'),
                lancamentos: infoBoardData.lancamentos.join('\\n'),
            });
            setLocalLaunches(JSON.stringify(launchesData, null, 2));
            setLocalJobs(rawJobData);
            setLocalUrl(jetimoveisUrl);
            setLocalCoverPhotoUrl(coverPhotoUrl); 
        }
    }, [isOpen, infoBoardData, launchesData, rawJobData, jetimoveisUrl, coverPhotoUrl]);`;

const effectReplace = `    useEffect(() => {
        if (isOpen) {
            setLocalLaunches(JSON.stringify(launchesData, null, 2));
            setLocalJobs(rawJobData);
            setLocalUrl(jetimoveisUrl);
            setLocalCoverPhotoUrl(coverPhotoUrl); 
        }
    }, [isOpen, launchesData, rawJobData, jetimoveisUrl, coverPhotoUrl]);`;

if (content.includes(effectSearch)) {
    content = content.replace(effectSearch, effectReplace);
    console.log("Patched useEffect");
} else {
    // maybe it is slightly different
    console.log("useEffect not found exactly");
}

fs.writeFileSync('components/SettingsModal.tsx', content);

