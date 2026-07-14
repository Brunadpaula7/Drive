async function test() {
    try {
        const res = await fetch('https://cors-anywhere.herokuapp.com/https://example.com');
        console.log("cors-anywhere status:", res.status);
    } catch(e) { console.log(e.message) }
}
test();
