from django_filters import rest_framework as filters

from core.filters import CustomFilterSearch
from vehicle.models import Vehicle


class MaintenanceFilter(filters.FilterSet, CustomFilterSearch):
    vehicle = filters.CharFilter(method='filter_by_serial_number')
    typeMaintenance = filters.CharFilter(method='filter_by_type_maintenance_icontains')
    dateMaintenance = filters.CharFilter(field_name='date_maintenance')
    operatingTime = filters.CharFilter(field_name='operating_time')
    workOrder = filters.CharFilter(field_name='work_order')
    dateOrder = filters.CharFilter(field_name='date_order')
    organization = filters.CharFilter(method='filter_by_name')
    serviceCompany = filters.CharFilter(method='filter_by_name')

    class Meta:
        model = Vehicle
        fields = [
            'vehicle',
            'typeMaintenance',
            'dateMaintenance',
            'operatingTime',
            'workOrder',
            'dateOrder',
            'organization',
            'serviceCompany',
        ]

    def filter_by_type_maintenance_icontains(self, queryset, name, value):
        return self.filter_by_foreign_key(
            queryset,
            name,
            value,
            'name__icontains'
        )
