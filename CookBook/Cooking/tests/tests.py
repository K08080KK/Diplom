# tests/test_cooking_pipeline_real.py
import unittest
from ..services.translate import Translate
from ..services.cooking import Cooking
import json

class CookingPipelineRealTestCase(unittest.TestCase):
    TEST_INGREDIENTS_UA = [
        "перець, цибуля, часник, томати, баклажан, олія, базилік, сир фета, лимон, куряче філе",
    ]

    def test_translate_and_cooking_pipeline(self):
        for ingredients_ua in self.TEST_INGREDIENTS_UA:
            translator = Translate(ingredients_ua)
            translated_text = translator.translate()
            print("Оригінал:", ingredients_ua)
            print("Переклад:", translated_text)

            cooking = Cooking(ingredients_ua)
            recipe = cooking.generate_recipe()
            
            print("Сгенерований рецепт (JSON):")
            print(json.dumps(recipe, ensure_ascii=False, indent=2))
            print("-" * 50)

            self.assertIn("title", recipe)
            self.assertIn("steps", recipe)
            self.assertIsInstance(recipe["steps"], list)

if __name__ == "__main__":
    unittest.main()
