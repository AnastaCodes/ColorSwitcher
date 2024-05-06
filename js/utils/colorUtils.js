import chroma from 'chroma-js';
import {getColorsFromHash, updateColorsAfterUserInteraction, updateColorsHash} from '../stateManagement.js';

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

export function updateColorBox(box, color) {
    const chromaColor = chroma(color);
    const text = box.querySelector('h2');

    box.style.backgroundColor = chromaColor.hex();
    text.textContent = chromaColor.hex();
    setTextColor(text, chromaColor.hex());
    box.querySelectorAll('button').forEach(button => setTextColor(button, chromaColor.hex()));
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


export function editHexValue(colorBox) {
    const element = colorBox.querySelector('h2');
    const input = document.createElement('input');
    const originalText = element.innerText;
    const backdrop = createBackdrop();

    backdrop.style.background = '#ffffff14';
    document.body.appendChild(backdrop);

    input.type = 'text';
    input.value = element.innerText;
    element.parentNode.replaceChild(input, element);
    input.focus();

    backdrop.addEventListener('click', () => {
        element.innerText = originalText;
        input.parentNode.replaceChild(element, input);
        backdrop.remove();
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            if (validateHex(input.value)) {
                element.innerText = input.value;
                input.parentNode.replaceChild(element, input);
                updateColorBox(colorBox, input.value);
                updateColorsAfterUserInteraction();
                backdrop.remove();
            } else {
                input.classList.add('shake');
                input.addEventListener('animationend', () => {
                    input.classList.remove('shake');
                }, {once: true});
                input.focus();
            }
        }
    });

    input.addEventListener('click', function () {
        input.classList.remove('shake');
        input.classList.remove('input-error');
    });
}

function validateHex(hex) {
    return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(hex);
}

export function createBackdrop() {
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
    const totalShades = 20;
    const minLightness = 0.99;
    const maxLightness = 0.01;

    for (let i = 0; i < totalShades; i++) {
        const lightnessRange = maxLightness - minLightness;
        const lightness = minLightness + (lightnessRange * i / (totalShades - 1));
        const shadeColor = chroma(baseColor).luminance(lightness).hex();
        createShade(shadeColor, container);
    }
}

function createShade(shadeColor, container) {
    const shade = document.createElement('div');
    shade.className = 'shade';
    shade.setAttribute('data-type', 'shade');
    Object.assign(shade.style, {
        color: chroma(shadeColor).luminance() > 0.5 ? 'black' : 'white',
        backgroundColor: shadeColor
    });

    shade.textContent = shadeColor;
    container.appendChild(shade);
}