# Generated by Django 5.0.6 on 2024-07-09 04:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0004_rename_type_maintenance_type_maintenance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='name',
            field=models.CharField(max_length=120),
        ),
    ]
