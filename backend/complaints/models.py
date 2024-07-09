from datetime import datetime

from django.db import models

from core.models import ReferenceModel


class Complaint(models.Model):
    # Рекламации
    date_failure = models.DateField(default=datetime.now)
    operating_time = models.IntegerField(default=0)
    node_failure = models.ForeignKey('FailureNode', on_delete=models.PROTECT)
    description_failure = models.TextField(default='')
    recovery_method = models.ForeignKey('RecoveryMethod', on_delete=models.PROTECT)
    used_parts = models.TextField(default='')
    date_recovery = models.DateField(default=datetime.now)
    vehicle = models.ForeignKey('vehicle.Vehicle', on_delete=models.PROTECT)
    service_company = models.ForeignKey(
        'accounts.ServiceCompany',
        on_delete=models.PROTECT,
        related_name='complaint_service_company',
        default=None
    )

    @property
    def downtime(self):
        return self.date_recovery - self.date_failure


class FailureNode(ReferenceModel):
    # Узел отказа
    # name = models.CharField(max_length=120)
    # description = models.TextField()
    #
    # def __str__(self):
    #     return self.name
    pass


class RecoveryMethod(ReferenceModel):
    # Метод восстановления
    # name = models.CharField(max_length=120)
    # description = models.TextField()
    #
    # def __str__(self):
    #     return self.name
    pass
