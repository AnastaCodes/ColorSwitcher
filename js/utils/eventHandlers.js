import chroma from 'chroma-js';
import {
    setRandomColorForNewItem,
    setRandomColors,
    setTextColor,
    showShades,
    updateColorBox,
    editHexValue,
    createBackdrop
} from "./colorUtils.js";
import {updateColorsAfterUserInteraction} from "../stateManagement.js";
import {copyToClipboard, deleteItem, createItem, insertPlusButtons, deletePlusButtons} from "./domUtils.js";

let draggedItem = null;

document.addEventListener('click', (event) => {

    let type;
    if (event.target.dataset.type) {
        type = event.target.dataset.type;
    } else if (event.target.parentNode && event.target.parentNode.dataset.type) {
        type = event.target.parentNode.dataset.type;
    }
    if (type) {
        switch (type) {
            case 'manual':
                showModal();
                break;
            case 'lock':
                toggleLock(event.target);
                break;
            case 'copy':
                copyToClipboard(event.target.textContent);
                break;
            case 'delete':
                deleteItem(event.target);
                updateUI();
                break;
            case 'add':
                handleAdd(event.target);
                break;
            case 'repeat':
                handleRepeat(event.target);
                break;
            case 'dropper':
                handleDropper(event.target);
                break;
            case 'shades':
                showShades(event.target.closest('.color-box'));
                break;
            case 'hex-value':
                editHexValue(event.target.closest('.color-box'));
                break;
            case 'shade':
                const colorBox = event.target.closest('.color-box');
                let color = event.target.style.backgroundColor;
                color = chroma(color).hex();
                if (colorBox) {
                    updateColorBox(colorBox, color);
                    updateColorsAfterUserInteraction();
                    document.querySelector('#shades-container').remove();
                    document.querySelector('#backdrop').remove();
                }
                break;
        }
    }
});

function toggleLock(target) {
    const node = target.tagName.toLowerCase() === 'i'
        ? target
        : target.children[0];
    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
    //  const isIcon = target.tagName.toLowerCase() === 'i';
    //  const icon = isIcon ? target : target.querySelector('i');
    //  icon.classList.toggle('fa-lock');
    //  icon.classList.toggle('fa-lock-open');
}

function handleAdd(target) {
    const allColorBoxes = document.querySelectorAll('.color-box');
    if (allColorBoxes.length >= 12) {
        return;
    }

    const button = target.tagName === 'BUTTON' ? target : target.parentNode;
    const prevColorBox = button.previousElementSibling;
    const nextColorBox = button.nextElementSibling;

    if (prevColorBox && nextColorBox && prevColorBox.classList.contains('color-box') && nextColorBox.classList.contains('color-box')) {
        const prevColor = chroma(prevColorBox.style.backgroundColor);
        const nextColor = chroma(nextColorBox.style.backgroundColor);
        const averageColor = chroma.mix(prevColor, nextColor, 0.5);

        createItem(button, averageColor);
        updateUI();
    }
}

function adjustFontSize(allColorBoxes, h2) {
    const boxWidth = allColorBoxes[0].offsetWidth;
    const fontSize = Math.max(12, Math.min(24, boxWidth / 10));
    h2.forEach((element) => console.log(element.style.fontSize = `${fontSize}px`));
}

function handleRepeat(target) {
    const colorBox = target.closest('.color-box');
    setRandomColorForNewItem(colorBox);
}

function handleDropper(target) {
    const colorBox = target.closest('.color-box');
    const currentColor = colorBox.style.backgroundColor;
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.style.display = 'none';
    colorPicker.value = chroma(currentColor).hex();

    colorPicker.addEventListener('input', (e) => {
        const selectedColor = e.target.value;
        colorBox.style.backgroundColor = selectedColor;
        const text = colorBox.querySelector('h2');
        text.textContent = chroma(selectedColor).hex();
        setTextColor(text, selectedColor);
    });

    colorPicker.addEventListener('change', () => {
        updateColorsAfterUserInteraction();
    });

    document.body.appendChild(colorPicker);
    colorPicker.click();
    document.body.removeChild(colorPicker);
}

export function updateUI() {
    const allColorBoxes = document.querySelectorAll('.color-box');
    const h2 = document.querySelectorAll('h2');
    adjustFontSize(allColorBoxes, h2);
    document.querySelectorAll('button[data-type="add"]').forEach(button => button.remove());
    insertPlusButtons();

    if (allColorBoxes.length < 12) {
        insertPlusButtons();
    }
    if (allColorBoxes.length >= 12) {
        deletePlusButtons()
    }
    if (allColorBoxes.length < 3) {
        document.querySelectorAll('button[data-type="delete"]').forEach(button => button.remove());
    }
    setTimeout(() => updateColorsAfterUserInteraction(), 0);

}

function showModal() {
    const modal = document.querySelector(".modal-content");
    const closeBtn = modal.querySelector(".close");
    const backdrop = createBackdrop();
    document.body.appendChild(backdrop);
    backdrop.appendChild(modal);
    modal.style.display = "block";

    function removeModal(event) {
        event.stopPropagation();
        backdrop.remove();
        modal.style.display = "none";
        document.body.appendChild(modal);
    }

    backdrop.addEventListener('click', removeModal);
    closeBtn.addEventListener('click', removeModal);
    modal.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

document.body.addEventListener('dragstart', event => {
    if (event.target.classList.contains('color-box')) {
        draggedItem = event.target;
    }
});

document.body.addEventListener('dragover', event => {
    event.preventDefault();
    const target = event.target.closest('.color-box');
    if (target && draggedItem !== target) {
        const allBoxes = Array.from(document.querySelectorAll('.color-box'));
        const draggedIndex = allBoxes.indexOf(draggedItem);
        const targetIndex = allBoxes.indexOf(target);
        if (draggedIndex < targetIndex) {
            target.after(draggedItem);
        } else {
            target.before(draggedItem);
        }
    }
});

document.body.addEventListener('dragend', () => {
    updateColorsAfterUserInteraction();
    draggedItem = null;
    updateUI();
});

document.addEventListener('keydown', event => {
    if (event.code.toLowerCase() === 'space') {
        event.preventDefault();
        setRandomColors();
    }
});

