export const readAllText = file => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = loadEvt => resolve(loadEvt.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}