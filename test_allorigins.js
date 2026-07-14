async function test() {
    try {
        const res = await fetch('https://api.allorigins.win/raw?url=https://example.com');
        console.log("Status:", res.status);
    } catch(e) { console.log(e.message) }
}
test();
