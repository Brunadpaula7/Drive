async function test() {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/proxy?url=" + encodeURIComponent("https://script.google.com/macros/s/AKfycbxTWTAxLi09SbU_mXHtza3KJaL6plET1O9OGrK0hkpY_bNK8HVCfGrezpgy1EwwVyNo/exec"));
        console.log(res.status);
        const text = await res.text();
        console.log(text.substring(0, 50));
    } catch(e) { console.error(e) }
}
test();
