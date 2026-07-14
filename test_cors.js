async function test() {
    const res = await fetch('https://corsproxy.io/?url=https://www.google.com');
    console.log(res.status);
}
test();
