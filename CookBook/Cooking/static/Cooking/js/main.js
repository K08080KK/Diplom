import { initCategories, initModals, initCloseModals } from './ingredientSelection.js';
import { initGenerateBtn } from './generateRecipe.js';
import { initSaveButton } from './saveRecipe.js';

document.addEventListener('DOMContentLoaded', () => {
    initCategories();
    initModals();
    initCloseModals();
    initGenerateBtn();
    initSaveButton();
});