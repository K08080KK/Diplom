document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".delete-btn");

  stars.forEach((star) => {
    star.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const targetToRemove = star.closest(".recipe-card-link"); 
      const recipeCard = star.closest(".recipe-card-small");
      
      if (!targetToRemove) return;

      const recipeId = recipeCard.dataset.recipeId;
      if (!recipeId) return;

      // --- ИСПОЛЬЗУЕМ НОВУЮ МОДАЛКУ ВМЕСТО CONFIRM ---
      const confirmed = await customConfirm("Ви впевнені, що хочете видалити цей рецепт з вашого профілю?");
      if (!confirmed) return; 
      // -----------------------------------------------

      try {
          const response = await fetch(`/account/recipe/delete/${recipeId}/`, {
              method: "POST",
              headers: { "X-CSRFToken": getCookie("csrftoken") },
          });

          if (response.ok) {
              const data = await response.json();
              if (data.success) {
                  targetToRemove.classList.add('removing');
                  setTimeout(() => {
                      targetToRemove.remove();
                      const remaining = document.querySelectorAll('.recipe-card-link');
                      if (remaining.length === 0) {
                          location.reload();
                      }
                  }, 400);
              }
          }
      } catch (error) {
          console.error("Помилка:", error);
      }
    });
  });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}