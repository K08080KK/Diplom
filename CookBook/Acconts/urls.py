from django.urls import path
from .views import *

urlpatterns = [
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("profile/", profile_view, name="profile"),
    path("confirm/<int:uid>/<str:token>/", confirm_email_view, name="confirm_email"),
    path("save_recipe/", save_recipe_view, name="save_recipe"),
    path("recipe/delete/<int:recipe_id>/", delete_recipe_view, name="delete_recipe"),
    path('recipe/<int:pk>/', recipe_detail, name='recipe_detail'),
    path("recipe/update_comment/<int:pk>/", update_comment_ajax, name="update_comment"),
]
