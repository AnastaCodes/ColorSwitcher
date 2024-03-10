const mainBox = document.querySelector('#main-box');
const initialColors = getColorsFromHash();
let count = initialColors.length > 0 ? initialColors.length : 5;

for (let i = 0; i < count; i++) {
    createItem();
}

document.addEventListener('dragend', updateColorsAfterUserInteraction);

document.addEventListener('keydown', event => {
    event.preventDefault()
    if (event.code.toLowerCase() === 'space') {
        setRandomColors()
        setMenuButtonColor()
    }
})

document.addEventListener('mousedown', (event) => {
    if (event.target.dataset.type === 'drug') {
        let parentBox = event.target.closest('.color-box');
        if (parentBox) {
            parentBox.setAttribute('draggable', 'true');
            parentBox.addEventListener('dragstart', dragstartHandler);
            parentBox.addEventListener('dragend', dragendHandler);
        }
    }
});

document.addEventListener('mouseup', () => {
    const draggableItems = document.querySelectorAll('.color-box[draggable="true"]');
    draggableItems.forEach(item => {
        item.removeAttribute('draggable');
        item.removeEventListener('dragstart', dragstartHandler);
        item.removeEventListener('dragend', dragendHandler);
    });
});

document.addEventListener('dragover', (event) => {
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

document.addEventListener('click', (event) => {
    //const type = event.target.dataset.type
    const type = event.target.dataset.type || event.target.parentNode.dataset.type;

    if (type === 'lock') {
        const node = event.target.tagName.toLowerCase() === 'i'
            ? event.target
            : event.target.children[0]
        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {
        copyToClipboard(event.target.textContent)

    } else if (type === 'delete') {
        deleteItem(event.target);
        count--;
        setTimeout(() => updateColorsAfterUserInteraction(), 0);
        if (count < 12) {
            document.querySelectorAll('button[data-type="add"]').forEach(button => button.remove());
            insertPlusButtons();
        }

        if (count < 3) {
            const deleteButtons = document.querySelectorAll('button[data-type="delete"]');
            deleteButtons.forEach(button => button.remove());
        }
    } else if (type === 'add') {
        if (count >= 12) {
            document.querySelectorAll('button[data-type="add"]').forEach(button => {
                button.remove();
            });
            return;
        }

        const button = event.target.tagName === 'BUTTON' ? event.target : event.target.parentNode;
        const prevColorBox = button.previousElementSibling;
        const nextColorBox = button.nextElementSibling;

        if (prevColorBox && nextColorBox && prevColorBox.classList.contains('color-box') && nextColorBox.classList.contains('color-box')) {
            const prevColor = chroma(prevColorBox.style.backgroundColor);
            const nextColor = chroma(nextColorBox.style.backgroundColor);
            const averageColor = chroma.mix(prevColor, nextColor, 0.5);

            createItem(button, averageColor);
            count++;
            setTimeout(() => updateColorsAfterUserInteraction(), 0);
            if (count >= 12) {
                document.querySelectorAll('button[data-type="add"]').forEach(button => {
                    button.remove();
                });
            }
        }
    } else if (type === 'repeat') {
        const colorBox = event.target.closest('.color-box');

        setRandomColorForNewItem(colorBox)
        setTimeout(() => updateColorsAfterUserInteraction(), 0);
    } else if (type === 'menu') {
        const navigation = document.querySelector('.blur-overlay');
        navigation.style.opacity = '1';
        navigation.style.top = '0';
    } else if (type === 'dropper') {
        const colorBox = event.target.closest('.color-box');
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
    } else if (type === 'shades') {
        showShades(event.target.closest('.color-box'));
    } else if (type === 'edit-color') {

    }

})

function createItem(insertAfterButton, color = chroma.random()) {
    const colorBox = document.createElement('div');
    const buttonsBox = document.createElement('div');
    const header = document.createElement('h2');
    const lockButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const drugButton = document.createElement('button');
    const copyButton = document.createElement('button');
    const viewShadesButton = document.createElement('button');
    const checkDropperButton = document.createElement('button');
    const repeatButton = document.createElement('button');

    const colorName = document.createElement('button');

    const lockIcon = document.createElement('i');
    const deleteIcon = document.createElement('i');
    const drugIcon = document.createElement('i');
    const copyIcon = document.createElement('i');
    const viewShadesIcon = document.createElement('i');
    const checkDropperIcon = document.createElement('i');
    const repeatIcon = document.createElement('i');

    colorBox.className = 'color-box';
    buttonsBox.className = 'button-box';
    lockIcon.className = 'fa-solid fa-lock-open'
    deleteIcon.className = 'fa-solid fa-xmark'
    drugIcon.className = 'fa-solid fa-arrows-left-right'
    copyIcon.className = 'fa-regular fa-copy'
    viewShadesIcon.className = 'fa-solid fa-layer-group'
    checkDropperIcon.className = 'fa-solid fa-eye-dropper'
    repeatIcon.className = 'fa-solid fa-arrow-rotate-right'

    header.setAttribute('data-type', 'edit-color');
    lockButton.setAttribute('data-type', 'lock');
    lockIcon.setAttribute('data-type', 'lock');
    deleteButton.setAttribute('data-type', 'delete');
    deleteIcon.setAttribute('data-type', 'delete');
    drugButton.setAttribute('data-type', 'drug');
    drugIcon.setAttribute('data-type', 'drug');
    copyButton.setAttribute('data-type', 'copy');
    copyIcon.setAttribute('data-type', 'copy');
    viewShadesButton.setAttribute('data-type', 'shades');
    viewShadesIcon.setAttribute('data-type', 'shades');
    checkDropperButton.setAttribute('data-type', 'dropper');
    checkDropperIcon.setAttribute('data-type', 'dropper');
    repeatButton.setAttribute('data-type', 'repeat');
    repeatIcon.setAttribute('data-type', 'repeat');

    lockButton.appendChild(lockIcon);
    deleteButton.appendChild(deleteIcon);
    drugButton.appendChild(drugIcon);
    copyButton.appendChild(copyIcon);
    viewShadesButton.appendChild(viewShadesIcon);
    checkDropperButton.appendChild(checkDropperIcon);
    repeatButton.appendChild(repeatIcon);

    buttonsBox.appendChild(lockButton);
    buttonsBox.appendChild(deleteButton);
    buttonsBox.appendChild(drugButton);
    buttonsBox.appendChild(copyButton);
    buttonsBox.appendChild(viewShadesButton);
    buttonsBox.appendChild(checkDropperButton);
    buttonsBox.appendChild(repeatButton);

    colorBox.appendChild(buttonsBox);
    colorBox.appendChild(header);
    colorBox.setAttribute('draggable', 'true');

    colorBox.style.background = color.css();
    header.textContent = color.hex();

    if (insertAfterButton) {
        insertAfterButton.parentNode.insertBefore(colorBox, insertAfterButton.nextSibling);
    } else {
        mainBox.appendChild(colorBox);
    }

    insertPlusButtons();
}

function createPlusButtons() {
    const plusButton = document.createElement('button');
    const plusIcon = document.createElement('i');
    plusIcon.className = 'fa-solid fa-plus'
    plusButton.setAttribute('data-type', 'add');
    plusIcon.setAttribute('data-type', 'add');
    plusButton.appendChild(plusIcon);

    return plusButton;
}

function insertPlusButtons() {
    document.querySelectorAll('button[data-type="add"]').forEach(button => button.remove());

    const colorBoxes = document.querySelectorAll('.color-box');

    colorBoxes.forEach((box, index) => {
        if (index < colorBoxes.length - 1) {
            const plusButton = createPlusButtons();
            box.parentNode.insertBefore(plusButton, box.nextSibling);
        }
    });
}


function setRandomColorForNewItem(newItem) {
    const color = chroma.random();
    const text = newItem.querySelector('h2');
    let buttons = newItem.querySelectorAll('button');

    text.textContent = color;
    newItem.style.background = color;
    setTextColor(text, color);
    buttons.forEach((button) => {
        setTextColor(button, color);
    });
}


function deleteItem(item) {
    const closestDiv = item.closest('.color-box');
    closestDiv.remove()
}

function copyToClipboard(text) {
    return navigator.clipboard.writeText(text)
}


function getColorsFromHash() {
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1)
            .split('-')
            .map((color) => '#' + color)
    }

    return []
}

function updateColorsHash(colors = []) {
    document.location.hash = colors
        .map((col) => {
            return col.toString().substring(1)
        }).join('-')

}

function updateColorsAfterUserInteraction() {
    const colors = Array.from(document.querySelectorAll('.color-box')).map(box => box.querySelector('h2').textContent);
    updateColorsHash(colors);

    /*
    const colors = Array.from(document.querySelectorAll('.color-box')).map(box => {
        const input = box.querySelector('input[type="text"]');
        if (input) return input.value;
        const header = box.querySelector('h2');
        return header ? header.textContent : '';
    });*/
    updateColorsHash(colors);
}

function setRandomColors(isInitial) {
    const cols = document.querySelectorAll('.color-box')
    const colors = isInitial ? getColorsFromHash() : []
    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        const text = col.querySelector('h2')

        let buttons = col.querySelectorAll('button');

        if (isLocked) {
            colors.push(text.textContent)
            return
        }

        const color = isInitial
            ? colors[index]
                ? colors[index]
                : chroma.random()
            : chroma.random()

        if (!isInitial) {
            colors.push(color)
        }

        text.textContent = color
        col.style.background = color
        setTextColor(text, color)
        buttons.forEach((button) => {
            setTextColor(button, color);
        });
    })
    updateColorsHash(colors)
}

function setTextColor(text, color) {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

function setMenuButtonColor() {
    const colorBoxes = document.querySelectorAll('.color-box');
    const lastColorBox = colorBoxes[colorBoxes.length - 1];
    const backgroundColor = window.getComputedStyle(lastColorBox, null).getPropertyValue('background-color');
    const button = document.querySelector('.menu button');

    button.style.color = backgroundColor;
}

function dragstartHandler(event) {
    draggedItem = event.target;
    document.querySelectorAll('button[data-type="add"]').forEach(btn => btn.style.display = 'none');
    event.target.classList.add("dragging");
}


function dragendHandler(event) {
    document.querySelectorAll('button[data-type="add"]').forEach(btn => btn.style.display = '');
    event.target.classList.remove("dragging");
    insertPlusButtons();
}

function showShades(colorBox) {
    const color = chroma(colorBox.style.backgroundColor);
    const shadesContainer = document.createElement('div');
    shadesContainer.style.position = 'absolute';
    shadesContainer.style.width = '100%';
    shadesContainer.style.height = '100%';
    shadesContainer.style.zIndex = '10';
    shadesContainer.style.display = 'flex';
    shadesContainer.style.flexDirection = 'column';
    shadesContainer.style.top = '0';
    shadesContainer.style.left = '0';
    shadesContainer.style.overflow = 'auto';

    const totalShades = 25;
    for (let i = 0; i < totalShades; i++) {
        const shade = document.createElement('div');
        shade.style.flexGrow = '1';
        shade.style.display = 'flex';
        shade.style.alignItems = 'center';
        shade.style.justifyContent = 'flex-end';
        shade.style.paddingRight = '10px';
        shade.style.fontSize = '12px';

        let shadeColor;
        if (i < totalShades / 2) {
            const darkness = (totalShades / 2 - i) / (totalShades / 2);
            shadeColor = chroma.mix(color, 'black', darkness).hex();
        } else {
            const lightness = (i - totalShades / 2) / (totalShades / 2);
            shadeColor = chroma.mix(color, 'white', lightness).hex();
        }
        shade.style.backgroundColor = shadeColor;

        shade.textContent = shadeColor;
        shade.style.color = chroma(shadeColor).luminance() > 0.5 ? 'black' : 'white';

        shade.addEventListener('click', function () {
            colorBox.style.backgroundColor = this.style.backgroundColor;
            let text = colorBox.querySelector('h2').textContent = this.textContent;
            shadesContainer.remove();
            setTextColor(text, color)
            let buttons = colorBox.querySelectorAll('button');

            buttons.forEach((button) => {
                setTextColor(button, color);
            });
            updateColorsAfterUserInteraction();
        });

        shadesContainer.prepend(shade);
    }

    colorBox.appendChild(shadesContainer);
}

setRandomColors(true)
updateColorsAfterUserInteraction()
setMenuButtonColor()

