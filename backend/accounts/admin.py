from django.contrib import admin

from accounts.models import ServiceCompany


@admin.register(ServiceCompany)
class ServiceCompanyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name__icontains',)
