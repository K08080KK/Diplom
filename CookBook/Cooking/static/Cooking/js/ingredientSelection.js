export const selectedIngredients = {};

export function initCategories() {
    document.querySelectorAll('.ingredient-category').forEach(cat => {
        selectedIngredients[cat.dataset.category] = [];
    });
}

export function initModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            const target = e.target.closest('div');
            if (!target) return;

            const catId = modal.id.replace('modal-', '');
            const category = document.querySelector(`.ingredient-category[data-category-id="${catId}"]`).dataset.category;
            const arr = selectedIngredients[category];

            const productName = target.innerText.replace('✔', '').trim();
            const check = target.querySelector('.selected-check');

            if (check) {
                check.remove();
                const index = arr.indexOf(productName);
                if (index > -1) arr.splice(index, 1);
            } else {
                const span = document.createElement('span');
                span.className = 'selected-check';
                span.innerText = '✔ ';
                span.style.color = '#6fa8dc';
                target.prepend(span);
                if (!arr.includes(productName)) arr.push(productName);
            }
        });
    });
}

export function initCloseModals() {
    document.addEventListener('click', e => {
        if (!e.target.closest('.ingredient-category') && !e.target.closest('.modal')) {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
            document.querySelectorAll('.ingredient-category').forEach(c => c.classList.remove('ingredient-active'));
        }
    });
}
