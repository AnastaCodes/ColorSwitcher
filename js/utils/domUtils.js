import chroma from 'chroma-js';
import {updateColorsAfterUserInteraction} from "../stateManagement.js";

function createIconButton(iconClass, buttonType) {
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.className = iconClass;
    button.appendChild(icon);
    button.setAttribute('data-type', buttonType);
    return button;
}

export function createItem(insertAfterButton, color) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';

    const chromaColor = (typeof color === 'string') ? chroma(color) : color;

    colorBox.style.background = chromaColor.hex();
    colorBox.setAttribute('draggable', 'true');

    const buttonsBox = document.createElement('div');
    buttonsBox.className = 'button-box';

    const buttonConfigs = [
        {iconClass: 'fa-solid fa-lock-open', type: 'lock'},
        {iconClass: 'fa-solid fa-xmark', type: 'delete'},
        {iconClass: 'fa-solid fa-arrows-left-right', type: 'drug'},
        {iconClass: 'fa-regular fa-copy', type: 'copy'},
        {iconClass: 'fa-solid fa-layer-group', type: 'shades'},
        {iconClass: 'fa-solid fa-eye-dropper', type: 'dropper'},
        {iconClass: 'fa-solid fa-arrow-rotate-right', type: 'repeat'}
    ];

    buttonConfigs.forEach(({iconClass, type}) => {
        const button = createIconButton(iconClass, type);
        buttonsBox.appendChild(button);
    });

    const header = document.createElement('h2');
    header.textContent = color.hex();
    header.setAttribute('data-type', 'hex-value');
    colorBox.appendChild(buttonsBox);
    colorBox.appendChild(header);

    // Deciding where to insert the new color box
    if (insertAfterButton) {
        insertAfterButton.parentNode.insertBefore(colorBox, insertAfterButton.nextSibling);
    } else {
        document.querySelector('#main-box').appendChild(colorBox);
    }

    insertPlusButtons();
    updateColorsAfterUserInteraction()
}

export function createPlusButtons() {
    return createIconButton('fa-solid fa-plus', 'add');
}

export function insertPlusButtons() {
    document.querySelectorAll('button[data-type="add"]').forEach(button => button.remove());

    const colorBoxes = document.querySelectorAll('.color-box');
    colorBoxes.forEach((box, index) => {
        if (index < colorBoxes.length - 1) {
            const plusButton = createIconButton('fa-solid fa-plus', 'add');
            box.parentNode.insertBefore(plusButton, box.nextSibling);
        }
    });
}

export function deletePlusButtons() {
    document.querySelectorAll('button[data-type="add"]').forEach(button => button.remove());
}

export function deleteItem(item) {
    const closestDiv = item.closest('.color-box');
    closestDiv.remove();
    updateColorsAfterUserInteraction()
}

export function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}
