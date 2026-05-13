document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveCommentBtn');
    const commentInput = document.querySelector('.comment-textarea'); // Ищем по классу

    function autoResize() {
        const startScroll = window.scrollY;
        const startHeight = this.offsetHeight;

        requestAnimationFrame(() => {
            const originalTransition = this.style.transition;
            this.style.transition = 'none'; 

            this.style.setProperty('height', '45px', 'important');
            this.style.setProperty('min-height', '45px', 'important');

            const currentScrollHeight = this.scrollHeight;
            let finalHeightValue;

            if (!this.value.trim() || currentScrollHeight <= 45) { 
                finalHeightValue = 45;
            } else {
                finalHeightValue = currentScrollHeight;
            }

            const finalHeightStr = finalHeightValue + 'px';
            this.style.setProperty('height', finalHeightStr, 'important');
            this.style.setProperty('min-height', finalHeightStr, 'important');

            if (finalHeightValue > startHeight) {
                const diff = finalHeightValue - startHeight;
                window.scrollTo(0, startScroll + diff);
            } else {
                window.scrollTo(0, startScroll);
            }

            setTimeout(() => {
                this.style.transition = originalTransition;
            }, 0);
        });
    }

    if (commentInput) {
        commentInput.addEventListener('input', autoResize);

        window.addEventListener('load', () => {
            setTimeout(() => {
                autoResize.call(commentInput);
            }, 150);
        });

        window.addEventListener('resize', () => autoResize.call(commentInput));
    }
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const recipeId = this.getAttribute('data-recipe-id');
            const commentValue = commentInput.value;
            const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
            
            if (!csrfInput) return alert("CSRF токен не знайдено!");

            this.innerText = '...';
            this.style.pointerEvents = 'none';

            fetch(`/account/recipe/update_comment/${recipeId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfInput.value
                },
                body: JSON.stringify({ comment: commentValue })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.innerText = 'Збережено!';
                    this.style.background = '#4CAF50';
                    setTimeout(() => {
                        this.innerText = 'Зберегти';
                        this.style.background = '#6fa8dc';
                        this.style.pointerEvents = 'auto';
                    }, 2000);
                }
            })
            .catch(() => {
                alert("Помилка при з'єднанні");
                this.innerText = 'Зберегти';
                this.style.pointerEvents = 'auto';
            });
        });
    }
});