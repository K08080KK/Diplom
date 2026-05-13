import json
import google.generativeai as genai
from django.conf import settings
import re

class Cooking:
    def __init__(self, ingredients):
        genai.configure(api_key=settings.API_KEY)
        self.ingredients = ingredients
        self.model = genai.GenerativeModel("gemini-2.5-flash-lite")
    
    def generate_recipe(self):
        prompt = f"""
        Ви професійний шеф-кухар. У вас є такі інгредієнти: {self.ingredients}.
        Створіть рецепт, використовуючи ТІЛЬКИ ці інгредієнти. 
        Прописуйте детально всі кроки(час приготування, кількість інгредієнтів(скільки грамів чи мілілітрів), пропорції), 
        щоб кожен міг приготувати за ними.

        Поверніть строго валідний JSON у такому форматі. Не додавайте жодного додаткового тексту чи пояснень:

        {{
          "title": "Назва рецепту",
          "time": "Загальний час приготування в хвилинах",
          "steps": [
            "Опис кроку 1",
            "Опис кроку 2",
            "Опис кроку 3"
          ]
        }}

        Якщо не можете створити рецепт, поверніть JSON з title "Error" і текстом "Не вдалося приготувати:(".
        """

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            cleaned = re.sub(r'^```json\s*|\s*```$', '', response_text, flags=re.MULTILINE).strip()

            if not cleaned:
                return {"title": "Error", "steps": ["Empty response from API"]}

            recipe = json.loads(cleaned)
            return recipe

        except json.JSONDecodeError as e:
            return {"title": "Error", "steps": [f"Invalid JSON: {str(e)}", f"Raw response: {response.text}"]}

        except Exception as e:
            return {"title": "Error", "steps": [str(e)]}