const fs = require('fs');

let content = fs.readFileSync('components/LogoSection.tsx', 'utf8');

const oldFilter = `    const filteredData = useMemo(() => {
        if (!query) return data;
        const lowerCaseQuery = query.toLowerCase();
        if (isCitySection) {
            return data.map(section => {
                if (!isCitySectionTypeGuard(section)) return null;
                const cityMatch = section.city.toLowerCase().includes(lowerCaseQuery);
                const filteredLogos = section.logos.filter(logo => logo.name.toLowerCase().includes(lowerCaseQuery));
                
                if (cityMatch || filteredLogos.length > 0) {
                    return { ...section, logos: cityMatch ? section.logos : filteredLogos };
                }
                return null;
            }).filter((item): item is CitySection => item !== null);
        } else {
            return data.filter(item => { 
                if (isCitySectionTypeGuard(item)) return false; 
                return item.name.toLowerCase().includes(lowerCaseQuery)
            });
        }
    }, [query, data, isCitySection]);`;

const newFilter = `    const filteredData = useMemo(() => {
        let currentData = data;

        // Apply global search
        if (globalSearch) {
            const searchLower = globalSearch.toLowerCase();
            if (isCitySection) {
                currentData = currentData.map(section => {
                    if (!isCitySectionTypeGuard(section)) return null;
                    const cityMatch = section.city.toLowerCase().includes(searchLower);
                    const filteredLogos = section.logos.filter(logo => logo.name.toLowerCase().includes(searchLower));
                    
                    if (cityMatch || filteredLogos.length > 0) {
                        return { ...section, logos: cityMatch ? section.logos : filteredLogos };
                    }
                    return null;
                }).filter((item): item is CitySection => item !== null);
            } else {
                currentData = currentData.filter(item => { 
                    if (isCitySectionTypeGuard(item)) return false; 
                    return item.name.toLowerCase().includes(searchLower);
                });
            }
        }

        // Apply local query
        if (query) {
            const queryLower = query.toLowerCase();
            if (isCitySection) {
                currentData = currentData.map(section => {
                    if (!isCitySectionTypeGuard(section)) return null;
                    const cityMatch = section.city.toLowerCase().includes(queryLower);
                    const filteredLogos = section.logos.filter(logo => logo.name.toLowerCase().includes(queryLower));
                    
                    if (cityMatch || filteredLogos.length > 0) {
                        return { ...section, logos: cityMatch ? section.logos : filteredLogos };
                    }
                    return null;
                }).filter((item): item is CitySection => item !== null);
            } else {
                currentData = currentData.filter(item => { 
                    if (isCitySectionTypeGuard(item)) return false; 
                    return item.name.toLowerCase().includes(queryLower);
                });
            }
        }

        return currentData;
    }, [query, globalSearch, data, isCitySection]);`;

content = content.replace(oldFilter, newFilter);
fs.writeFileSync('components/LogoSection.tsx', content);
console.log("Patched LogoSection");
