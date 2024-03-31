import chroma from 'chroma-js';
import {getColorsFromHash, updateColorsHash} from '../stateManagement.js';

export function setRandomColors(isInitial) {
    const colorBoxes = document.querySelectorAll('.color-box');
    const colors = isInitial ? getColorsFromHash() : [];

    colorBoxes.forEach((box, index) => {
        const isLocked = box.querySelector('i').classList.contains('fa-lock');
        if (isLocked) {
            colors.push(box.querySelector('h2').textContent);
            return;
        }

        const color = isInitial && colors[index] ? chroma(colors[index]) : chroma.random();
        updateColorBox(box, color);
        if (!isInitial) colors.push(color.hex());
    });

    updateColorsHash(colors);
}

function updateColorBox(box, color) {
    const text = box.querySelector('h2');
    box.style.backgroundColor = color.css();
    text.textContent = color.hex();
    setTextColor(text, color.hex());

    box.querySelectorAll('button').forEach(button => setTextColor(button, color.hex()));
}

export function setTextColor(element, color) {
    const luminance = chroma(color).luminance();
    element.style.color = luminance > 0.5 ? 'black' : 'white';
}

export function setRandomColorForNewItem(newItem) {
    const color = chroma.random();
    updateColorBox(newItem, color);
}

export function showShades(colorBox) {
    const currentColor = chroma(colorBox.style.backgroundColor);
    createShadesOverlay(currentColor);
}

function createShadesOverlay(color) {
    const backdrop = createBackdrop();
    const shadesContainer = createShadesContainer();

    document.body.appendChild(backdrop);
    document.body.appendChild(shadesContainer);

    generateShades(color, shadesContainer);

    // Close the overlay on backdrop click
    backdrop.addEventListener('click', () => {
        backdrop.remove();
        shadesContainer.remove();
    });
}

function createBackdrop() {
    const backdrop = document.createElement('div');
    Object.assign(backdrop.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '10'
    });
    return backdrop;
}

function createShadesContainer() {
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexWrap: 'wrap',
        width: '80%',
        maxHeight: '80%',
        overflowY: 'auto',
        backgroundColor: '#FFF',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '11'
    });
    return container;
}

function generateShades(baseColor, container) {
    const totalShades = 10; // Adjust the number of shades as needed

    for (let i = 0; i < totalShades; i++) {
        const shade = document.createElement('div');
        const shadeColor = baseColor.darken(i / totalShades).hex();

        Object.assign(shade.style, {
            width: '100%',
            padding: '10px',
            color: chroma(shadeColor).luminance() > 0.5 ? 'black' : 'white',
            backgroundColor: shadeColor,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            fontSize: '16px',
            borderRadius: '4px',
            margin: '5px 0'
        });

        shade.textContent = shadeColor;
        container.appendChild(shade);
    }
}

export function setMenuButtonColor() {
    const colorBoxes = document.querySelectorAll('.color-box');
    const lastColorBox = colorBoxes[colorBoxes.length - 1];
    if (!lastColorBox) return; // Check if the lastColorBox exists

    const backgroundColor = window.getComputedStyle(lastColorBox, null).getPropertyValue('background-color');
    const button = document.querySelector('.menu button');
    if (button) button.style.color = backgroundColor; // Check if the button exists
}
