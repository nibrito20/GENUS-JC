"""
Django settings for project project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------------------------------------
#  SECURITY
# -------------------------------------------------------
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-default-key"
)

DEBUG = os.environ.get("DEBUG", "False") == "True"

ALLOWED_HOSTS_STR = os.environ.get(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1,genus-jc.onrender.com"
)
ALLOWED_HOSTS = [h.strip() for h in ALLOWED_HOSTS_STR.split(",")]


# -------------------------------------------------------
#  APPS
# -------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "cloudinary_storage",
    "django.contrib.staticfiles",
    "cloudinary",

    "jornal",
    "foguinho",
    "aval",

    "rest_framework",
    "corsheaders",
]


# -------------------------------------------------------
#  MIDDLEWARE
# -------------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "project.urls"


# -------------------------------------------------------
#  STATIC FILES
# -------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"


# -------------------------------------------------------
#  TEMPLATES
# -------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "project", "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "project.wsgi.application"


# -------------------------------------------------------
#  DATABASE (POSTGRES + NEON)
# -------------------------------------------------------
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrado no .env")

parsed = urlparse(DATABASE_URL)
query_params = parse_qs(parsed.query)

db_name = parsed.path[1:] if parsed.path.startswith("/") else parsed.path

db_options = {}
if "sslmode" in query_params:
    db_options["sslmode"] = query_params["sslmode"][0]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": db_name,
        "USER": parsed.username,
        "PASSWORD": parsed.password,
        "HOST": parsed.hostname,
        "PORT": parsed.port or 5432,
        "OPTIONS": db_options,
    }
}


# -------------------------------------------------------
#  PASSWORDS
# -------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# -------------------------------------------------------
#  LOCALE
# -------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# -------------------------------------------------------
#  MEDIA (Cloudinary)
# -------------------------------------------------------
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.environ.get("CLOUDINARY_CLOUD_NAME", ""),
    "API_KEY": os.environ.get("CLOUDINARY_API_KEY", ""),
    "API_SECRET": os.environ.get("CLOUDINARY_API_SECRET", ""),
}

if all(CLOUDINARY_STORAGE.values()):
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
    MEDIA_URL = "/media/"
else:
    MEDIA_URL = "/media/"
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")


# -------------------------------------------------------
#  LOGIN
# -------------------------------------------------------
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"


# -------------------------------------------------------
#  CORS / CSRF / COOKIES – CONFIGURAÇÃO CORRETA
# -------------------------------------------------------

CORS_ALLOW_CREDENTIALS = True

# Domínios que podem chamar sua API
CORS_ALLOWED_ORIGINS = [
    "https://genus-jc0.web.app",
    "https://genus-jc0.firebaseapp.com",
]

# Necessário para permitir mobile WebView (Android/iOS)
CORS_ALLOW_ORIGIN_REGEXES = [
    r"^null$",   # Chrome Mobile WebView
]

CSRF_TRUSTED_ORIGINS = [
    "https://genus-jc.onrender.com",
    "https://genus-jc0.web.app",
    "https://genus-jc0.firebaseapp.com",
]

# Headers aceitos pelo navegador durante preflight
CORS_ALLOW_HEADERS = [
    "Accept",
    "Accept-Encoding",
    "Authorization",
    "Content-Type",   # <- ESSENCIAL PARA O LOGIN
    "DNT",
    "Origin",
    "User-Agent",
    "X-CSRFToken",
    "X-Requested-With",
]

CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken"]

CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]

# -------------------------------------------------------
#  COOKIES – ESSENCIAL PARA LOGIN EM MOBILE
# -------------------------------------------------------

# O domínio DEVE ser o domínio do backend
SESSION_COOKIE_DOMAIN = "genus-jc.onrender.com"
CSRF_COOKIE_DOMAIN = "genus-jc.onrender.com"

SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True

CSRF_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SECURE = True