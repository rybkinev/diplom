from django_filters import rest_framework as filters

from core.filters import CustomFilterSearch
from vehicle.models import Vehicle


class ComplaintFilter(filters.FilterSet, CustomFilterSearch):
    # 'description_failure',
    vehicle = filters.CharFilter(method='filter_by_serial_number')
    recoveryMethod = filters.CharFilter(method='filter_by_name')
    dateFailure = filters.CharFilter(field_name='date_failure')
    operatingTime = filters.CharFilter(field_name='operating_time')
    dateRecovery = filters.CharFilter(field_name='date_recovery')
    nodeFailure = filters.CharFilter(method='filter_by_name')
    serviceCompany = filters.CharFilter(method='filter_by_name')
    usedParts = filters.CharFilter(method='filter_by_used_parts')

    class Meta:
        model = Vehicle
        fields = [
            'vehicle',
            'recoveryMethod',
            'dateFailure',
            'operatingTime',
            'dateRecovery',
            'nodeFailure',
            'serviceCompany',
            'usedParts',
        ]

    def filter_by_used_parts(self, queryset, name, value):
        return self.filter_by_foreign_key(
            queryset,
            name,
            value,
            'used_parts__icontains'
        )
