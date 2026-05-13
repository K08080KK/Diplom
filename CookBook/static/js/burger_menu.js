document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burgerMenu');
    const nav = document.getElementById('siteNav');
    const overlay = document.getElementById('menuOverlay'); // Новый элемент
    const html = document.documentElement;

    // Функция для переключения (открыть/закрыть)
    function toggleMenu() {
        const isActive = nav.classList.toggle('active');
        burger.classList.toggle('active');
        overlay.classList.toggle('active'); // Включаем/выключаем затемнение
        
        if (isActive) {
            html.classList.add('lock-scroll');
        } else {
            html.classList.remove('lock-scroll');
        }
    }

    // Клик на бургер
    burger.addEventListener('click', toggleMenu);

    // Клик на оверлей (закрытие при нажатии ВНЕ меню)
    overlay.addEventListener('click', toggleMenu);

    // Закрытие при клике на ссылки
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
});