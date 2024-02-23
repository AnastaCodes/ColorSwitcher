const mainBox = document.querySelector('#main-box')
let boxNumber = 5
let count = 5
for (let i = 0; i < boxNumber; i++) {
    createItem();
    count = 5
}


document.addEventListener('keydown', event => {
    event.preventDefault()
    if (event.code.toLowerCase() === 'space') {
        setRandomColors()
    }
})

document.addEventListener('click', (event) => {
    const type = event.target.dataset.type
    console.log(type)

    if (type === 'lock') {
        const node = event.target.tagName.toLowerCase() === 'i'
            ? event.target
            : event.target.children[0]
        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {
        copyToClipboard(event.target.textContent)
    } else if (type === 'delete') {

        deleteItem(event.target)
        count--
        if (count < 3) {
            const deleteButtons = document.querySelectorAll('button[data-type="delete"]');
            deleteButtons.forEach(button => {
                button.remove();
            });

        }

    } else if (type === 'add') {
        if (count > 12) {
            alert("Hello! COUNT < 13");
        } else {
            createItem()
            count++
        }

        //  setRandomColors()
    }

})

function createItem() {
    const colorBox = document.createElement('div');
    const buttonsBox = document.createElement('div');
    const header = document.createElement('h2');
    const lockButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const drugButton = document.createElement('button');
    const copyButton = document.createElement('button');
    const viewShadesButton = document.createElement('button');
    const checkContrastButton = document.createElement('button');
    const colorName = document.createElement('button');
    const lockIcon = document.createElement('i');
    const deleteIcon = document.createElement('i');
    const drugIcon = document.createElement('i');
    const copyIcon = document.createElement('i');
    const viewShadesIcon = document.createElement('i');
    const checkContrastIcon = document.createElement('i');

    colorBox.className = 'color-box';
    buttonsBox.className = 'button-box';
    lockIcon.className = 'fa-solid fa-lock-open'
    deleteIcon.className = 'fa-solid fa-xmark'
    drugIcon.className = 'fa-solid fa-arrows-left-right'
    copyIcon.className = 'fa-regular fa-copy'
    viewShadesIcon.className = 'fa-solid fa-layer-group'
    checkContrastIcon.className = 'fa-solid fa-circle-half-stroke'

    header.setAttribute('data-type', 'copy');
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
    checkContrastButton.setAttribute('data-type', 'contrast');
    checkContrastIcon.setAttribute('data-type', 'contrast');

    lockButton.appendChild(lockIcon);
    deleteButton.appendChild(deleteIcon);
    drugButton.appendChild(drugIcon);
    copyButton.appendChild(copyIcon);
    viewShadesButton.appendChild(viewShadesIcon);
    checkContrastButton.appendChild(checkContrastIcon);

    buttonsBox.appendChild(lockButton);
    buttonsBox.appendChild(deleteButton);
    buttonsBox.appendChild(drugButton);
    buttonsBox.appendChild(copyButton);
    buttonsBox.appendChild(viewShadesButton);
    buttonsBox.appendChild(checkContrastButton);
    colorBox.appendChild(buttonsBox);
    colorBox.appendChild(header);
    setRandomColorForNewItem(colorBox);

    mainBox.appendChild(colorBox)
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

setRandomColors(true)

