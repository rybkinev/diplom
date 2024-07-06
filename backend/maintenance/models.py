from datetime import datetime

from django.conf import settings
from django.db import models


class Maintenance(models.Model):
    # ТО
    """
    машина
    вид ТО
    Дата ТО
    наработка
    Заказ-наряд
    Дата заказ-наряда
    Организация проводившая ТО
    Сервисная компания
    """
    vehicle = models.ForeignKey('vehicle.Vehicle', on_delete=models.CASCADE)
    type = models.ForeignKey('MaintenanceType', on_delete=models.CASCADE)
    date_maintenance = models.DateField(default=datetime.now)
    operating_time = models.IntegerField(default=0)
    work_order = models.CharField(max_length=100, default='')
    date_order = models.DateField(default=datetime.now)
    organization = models.ForeignKey(
        'Organization',
        on_delete=models.PROTECT,
        related_name='maintenance_organization',
        default=None
    )
    service_company = models.ForeignKey(
        'accounts.ServiceCompany',
        on_delete=models.PROTECT,
        related_name='maintenance_as_service_company',
        default=None
    )


class MaintenanceType(models.Model):
    # вид ТО
    name = models.CharField(max_length=120)
    description = models.TextField()

    def __str__(self):
        return self.name


class Organization(models.Model):
    name = models.CharField(max_length=120, default='')
    description = models.TextField()

    def __str__(self):
        return self.name
