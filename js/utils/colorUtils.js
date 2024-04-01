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
    const backdrop = createBackdrop();
    const shadesContainer = createShadesContainer();

    document.body.appendChild(backdrop);
    colorBox.appendChild(shadesContainer);

    backdrop.addEventListener('click', () => {
        backdrop.remove();
        shadesContainer.remove();
    });

    generateShades(currentColor, shadesContainer);
}


function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'backdrop';
    return backdrop;
}

function createShadesContainer() {
    const container = document.createElement('div');
    container.id = 'shades-container';
    return container;
}

function generateShades(baseColor, container) {
    const totalShades = 20; // Количество генерируемых оттенков
    const minLightness = 0.99; // Минимальная светлота, исключает абсолютный черный
    const maxLightness = 0.01; // Максимальная светлота, исключает абсолютный белый

    for (let i = 0; i < totalShades; i++) {
        // Рассчитываем светлоту для каждого оттенка, исключая крайние значения
        const lightnessRange = maxLightness - minLightness;
        const lightness = minLightness + (lightnessRange * i / (totalShades - 1));
        const shadeColor = chroma(baseColor).luminance(lightness).hex();
        createShade(shadeColor, container);
    }
}

function createShade(shadeColor, container) {
    const shade = document.createElement('div');
    shade.className = 'shade';
    Object.assign(shade.style, {
        color: chroma(shadeColor).luminance() > 0.5 ? 'black' : 'white',
        backgroundColor: shadeColor
    });

    // Опционально, если не хотите показывать шестнадцатеричные коды цветов
    shade.textContent = shadeColor;
    container.appendChild(shade);
}

/*
function generateShades(baseColor, container) {
    const totalShades = 10; // Adjust the number of shades as needed

    for (let i = 0; i < totalShades; i++) {
        const shade = document.createElement('div');
        const shadeColor = baseColor.darken(i / totalShades).hex();
        shade.id = 'shade';
        Object.assign(shade.style, {
            color: chroma(shadeColor).luminance() > 0.5 ? 'black' : 'white',
            backgroundColor: shadeColor
        });

        shade.textContent = shadeColor;
        container.appendChild(shade);
    }
}
*/
export function setMenuButtonColor() {
    const colorBoxes = document.querySelectorAll('.color-box');
    const lastColorBox = colorBoxes[colorBoxes.length - 1];
    if (!lastColorBox) return; // Check if the lastColorBox exists

    const backgroundColor = window.getComputedStyle(lastColorBox, null).getPropertyValue('background-color');
    const button = document.querySelector('.menu button');
    if (button) button.style.color = backgroundColor; // Check if the button exists
}
