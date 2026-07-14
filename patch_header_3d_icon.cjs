const fs = require('fs');
let content = fs.readFileSync('components/Header.tsx', 'utf8');

const filterStyle = `
                                filter: \`
                                    drop-shadow(1px 1px 0px #ECEBE3)
                                    drop-shadow(1px 1px 0px #ECEBE3)
                                    drop-shadow(1px 1px 0px #ECEBE3)
                                    drop-shadow(1px 1px 0px #D4D2C6)
                                    drop-shadow(1px 1px 0px #D4D2C6)
                                    drop-shadow(1px 1px 0px #D4D2C6)
                                    drop-shadow(1px 1px 0px #767469)
                                    drop-shadow(1px 1px 0px #767469)
                                \`
`;

content = content.replace(
    /<Building2 className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-forest drop-shadow-md" strokeWidth=\{2\.5\} \/>/,
    `<Building2 className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-forest" strokeWidth={2.5} style={{ ${filterStyle} }} />`
);

fs.writeFileSync('components/Header.tsx', content);
console.log("Patched 3D Icon");
