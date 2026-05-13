document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ingredient-category').forEach(cat => {
        cat.addEventListener('click', () => {
            const modalId = 'modal-' + cat.dataset.categoryId;
            const modal = document.getElementById(modalId);

            // Закрываем все остальные модалки
            document.querySelectorAll('.modal').forEach(m => {
                if (m !== modal) m.style.display = 'none';
            });

            // Управление активной категорией
            document.querySelectorAll('.ingredient-category').forEach(c => {
                if (c !== cat) c.classList.remove('ingredient-active');
            });
            cat.classList.toggle('ingredient-active');

            // Если уже открыта, закрываем
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                return;
            }

            // Позиционируем модалку под категорией
            const rect = cat.getBoundingClientRect();
            modal.style.position = 'absolute';
            modal.style.top = window.scrollY + rect.bottom + 'px';
            modal.style.left = rect.left + 'px';
            modal.style.width = rect.width + 'px';
            modal.style.display = 'block';
        });
    });
});
