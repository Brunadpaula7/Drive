const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const useE = `
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch("https://script.google.com/macros/s/AKfycbxTWTAxLi09SbU_mXHtza3KJaL6plET1O9OGrK0hkpY_bNK8HVCfGrezpgy1EwwVyNo/exec");
                const data = await response.text();
                
                setRawJobData(data);
                try {
                    localStorage.setItem('rawJobData', JSON.stringify(data));
                    localStorage.setItem('lastSyncTime', Date.now().toString());
                } catch (e) { console.error(e) }
            } catch (error) {
                console.error("Failed to fetch properties:", error);
            }
        };

        const checkSync = () => {
            const lastSync = parseInt(localStorage.getItem('lastSyncTime') || '0', 10);
            
            // Get current time in BRT
            const now = new Date();
            const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
            const brtTime = new Date(utcTime - (3 * 3600000));
            
            // Get today's 21:00 BRT
            const threshold = new Date(brtTime);
            threshold.setHours(21, 0, 0, 0);
            if (brtTime < threshold) {
                threshold.setDate(threshold.getDate() - 1);
            }
            
            if (lastSync < threshold.getTime()) {
                fetchProperties();
            }
        };

        checkSync();
        const interval = setInterval(checkSync, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
`;

code = code.replace("    }, []);\n\n    const saveData", "    }, []);\n" + useE + "\n    const saveData");

const parserCode = `
        if (data.startsWith('[')) {
            try {
                const jsonArray = JSON.parse(data);
                return jsonArray.map((item: any) => {
                    const jt = item.id || 'N/A';
                    const property = item.titulo || 'Propriedade não informada';
                    
                    const size = item.area ? item.area + ' m²' : '';
                    const suites = item.suites ? item.suites + ' suítes' : '';
                    const vagas = item.vagas ? item.vagas + ' vagas' : '';
                    const locationDetails = [item.bairro, item.cidade].filter(Boolean).join(', ');
                    const price = item.valor ? 'R$ ' + item.valor.toLocaleString('pt-BR') : '';
                    
                    const details = [item.tipo, size, suites, vagas, locationDetails, price].filter(Boolean).join(' - ');
                    const fullProperty = property + ' | ' + details;

                    return {
                        id: 'JSON-' + jt + '-' + Math.random(),
                        job: 'JSON-' + jt,
                        jt,
                        property: fullProperty,
                        agents: [],
                        raw: jt + ' - ' + fullProperty
                    };
                }).filter((item: Job) => item.jt !== 'N/A');
            } catch (error) {
                console.error("Error processing JSON job data:", error);
                return [];
            }
        }
`;

code = code.replace("// XML Parser for JetImoveis VrSync format", parserCode + "\n\n        // XML Parser for JetImoveis VrSync format");

fs.writeFileSync('App.tsx', code);
console.log('App.tsx patched');
