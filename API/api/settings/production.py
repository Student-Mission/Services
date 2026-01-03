from .base import *
import dj_database_url

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG", default=False)

ALLOWED_HOSTS = ['studentmission.onrender.com', '.onrender.com', 'apistudentmission.onrender.com']

# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(
        default=env("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True
    )
} 
# Cors
CORS_ALLOW_ALL_ORIGINS = True

# STATIC
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Middlewares
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Whitenoise
# Autoriser WhiteNoise à servir les fichiers média
# Attention : À ne pas faire pour des millions d'images, mais pratique au début
WHITENOISE_KEEP_ONLY_HASHED_FILES = True
