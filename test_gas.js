async function test() {
    try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbxTWTAxLi09SbU_mXHtza3KJaL6plET1O9OGrK0hkpY_bNK8HVCfGrezpgy1EwwVyNo/exec", { redirect: 'follow' });
        console.log(res.status, res.statusText);
        const text = await res.text();
        console.log(text.substring(0, 100));
    } catch(e) { console.error(e) }
}
test();
