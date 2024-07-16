from django.contrib import admin

from complaints.models import Complaint, FailureNode, RecoveryMethod


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('date_failure', 'vehicle', 'recovery_method', 'service_company')
    list_filter = ('date_failure', 'node_failure', 'recovery_method', 'service_company')
    search_fields = ('vehicle__serial_number',)
    ordering = ('-date_failure',)
    order = 1


@admin.register(FailureNode)
class FailureNodeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    order = 2


@admin.register(RecoveryMethod)
class RecoveryMethodAdmin(admin.ModelAdmin):
    list_display = ('name',)
    order = 3
