from django.contrib import admin

from maintenance.models import Maintenance, Organization, MaintenanceType


@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ('date_maintenance', 'vehicle', 'type_maintenance', 'service_company')
    list_filter = ('date_maintenance', 'type_maintenance', 'service_company')
    search_fields = ('vehicle__serial_number',)
    ordering = ('-date_maintenance',)


@admin.register(MaintenanceType)
class MaintenanceTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name',)
