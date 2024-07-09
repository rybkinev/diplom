from datetime import datetime

from django.db import models

from django.conf import settings

from core.models import ReferenceModel


class Vehicle(models.Model):
    # Машина
    """
    Зав. Nº машины
    Модель техники
    Модель двигателя
    Зав. Nº двигателя
    Модель трансмиссии
    Зав. Nº трансмиссии
    Модель ведущего моста
    Зав. Nº ведущего моста
    Модель управляемого моста
    Зав. Nº управляемого моста
    Договор поставки Nº, дата
    Дата отгрузки с завода
    Грузополучатель(конечный потребитель)
    Адрес поставки(эксплуатации)
    Комплектация (доп. опции)
    Клиент (покупатель)
    сервисная компания
    """
    serial_number = models.CharField(max_length=20, unique=True)
    vehicle_model = models.ForeignKey(
        'VehicleModel',
        on_delete=models.PROTECT,
        # null=False,
        default=None
    )
    engine_model = models.ForeignKey(
        'EngineModel',
        on_delete=models.PROTECT,
        # null=False,
        default=None
    )
    sn_engine = models.CharField(max_length=20, default='')
    transmission_model = models.ForeignKey(
        'TransmissionModel',
        on_delete=models.PROTECT,
        # null=False,
        default=None
    )
    sn_transmission = models.CharField(max_length=20, default='')
    drive_axle_model = models.ForeignKey(
        'DriveAxleModel',
        on_delete=models.PROTECT,
        # null=False,
        default=None
    )
    sn_drive_axle = models.CharField(max_length=20, default='')
    steering_axle_model = models.ForeignKey(
        'SteeringAxleModel',
        on_delete=models.PROTECT,
        # null=False,
        default=None
    )
    sn_steering_axle = models.CharField(max_length=20, default='')
    contract = models.CharField(max_length=200, default='')
    shipping_date = models.DateField(null=False, blank=False, default=datetime.now)
    consignee = models.CharField(max_length=200, default='')
    delivery_address = models.CharField(max_length=500, default='')
    equipment = models.CharField(max_length=200, default='')
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='vehicles_as_client',
        default=None
    )
    service_company = models.ForeignKey(
        'accounts.ServiceCompany',
        on_delete=models.PROTECT,
        related_name='vehicles_as_service_company',
        default=None
    )
    # client = models.CharField(max_length=200, default='')
    # service_company = models.CharField(max_length=200, default='')

    def __str__(self):
        return self.serial_number


class VehicleModel(ReferenceModel):
    # Модель техники
    pass


class EngineModel(ReferenceModel):
    # Модель двигателя
    pass


class TransmissionModel(ReferenceModel):
    # Модель трансмиссии
    pass


class DriveAxleModel(ReferenceModel):
    # модель ведущего моста
    pass


class SteeringAxleModel(ReferenceModel):
    # модель управляемого моста
    pass
