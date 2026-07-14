const fs = require('fs');
let app = fs.readFileSync('App.tsx', 'utf8');

// Replace background of main container if any
app = app.replace(/bg-white\/30 backdrop-blur-lg rounded-full shadow-md border border-white\/40/g, 'bg-white rounded-full shadow-sm border border-zinc-200');
app = app.replace(/hover:bg-white\/50/g, 'hover:bg-zinc-50');

fs.writeFileSync('App.tsx', app);

let header = fs.readFileSync('components/Header.tsx', 'utf8');
header = header.replace(/bg-black p-4 rounded-xl shadow-lg/g, 'bg-white p-6 rounded-2xl shadow-sm border border-zinc-200');
header = header.replace(/text-white/g, 'text-zinc-900');
fs.writeFileSync('components/Header.tsx', header);

let modal = fs.readFileSync('components/Modal.tsx', 'utf8');
modal = modal.replace(/bg-white\/80 backdrop-blur-2xl/g, 'bg-white');
modal = modal.replace(/border border-white\/50/g, 'border border-zinc-200');
fs.writeFileSync('components/Modal.tsx', modal);

console.log("Patched App, Header, Modal");
