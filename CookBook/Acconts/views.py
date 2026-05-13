from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .forms import RegisterForm, LoginForm
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from .models import Recipe
import json


User = get_user_model()

def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False  
            user.save()

            token = default_token_generator.make_token(user)

            confirm_url = request.build_absolute_uri(
                reverse("confirm_email", args=[user.pk, token])
            )

            send_mail(
                subject="Подтверждение регистрации",
                message=f"Перейдите по ссылке для подтверждения: {confirm_url}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
            )

            return render(request, "Accounts/html/check_email.html")
    else:
        form = RegisterForm()

    return render(request, "Accounts/html/register.html", {"form": form})

def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST, request=request)

        if form.is_valid():
            user = form.user
            login(request, user)
            return redirect("profile")
    else:
        form = LoginForm()

    return render(request, "Accounts/html/login.html", {"form": form})


def logout_view(request):
    logout(request)
    return redirect("login")


@login_required
def profile_view(request):
    recipes = Recipe.objects.filter(user=request.user)
    return render(request, "Accounts/html/profile.html", {"recipes": recipes})


def confirm_email_view(request, uid, token):
    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return render(request, "Accounts/html/invalid_link.html")

    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return redirect("profile")

    return render(request, "Accounts/html/invalid_link.html")

@login_required
@require_POST
def save_recipe_view(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Неверный формат JSON"}, status=400)

    required_fields = ["title", "time", "steps", "ingredients"]
    if not all(field in data for field in required_fields):
        return JsonResponse({"error": "Не все обязательные поля переданы"}, status=400)

    image_data = data.get("image", "")
    
    # Видаляємо домен та протокол, якщо вони є (http://127.0.0.1:8000/)
    if "http" in image_data:
        image_data = image_data.split("/media/")[-1]
    else:
        # Якщо прийшов відносний шлях /media/recipes/...
        image_data = image_data.replace("/media/", "").lstrip("/")

    recipe = Recipe.objects.create(
        user=request.user,
        title=data["title"],
        time=data["time"],
        steps=data["steps"],
        ingredients=data["ingredients"],
        image=image_data, # Тепер тут буде просто "recipes/Fried_potatoes_with_.jpg"
        comment=data.get("comment", "")
    )

    return JsonResponse({"success": True, "recipe_id": recipe.id})

@login_required
@require_POST
def delete_recipe_view(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id, user=request.user)
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Рецепт не найден"}, status=404)

    if recipe.image:
        recipe.image.delete(save=False)

    recipe.delete()
    return JsonResponse({"success": True, "message": "Рецепт удалён"}) 

@login_required
def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    return render(request, 'Accounts/html/recipe_detail.html', {'recipe': recipe})

@login_required
@require_POST
def update_comment_ajax(request, pk):
    try:
        data = json.loads(request.body)
        recipe = Recipe.objects.get(pk=pk, user=request.user)
        recipe.comment = data.get("comment", "")
        recipe.save()
        return JsonResponse({"success": True})
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Рецепт не знайдено"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)