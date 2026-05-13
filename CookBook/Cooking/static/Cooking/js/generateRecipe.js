import { selectedIngredients } from './ingredientSelection.js';
import { renderRecipe } from "./recipeRender.js";
import { resetSaveState } from "./saveRecipe.js";
import { autoResize } from "./autoResize.js";

function autoScroll(){
    requestAnimationFrame(() => {
        const offset = 20;
        const elementPosition = recipeCard.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
}

export function initGenerateBtn() {
    const generateBtn = document.getElementById('generateBtn');
    const loader = document.getElementById('loader');
    const commentInput = document.querySelector('.comment-textarea');

    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
        const inputVal = document.getElementById('ingredients').value.trim();
        const selectedFromFilters = Object.values(selectedIngredients).flat();
        resetSaveState();
        let allIngredients = [];
        if (inputVal) {
            allIngredients = inputVal.split(',').map(i => i.trim()).filter(i => i);
        }
        allIngredients = [...new Set([...allIngredients, ...selectedFromFilters])];

        const ingredientsStr = allIngredients.join(', ');
        
        loader.style.display = 'flex';

        document.getElementById('recipeCard').style.display = 'none';

        autoScroll();

        fetch('/generate-recipe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ ingredients: ingredientsStr })
        })
        .then(res => res.json())
        .then(data => {
            loader.style.display = 'none';
            renderRecipe(data); 
            document.getElementById('recipeCard').style.display = 'block';
            autoScroll();

            if (data.title === "Error") {
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
                
                return;
            }

            if (commentInput) {
                autoResize.call(commentInput);
            }
            
        })
        .catch(err => {
            console.error(err);
            loader.style.display = 'none';
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}