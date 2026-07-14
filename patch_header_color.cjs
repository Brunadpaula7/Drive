const fs = require('fs');
let code = fs.readFileSync('components/Header.tsx', 'utf8');

const search = `                        <h1 
                            className="text-6xl md:text-7xl lg:text-8xl font-black font-sans tracking-tighter uppercase text-bone leading-none"
                            style={{
                                textShadow: \`
                                    1px 1px 0px #D4D2C6,
                                    2px 2px 0px #D4D2C6,
                                    3px 3px 0px #D4D2C6,
                                    4px 4px 0px #767469,
                                    5px 5px 0px #767469,
                                    6px 6px 0px #767469,
                                    7px 7px 0px #1F3A2E,
                                    8px 8px 0px #1F3A2E,
                                    12px 12px 25px rgba(20, 26, 23, 0.4)
                                \`
                            }}
                        >`;

const replace = `                        <h1 
                            className="text-6xl md:text-7xl lg:text-8xl font-black font-sans tracking-tighter uppercase text-forest leading-none"
                            style={{
                                textShadow: \`
                                    1px 1px 0px #ECEBE3,
                                    2px 2px 0px #ECEBE3,
                                    3px 3px 0px #ECEBE3,
                                    4px 4px 0px #D4D2C6,
                                    5px 5px 0px #D4D2C6,
                                    6px 6px 0px #D4D2C6,
                                    7px 7px 0px #767469,
                                    8px 8px 0px #767469,
                                    12px 12px 25px rgba(20, 26, 23, 0.4)
                                \`
                            }}
                        >`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('components/Header.tsx', code);
    console.log("Patched Header.tsx color");
} else {
    console.log("Not found Header.tsx color");
}
