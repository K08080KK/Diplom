import google.generativeai as genai
from django.conf import settings

class Translate:
    def __init__(self, text, target_lang = "English"):
        genai.configure(api_key=settings.API_KEY)
        self.text = text
        self.model = genai.GenerativeModel("gemini-2.5-flash-lite")
        self.target_lang = target_lang

    def translate(self):
        prompt = f"Translate the following ingredients into {self.target_lang} in a single line, separated by commas. Do not include the original words or any extra text: {self.text}"

        response = self.model.generate_content(prompt)
        return response.text