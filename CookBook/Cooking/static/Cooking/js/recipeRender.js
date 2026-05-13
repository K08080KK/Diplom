export function renderRecipe(data) {
    const recipeCard = document.getElementById("recipeCard");
    const recipeTitle = document.getElementById("recipeTitle");
    const recipeImage = document.getElementById("recipeImage");
    const ingredientsList = document.getElementById("ingredientsList");
    const recipeSteps = document.getElementById("recipeSteps");
    const timeCooking = document.getElementById("time");
    const commentSection = document.querySelector(".recipe-comment-section");

    ingredientsList.innerHTML = "";
    recipeSteps.innerHTML = "";
    timeCooking.innerHTML = "";
    recipeTitle.style.color = "";
    
    if (data.title === "Error") {
        recipeTitle.textContent = data.steps[0];
        recipeTitle.style.color = "#e74c3c";
        
        recipeImage.style.display = "none";
        if (commentSection) commentSection.style.display = "none";
        return;
    }
    // Заголовок
    recipeTitle.textContent = data.title;

    // Если сервер отдает ссылку на картинку
    if (data.image) {
        recipeImage.src = data.image;
        recipeImage.style.display = "block";
    } else {
        recipeImage.style.display = "none";
    }

    // Список ингредиентов (если сервер будет их возвращать)
    ingredientsList.innerHTML = "";
    timeCooking.innerHTML = "";
    if(data.time){
        timeCooking.textContent = `Час приготування: ${data.time}хв`;
    }
    if (data.ingredients) {
        data.ingredients.forEach(ing => {
            let cleaned = ing.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

            let formatted = cleaned.replace(/\b\p{L}/gu, char => char.toUpperCase());

            const li = document.createElement("li");
            li.textContent = formatted;
            ingredientsList.appendChild(li);
        });
    }


    // Шаги
    recipeSteps.innerHTML = "";
    data.steps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        recipeSteps.appendChild(li);
    });

    // Показать карточку
    recipeCard.style.display = "block"; // или "block"
}
