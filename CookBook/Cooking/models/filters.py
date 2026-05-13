from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Назва категорії")

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100, verbose_name="Назва продукта")
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name="products",   
        verbose_name="Категорія"
    )

    def __str__(self):
        return f"{self.name} ({self.category.name})"