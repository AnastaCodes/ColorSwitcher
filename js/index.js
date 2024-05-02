import chroma from 'chroma-js';
import '../css/styles.scss';
import {setRandomColors} from './utils/colorUtils.js';
import {getColorsFromHash, updateColorsAfterUserInteraction} from './stateManagement.js';
import {createItem} from './utils/domUtils.js';
import * as  hh from "./utils/eventHandlers.js";

document.addEventListener('DOMContentLoaded', () => {
    const initialColors = getColorsFromHash();

    for (let i = 0; i < initialColors.length; i++) {
        const color = chroma(initialColors[i]);
        createItem(null, color);
    }

    if (initialColors.length === 0) {
        for (let i = 0; i < 5; i++) {
            createItem(null, chroma.random());
        }
    }

    setRandomColors(true);
    updateColorsAfterUserInteraction();

/*
    const colorBox = document.querySelector('.color-box');
    const h2 = colorBox.querySelector('h2');

    function adjustFontSize() {
        const boxWidth = colorBox.offsetWidth;
        const fontSize = Math.max(12, Math.min(24, boxWidth / 10));
        h2.style.fontSize = `${fontSize}px`;
    }
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);

     */
});