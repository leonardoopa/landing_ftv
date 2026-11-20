from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0003_fundamental"),
    ]

    operations = [
        migrations.AddField(
            model_name="lead",
            name="plan",
            field=models.CharField(blank=True, default="", max_length=40, verbose_name="plano"),
        ),
    ]
