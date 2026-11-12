from django.contrib import admin

from . import models

admin.site.site_header = "Landing Futevôlei · CMS"
admin.site.site_title = "CMS Futevôlei"
admin.site.index_title = "Conteúdo da landing"


class OrderableAdmin(admin.ModelAdmin):
    list_editable = ("order", "active")
    list_filter = ("active",)


@admin.register(models.SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    list_display = ("brand", "hero_title")


@admin.register(models.MethodStep)
class MethodStepAdmin(OrderableAdmin):
    list_display = ("title", "tag", "order", "active")


@admin.register(models.Benefit)
class BenefitAdmin(OrderableAdmin):
    list_display = ("title", "icon", "order", "active")


@admin.register(models.Plan)
class PlanAdmin(OrderableAdmin):
    list_display = ("name", "price", "proof", "highlight", "order", "active")


@admin.register(models.Testimonial)
class TestimonialAdmin(OrderableAdmin):
    list_display = ("name", "role", "order", "active")


@admin.register(models.Faq)
class FaqAdmin(OrderableAdmin):
    list_display = ("question", "order", "active")


@admin.register(models.Lesson)
class LessonAdmin(OrderableAdmin):
    list_display = ("title", "category", "level", "duration_min", "order", "active")
    list_filter = ("level", "category", "active")
    search_fields = ("title",)


@admin.register(models.Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("name", "whatsapp", "email", "level", "created_at")
    list_filter = ("level",)
    search_fields = ("name", "whatsapp", "email")
    readonly_fields = ("name", "whatsapp", "email", "level", "source", "created_at")

    def has_add_permission(self, request):
        return False
