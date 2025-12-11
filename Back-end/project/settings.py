"""
Django settings for project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


# -------------------------------------------------------
# SECURITY
# -------------------------------------------------------
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-default-key"
)

DEBUG = os.environ.get("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "genus-jc.onrender.com",
]


# MUITO IMPORTANTE – estava faltando
ROOT_URLCONF = "project.urls"


# -------------------------------------------------------
# APPS
# -------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "cloudinary_storage",
    "cloudinary",

    "jornal",
    "foguinho",
    "aval",
    "suporte",

    "rest_framework",
    "corsheaders",
]


# -------------------------------------------------------
# MIDDLEWARE
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


# -------------------------------------------------------
# STATIC FILES
# -------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]


# -------------------------------------------------------
# TEMPLATES
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
# DATABASE (POSTGRES + NEON)
# -------------------------------------------------------
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrado no .env")

parsed = urlparse(DATABASE_URL)
query_params = parse_qs(parsed.query)

db_name = parsed.path.lstrip("/")

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
# PASSWORD
# -------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# -------------------------------------------------------
# LOCALE
# -------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# -------------------------------------------------------
# CLOUDINARY
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
# LOGIN REDIRECT
# -------------------------------------------------------
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"


# -------------------------------------------------------
# CORS / CSRF — ESSENCIAL PARA LOGIN COM MOBILE / iOS
# -------------------------------------------------------

CORS_ALLOW_CREDENTIALS = True

# Frontend em produção
CORS_ALLOWED_ORIGINS = [
    "https://genus-jc0.web.app",
]

# Em desenvolvimento, permitir localhost
if DEBUG:
    CORS_ALLOWED_ORIGINS.extend([
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ])

# WebView iOS/Android envia "null" como origin
CORS_ALLOW_ORIGIN_REGEXES = [
    r"^null$",
]

CSRF_TRUSTED_ORIGINS = [
    "https://genus-jc.onrender.com",
    "https://genus-jc0.web.app",
]

# Em desenvolvimento, adicionar localhost
if DEBUG:
    CSRF_TRUSTED_ORIGINS.extend([
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ])

# Permitir headers do fetch
CORS_ALLOW_HEADERS = [
    "Accept",
    "Accept-Encoding",
    "Authorization",
    "Content-Type",
    "DNT",
    "Origin",
    "User-Agent",
    "X-CSRFToken",
    "X-Requested-With",
]

CORS_EXPOSE_HEADERS = ["Content-Type", "X-CSRFToken"]
CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"]


# -------------------------------------------------------
# COOKIES — MUITO IMPORTANTE PARA LOGIN NO IOS
# -------------------------------------------------------

# NÃO DEFINA DOMAIN quando backend e frontend não compartilham domínio.
# Safari/iOS requer SameSite=None + Secure=True em HTTPS
# Em desenvolvimento (HTTP), usar SameSite=Lax ou None sem Secure
if DEBUG:
    # Desenvolvimento: permite cookies em HTTP
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SAMESITE = "Lax"
    CSRF_COOKIE_SECURE = False
else:
    # Produção: requer HTTPS com SameSite=None
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SECURE = True

SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 1209600  # 2 semanas


# -------------------------------------------------------
# LOGGING
# -------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "ERROR"},
    "loggers": {
        "django": {"handlers": ["console"], "level": "ERROR", "propagate": True},
    },
}
