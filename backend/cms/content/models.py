"""Models Django mapeados às coleções Mongo que a API FastAPI lê."""
from django.db import models
from django_mongodb_backend.fields import ArrayField


class Orderable(models.Model):
    order = models.IntegerField("ordem", default=0)
    active = models.BooleanField("ativo", default=True)

    class Meta:
        abstract = True
        ordering = ["order"]


class SiteConfig(models.Model):
    brand = models.CharField("marca", max_length=80, default="Areia Futevôlei")
    hero_eyebrow = models.CharField("hero: linha pequena", max_length=160, blank=True)
    hero_title = models.CharField("hero: título", max_length=200, blank=True)
    hero_subtitle = models.TextField("hero: subtítulo", blank=True)
    hero_video_url = models.CharField("hero: vídeo (URL ou /assets/..)", max_length=300, blank=True)
    hero_image_url = models.CharField("hero: imagem/poster", max_length=300, blank=True)
    cta_label = models.CharField("botão principal", max_length=80, blank=True)
    cta_url = models.CharField("link do botão", max_length=500, blank=True)
    whatsapp = models.CharField("WhatsApp (só dígitos)", max_length=20, blank=True)
    instagram = models.CharField("Instagram (URL)", max_length=200, blank=True)
    stats = models.JSONField("números do hero", default=list, blank=True,
                             help_text='Ex.: [{"value": "30", "label": "videoaulas"}]')
    marquee = ArrayField(models.CharField(max_length=40), verbose_name="faixa em loop",
                         default=list, blank=True, help_text="Palavras separadas por vírgula")

    class Meta:
        db_table = "site_config"
        verbose_name = "configuração do site"
        verbose_name_plural = "configuração do site"

    def __str__(self):
        return self.brand


class MethodStep(Orderable):
    title = models.CharField("título", max_length=100)
    text = models.TextField("texto")
    tag = models.CharField("etiqueta", max_length=40, blank=True)
    image_url = models.CharField("imagem (opcional)", max_length=300, blank=True)

    class Meta(Orderable.Meta):
        db_table = "method_steps"
        verbose_name = "etapa do método"
        verbose_name_plural = "etapas do método"

    def __str__(self):
        return self.title


class Benefit(Orderable):
    title = models.CharField("título", max_length=100)
    description = models.TextField("descrição")
    icon = models.CharField("ícone", max_length=20, default="ball",
                            help_text="ball, clock, target, stairs, phone, people")

    class Meta(Orderable.Meta):
        db_table = "benefits"
        verbose_name = "benefício"
        verbose_name_plural = "benefícios"

    def __str__(self):
        return self.title


class Plan(Orderable):
    name = models.CharField("nome", max_length=60)
    badge = models.CharField("selo", max_length=40, blank=True)
    price_from = models.CharField("preço 'de'", max_length=30, blank=True)
    price = models.CharField("preço", max_length=30)
    installments = models.CharField("parcelamento", max_length=80, blank=True)
    features = ArrayField(models.CharField(max_length=120), verbose_name="itens",
                          default=list, blank=True, help_text="Itens separados por vírgula")
    highlight = models.BooleanField("destaque", default=False)
    cta_label = models.CharField("texto do botão", max_length=60, default="Quero esse plano")
    cta_url = models.CharField("link do botão", max_length=500, blank=True)

    class Meta(Orderable.Meta):
        db_table = "plans"
        verbose_name = "plano"
        verbose_name_plural = "planos"

    def __str__(self):
        return self.name


class Testimonial(Orderable):
    name = models.CharField("nome", max_length=80)
    role = models.CharField("descrição", max_length=80, blank=True)
    quote = models.TextField("depoimento")
    avatar_url = models.CharField("foto (opcional)", max_length=300, blank=True)

    class Meta(Orderable.Meta):
        db_table = "testimonials"
        verbose_name = "depoimento"
        verbose_name_plural = "depoimentos"

    def __str__(self):
        return self.name


class Faq(Orderable):
    question = models.CharField("pergunta", max_length=200)
    answer = models.TextField("resposta")

    class Meta(Orderable.Meta):
        db_table = "faqs"
        verbose_name = "pergunta frequente"
        verbose_name_plural = "perguntas frequentes"

    def __str__(self):
        return self.question


class Lesson(Orderable):
    LEVELS = [("iniciante", "Iniciante"), ("intermediario", "Intermediário"), ("avancado", "Avançado")]

    title = models.CharField("título", max_length=120)
    category = models.CharField("categoria", max_length=40)
    level = models.CharField("nível", max_length=20, choices=LEVELS)
    description = models.TextField("descrição", blank=True)
    duration_min = models.IntegerField("duração (min)", default=10)
    cover_url = models.CharField("capa (opcional)", max_length=300, blank=True)

    class Meta(Orderable.Meta):
        db_table = "lessons"
        verbose_name = "aula"
        verbose_name_plural = "aulas (scroll infinito)"

    def __str__(self):
        return self.title


class Lead(models.Model):
    name = models.CharField("nome", max_length=120)
    whatsapp = models.CharField(max_length=20)
    email = models.CharField(max_length=200, blank=True)
    level = models.CharField("nível", max_length=20)
    source = models.CharField("origem", max_length=40, default="landing")
    created_at = models.DateTimeField("criado em")

    class Meta:
        db_table = "leads"
        ordering = ["-created_at"]
        verbose_name = "lead"
        verbose_name_plural = "leads"

    def __str__(self):
        return f"{self.name} ({self.whatsapp})"
