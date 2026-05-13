import os
from django.core.wsgi import get_wsgi_application

try:
    from whitenoise import WhiteNoise
except ImportError:
    WhiteNoise = None

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CookBook.settings')

application = get_wsgi_application()

if WhiteNoise:
    application = WhiteNoise(application, root=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'staticfiles'))