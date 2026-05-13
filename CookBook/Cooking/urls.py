from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('', CookingBD, name='Cooking'),
    path('generate-recipe/', generate_recipe_view, name='generate_recipe'),
]