import { autoResize } from "./autoResize.js";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let isSaved = false;

export function initSaveButton() {
    const saveBtn = document.getElementById('saveCommentBtn');
    const commentInput = document.querySelector('.comment-textarea');

    if (commentInput) {
        commentInput.addEventListener('input', autoResize);

        window.addEventListener('resize', () => autoResize.call(commentInput));
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (isSaved) return;

            const btn = this;
            const imgElement = document.getElementById('recipeImage');
            const rawImageSrc = imgElement ? imgElement.getAttribute('src') : '';
            
            const cleanImagePath = rawImageSrc 
                ? rawImageSrc.replace(/^.*\/\/[^\/]+/, '').replace('/media/', '').replace(/^\//, '') 
                : '';
            
            const recipeData = {
                title: document.getElementById('recipeTitle').innerText,
                time: parseInt(document.getElementById('time').innerText.replace(/\D/g, '')),
                image: cleanImagePath,
                comment: commentInput ? commentInput.value : '',
                ingredients: Array.from(document.querySelectorAll('#ingredientsList li')).map(li => li.innerText),
                steps: Array.from(document.querySelectorAll('#recipeSteps li')).map(li => li.innerText)
            };

            btn.innerText = 'Зберігаємо...';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.6';

            fetch("/account/save_recipe/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(recipeData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    isSaved = true;
                    btn.innerText = 'Збережено у профіль';
                    btn.style.background = '#4CAF50';
                    btn.style.opacity = '1';
                } else {
                    isSaved = false;
                    btn.innerText = 'Помилка';
                    btn.style.background = '#f44336';
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = '1';
                    setTimeout(() => {
                        btn.innerText = 'Зберегти рецепт';
                        btn.style.background = '#6fa8dc';
                    }, 2500);
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                isSaved = false;
                btn.innerText = 'Помилка мережі';
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
            });
        });
    }
}

export function resetSaveState() {
    isSaved = false;
    const saveBtn = document.getElementById('saveCommentBtn');
    if (saveBtn) {
        saveBtn.innerText = 'Зберегти рецепт';
        saveBtn.style.background = '#6fa8dc';
        saveBtn.style.pointerEvents = 'auto';
        saveBtn.style.opacity = '1';
    }
}