from datetime import datetime

from django.db import models

from core.models import ReferenceModel


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
    type_maintenance = models.ForeignKey('MaintenanceType', on_delete=models.CASCADE)
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

    class Meta:
        verbose_name = 'ТО'
        verbose_name_plural = 'ТО'


class MaintenanceType(ReferenceModel):
    # вид ТО
    class Meta:
        verbose_name = 'Вид ТО'
        verbose_name_plural = 'Виды ТО'


class Organization(ReferenceModel):
    # Организация делавшая ТО
    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'
