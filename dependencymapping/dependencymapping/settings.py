"""
Django settings for dependencymapping project.

Generated by 'django-admin startproject' using Django 1.10.6.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os
import socket

ENV = os.getenv("DEVELOPMENT")

if ENV == "DEVELOPMENT":
    print("Environment: {}".format(ENV))
    print("HERE SOME DEBUGGING")
    print("ENV: API_PATH = {}".format(os.getenv("API_PATH")))
    print("ENV: CLIENT_HOST = {}".format(os.getenv("CLIENT_HOST")))
    print("ENV: API_HOST = {}".format(os.getenv("API_HOST")))
    print("Hostname: {}".format(socket.gethostname()))

# variables declared in from the "root/.env"
CLIENT_HOST = os.getenv("CLIENT_HOST")
API_HOST = os.getenv("API_HOST")

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'uqa&gk2y+z1bfh1d4#8-o6j@#56%crn$*4x=_g#*um8-nkf49x'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    '127.0.0.1',
    '192.168.1.127',
    'localhost:8000',
    '127.0.0.1:9000',
    'localhost:3000',
    'localhost:8000',
    'localhost',
    '.{}'.format(API_HOST),
    '0.0.0.0'
]

CORS_ORIGIN_WHITELIST = (
    'localhost:8000',
    '127.0.0.1:9000',
    'localhost:3000',
    '192.168.1.127:3000',
    '127.0.1.1:5000',
    '*.{}'.format(CLIENT_HOST),  # allow client host request with subdomains
)

CORS_ORIGIN_REGEX_WHITELIST = (
    r'^(https?://)?.*{host}'.format(host=CLIENT_HOST),
)


# Application definitioon

INSTALLED_APPS = [
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'application',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_swagger'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'dependencymapping.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, '../static'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'dependencymapping.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': 'db',
        'PORT': 5432,
    }
}

# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/


STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, '/static/'),
    os.path.join(BASE_DIR, '../static'),
]

REST_FRAMEWORK = {
    'UNICODE_JSON': False,
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.AllowAny',),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    )
}

# FOR SWAGGER SESSION LOGIN
SWAGGER_SETTINGS = {
 'LOGIN_URL': 'rest_framework:login',
 'LOGOUT_URL': 'rest_framework:logout'
}