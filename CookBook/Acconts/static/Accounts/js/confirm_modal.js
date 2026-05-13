function customConfirm(message) {
    return new Promise((resolve) => {
        // Создаем элементы
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        overlay.innerHTML = `
            <div class="custom-confirm-modal">
                <h2>Підтвердження</h2>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button class="modal-btn btn-cancel" id="confirmCancel">Скасувати</button>
                    <button class="modal-btn btn-confirm" id="confirmOk">Видалити</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Анимация появления
        setTimeout(() => overlay.classList.add('active'), 10);

        // Функция закрытия
        const close = (result) => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                resolve(result);
            }, 300);
        };

        // Обработчики кликов
        overlay.querySelector('#confirmOk').onclick = () => close(true);
        overlay.querySelector('#confirmCancel').onclick = () => close(false);
        
        // Закрытие при клике на фон
        overlay.onclick = (e) => {
            if (e.target === overlay) close(false);
        };
    });
}