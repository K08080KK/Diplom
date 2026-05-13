from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Category, Product
from .services.cooking import *
from .services.translate import *
from .services.image import *

def CookingBD(request):
    categories = Category.objects.prefetch_related('products').all()
    return render(request, 'Cooking/html/index.html', {'categories': categories})  

def generate_recipe_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            ingredients = data.get('ingredients', '')
            ingredients_list = [i.strip() for i in ingredients.split(',') if i.strip()]

            recipe = Cooking(ingredients_list).generate_recipe()

            title = recipe.get("title")
            translation = Translate(title).translate()
            image = Images(translation).image()  
            
            recipe["image"] = image 
            recipe["ingredients"] = ingredients_list

            return JsonResponse(recipe)
        except json.JSONDecodeError:
            return JsonResponse(
                {"status": "error", "message": "Некоректний JSON"},
                status=400
            )
    else:
        return JsonResponse(
            {"status": "error", "message": "Тільки POST метод дозволений"},
            status=405
        )