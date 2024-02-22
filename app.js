const mainBox = document.querySelector('#main-box')
let boxNumber = 7

for (let i = 0; i < boxNumber; i++) {
    createItem();
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
    } else if (type === 'add') {
        createItem()
        //  setRandomColors()
    }

})

function createItem() {
    const colorBox = document.createElement('div');
    const header = document.createElement('h2');
    const lockButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const lockIcon = document.createElement('i');
    const deleteIcon = document.createElement('i');


    colorBox.className = 'color-box';
    lockIcon.className = 'fa-solid fa-lock-open'
    deleteIcon.className = 'fa-solid fa-xmark'

    header.setAttribute('data-type', 'copy');
    lockButton.setAttribute('data-type', 'lock');
    lockIcon.setAttribute('data-type', 'lock');
    deleteButton.setAttribute('data-type', 'delete');
    deleteIcon.setAttribute('data-type', 'delete');

    lockButton.appendChild(lockIcon);
    deleteButton.appendChild(deleteIcon);
    colorBox.appendChild(header);
    colorBox.appendChild(lockButton);
    colorBox.appendChild(deleteButton);

    setRandomColorForNewItem(colorBox);

    mainBox.appendChild(colorBox)
}

function setRandomColorForNewItem(newItem) {
    const color = chroma.random();
    const text = newItem.querySelector('h2');
    const button = newItem.querySelector('button');

    text.textContent = color;
    newItem.style.background = color;
    setTextColor(text, color);
    setTextColor(button, color);
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

        const button = col.querySelector('button')
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
        setTextColor(button, color)
    })
    updateColorsHash(colors)
}

function setTextColor(text, color) {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

setRandomColors(true)

