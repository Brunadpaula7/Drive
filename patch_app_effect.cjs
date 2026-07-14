const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const search = `    useEffect(() => {
        const loadData = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, initialData: T) => {`;

const replace = `    useEffect(() => {
        const storedHc = localStorage.getItem('isHighContrast');
        if (storedHc) setIsHighContrast(storedHc === 'true');
    }, []);

    useEffect(() => {
        if (isHighContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }, [isHighContrast]);

    useEffect(() => {
        const loadData = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T>>, initialData: T) => {`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('App.tsx', code);
    console.log("Patched App effect");
} else {
    console.log("Not found effect");
}
