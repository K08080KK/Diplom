import unittest
import os
from django.conf import settings
from Cooking.services.image import *

class ImageGeneratorRealTestCase(unittest.TestCase):
    def test_generate_and_save_real(self):
        prompt = "A delicious plate of spaghetti with tomato sauce, in realistic style"
        filename = "test_real_image.png"
        
        generator = ImageGenerator(prompt=prompt, filename=filename)
        relative_path = generator.generate_and_save()
        
        print("Relative path returned:", relative_path)

        # Проверяем, что файл реально создался
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        self.assertTrue(os.path.exists(file_path))
        print("File saved at:", file_path)

        # Проверяем что возвращаемый путь корректно ведёт к файлу
        expected_path = os.path.join(settings.MEDIA_URL.rstrip("/"), filename)
        self.assertEqual(relative_path, expected_path)

        # Удаляем тестовый файл после проверки
        os.remove(file_path)
        print("Test file removed")

if __name__ == "__main__":
    unittest.main()
