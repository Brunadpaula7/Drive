fetch("https://api.allorigins.win/raw?url=http://example.com")
  .then(r => r.text())
  .then(t => console.log(t.substring(0, 50)))
  .catch(console.error);
