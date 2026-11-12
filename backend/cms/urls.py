from django.contrib import admin
from django.urls import path

# Montado em /admin pelo FastAPI (SCRIPT_NAME=/admin), então a raiz aqui é o admin.
urlpatterns = [path("", admin.site.urls)]
