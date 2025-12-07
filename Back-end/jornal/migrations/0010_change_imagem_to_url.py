# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jornal', '0009_profile_foto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='noticia',
            name='imagem',
            field=models.URLField(blank=True, max_length=500, null=True, verbose_name='URL da Imagem'),
        ),
    ]

