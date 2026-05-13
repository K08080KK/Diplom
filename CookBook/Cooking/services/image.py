import requests
import os
from django.conf import settings
from urllib.parse import quote

class Images:
    def __init__(self, description):
        self.description = description

    def image(self):
        query = quote(self.description)
        url = f"https://www.googleapis.com/customsearch/v1?q={query}&cx={settings.CX}&searchType=image&key={settings.API_KEY_IMAGES}"
        res = requests.get(url).json()

        if "items" not in res:
            return None 

        for item in res["items"]: 
            image_url = item.get("link")
            try:
                response = requests.get(image_url, timeout=5)
                if (
                    response.status_code == 200
                    and "image" in response.headers.get("Content-Type", "")
                ):

                    filename = f"{self.description[:20].replace(' ', '_')}.jpg"
                    path = os.path.join(settings.MEDIA_ROOT, "recipes", filename)
                    os.makedirs(os.path.dirname(path), exist_ok=True)

                    with open(path, "wb") as f:
                        f.write(response.content)

                    return settings.MEDIA_URL + f"recipes/{filename}"
            except Exception as e:
                continue

        return None  
