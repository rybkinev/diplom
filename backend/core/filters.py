from django.db.models import Q

from core.utils.camel_case import convert_key_to_snake_case
from django_filters import rest_framework as filters


class CustomFilterSearch:

    def filter_by_name(self, queryset, name, value):
        return self.filter_by_foreign_key(queryset, name, value, 'name')

    def filter_by_serial_number(self, queryset, name, value):
        return self.filter_by_foreign_key(queryset, name, value, 'serial_number')

    def filter_by_foreign_key(self, queryset, name, value, field_name):
        snake_case_field_name = convert_key_to_snake_case(name)
        filter_field = f'{snake_case_field_name}__{field_name}'
        return queryset.filter(Q(**{filter_field: value}))
