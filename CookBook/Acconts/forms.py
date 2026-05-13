from django import forms
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label="Пароль")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Повторіть пароль")

    class Meta:
        model = User
        fields = ['email']

    def clean(self):
        cleaned = super().clean()
        if cleaned.get('password') != cleaned.get('password2'):
            raise forms.ValidationError("Паролі не співпадають")
        return cleaned

    def save(self, commit=True):
        user = User(email=self.cleaned_data['email'])
        user.set_password(self.cleaned_data['password'])
        user.is_active = False
        if commit:
            user.save()
        return user


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        self.user = None  # Обязательно инициализируем каждый раз
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        password = cleaned_data.get("password")

        if not email or not password:
            return cleaned_data

        user = authenticate(self.request, username=email, password=password)
        if user is None:
            # Проверяем, есть ли такой пользователь
            try:
                u = User.objects.get(email=email)
                if not u.check_password(password):
                    raise forms.ValidationError("Невірний пароль")
                if not u.is_active:
                    raise forms.ValidationError("Аккаунт не активний")
                # Если все ок, но authenticate вернул None — редкий кейс, пропускаем
            except User.DoesNotExist:
                raise forms.ValidationError("Користувач не знайдений")

            # Только если реально не найдено — общий блок
            raise forms.ValidationError("Невірна пошта або пароль")

        # Всё ок, сохраняем пользователя в форме
        self.user = user
        return cleaned_data
