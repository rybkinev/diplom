from django.db import models


class ReferenceModel(models.Model):
    # Общая модель справочников
    name = models.CharField(max_length=120, default='')
    description = models.TextField()

    class Meta:
        abstract = True

    def __str__(self):
        return self.name
