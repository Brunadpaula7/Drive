const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// We need to ensure that the XML parsing works even if Jetimoveis XML has a different structure.
// Instead of filtering out jt !== 'N/A', maybe we should check if any XML parsing resulted in valid jobs,
// if not, fallback to text parser or just return what we got.
const parsedJobsRegex = /const parsedJobs = useMemo\(\(\): Job\[\] => \{.*?\n\s*\}, \[rawJobData\]\);/s;

const newParsedJobs = `const parsedJobs = useMemo((): Job[] => {
        const data = rawJobData.trim();
        if (!data) return [];
        
        let xmlJobs: Job[] = [];
        
        // XML Parser for JetImoveis VrSync format
        if (data.startsWith('<')) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const parserError = xmlDoc.getElementsByTagName("parsererror");
                if (parserError.length) {
                  console.error("XML parsing error:", parserError[0].textContent);
                  // We'll fall through to the text parser if XML fails
                } else {
                    const imoveis = Array.from(xmlDoc.getElementsByTagName('Imovel'));
                    xmlJobs = imoveis.map((imovel, index) => {
                        const getTagContent = (tagName: string) => imovel.getElementsByTagName(tagName)[0]?.textContent?.trim() || '';
                        
                        const jt = getTagContent('CodigoImovel') || 'N/A';
                        const property = getTagContent('TituloImovel') || getTagContent('Imovel') || 'Propriedade não informada';
                        const agents = (getTagContent('Corretor') || '').split('/').map(a => a.trim()).filter(Boolean);
                        
                        const job = \`JOB_XML_\${index}\`;
                        const raw = \`\${jt} (\${property} \${agents.length > 0 ? '- ' + agents.join(' / ') : ''})\`.trim();
                        
                        return {
                            id: \`\${job}-\${jt}-\${Math.random()}\`,
                            job,
                            jt,
                            property,
                            agents,
                            raw,
                        };
                    }).filter(job => job.jt !== 'N/A');
                }
            } catch (e) {
                console.error("Error processing XML job data:", e);
            }
        }
        
        if (xmlJobs.length > 0) {
            return xmlJobs;
        }

        // Original Text Parser
        return data.split('\\n').map(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return null;
            
            const jobMatch = cleanLine.match(/^(JOB|TRABALHO|EMPREGO)(\\d*)\\s*/i);
            const jtMatch = cleanLine.match(/(JT\\d+|GY\\d+|GT\\d+|JT\\?|JT\\s\\?)/i);
            const contentMatch = cleanLine.match(/\\((.*?)\\)/);
            
            let itemJob = '';
            if (jobMatch) {
                itemJob = \`JOB\${jobMatch[2]}\`;
            } else {
                itemJob = \`JOB_MISSING_\${Math.random().toString(36).substring(2, 9)}\`;
            }
            
            const jt = jtMatch ? jtMatch[1].toUpperCase() : 'N/A';
            const content = contentMatch ? contentMatch[1] : '';
            
            let property = '';
            let agents: string[] = [];
            
            if (content) {
                const parts = content.split(' - ');
                property = parts[0] || '';
                if (parts.length > 1) {
                    agents = parts.slice(1).join(' - ').split('/').map(a => a.trim());
                }
            } else {
                property = cleanLine;
            }

            return {
                id: \`\${itemJob}-\${jt}-\${Math.random()}\`,
                job: itemJob,
                jt,
                property,
                agents,
                raw: cleanLine
            };
        }).filter((item): item is Job => item !== null && !!item.job && item.raw.toLowerCase() !== 'haut');
    }, [rawJobData]);`;

content = content.replace(parsedJobsRegex, newParsedJobs);
fs.writeFileSync('App.tsx', content);
console.log("Patched App.tsx parsing logic");
