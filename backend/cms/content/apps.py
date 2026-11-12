from django.apps import AppConfig


class ContentConfig(AppConfig):
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"
    name = "cms.content"
    label = "content"
    verbose_name = "Conteúdo da landing"

    def ready(self):
        from . import signals  # noqa: F401
