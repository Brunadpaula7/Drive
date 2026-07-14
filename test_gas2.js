async function test() {
    try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbxTWTAxLi09SbU_mXHtza3KJaL6plET1O9OGrK0hkpY_bNK8HVCfGrezpgy1EwwVyNo/exec");
        const json = await res.json();
        console.log(JSON.stringify(json[0], null, 2));
    } catch(e) { console.error(e) }
}
test();
