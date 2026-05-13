import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Recipe

User = get_user_model()

class RecipeSaveTest(TestCase):
    def setUp(self):
        # 1. Створюємо тестового користувача
        self.email = "romantestcookbook@gmail.com"
        self.password = "admin"
        self.user = User.objects.create_user(
            email=self.email,
            password=self.password
        )
        self.client = Client()

    def test_save_recipe_integrity(self):
        """Перевірка збереження рецепта залогіненим користувачем"""
        
        # 2. Логінимось
        login_success = self.client.login(email=self.email, password=self.password)
        self.assertTrue(login_success, "Не вдалося залогінитись у тесті")

        # 3. Підготовка статичних даних (без API)
        url = reverse('save_recipe')
        payload = {
            "title": "Тестова страва",
            "time": 30,
            "steps": ["Порізати", "Пожарити"],
            "ingredients": ["Картопля", "Олія"],
            "image": "http://127.0.0.1:8000/media/recipes/test.jpg",
            "comment": "Мій тестовий коментар"
        }

        # 4. Виконуємо запит
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type='application/json'
        )

        # 5. Перевірка результату
        print(f"\nСтатус відповіді: {response.status_code}")
        if response.status_code == 500:
            print("❌ ПОМИЛКА: Сервер повернув 500 (можливо, той самий FOREIGN KEY constraint failed)")
        
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertTrue(data.get("success"))
        
        # 6. Перевірка, чи з'явився запис у БД
        recipe_exists = Recipe.objects.filter(title="Тестова страва", user=self.user).exists()
        self.assertTrue(recipe_exists, "Рецепт не було фактично створено в БД")
        print("✅ Тест пройдено: Рецепт успішно збережено в БД!")