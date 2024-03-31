export function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1)
            .split('-')
            .map((color) => '#' + color);
    }
    return [];
}

export function updateColorsHash(colors = []) {
    document.location.hash = colors
        .map(color => color.substring(1))
        .join('-');
}

export function updateColorsAfterUserInteraction() {
    const colors = Array.from(document.querySelectorAll('.color-box'))
        .map(box => box.querySelector('h2').textContent);
    updateColorsHash(colors);
}
