import chroma from 'chroma-js';

import { setRandomColors, setMenuButtonColor } from './utils/colorUtils.js';
import { getColorsFromHash, updateColorsAfterUserInteraction } from './stateManagement.js';
import { createItem } from './utils/domUtils.js';
import * as  hh from "./utils/eventHandlers.js";

document.addEventListener('DOMContentLoaded', () => {
    const initialColors = getColorsFromHash();

    for (let i = 0; i < initialColors.length; i++) {
        const color = chroma(initialColors[i]);
        createItem(null, color);
    }

    if(initialColors.length === 0) {
        for (let i = 0; i < 5; i++) {
            createItem(null, chroma.random());
        }
    }

    setRandomColors(true);
    updateColorsAfterUserInteraction();
    setMenuButtonColor();
});


