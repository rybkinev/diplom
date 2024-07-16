from django.contrib import admin

from vehicle.models import Vehicle, VehicleModel, EngineModel, TransmissionModel, SteeringAxleModel, DriveAxleModel


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('serial_number', 'vehicle_model', 'engine_model', 'get_client_first_name')
    list_filter = ('serial_number', 'vehicle_model', 'engine_model', 'client')
    search_fields = ('serial_number',)
    ordering = ('serial_number',)

    def get_client_first_name(self, obj):
        return obj.client.first_name

    get_client_first_name.short_description = 'Client First Name'


@admin.register(VehicleModel)
class VehicleModelAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(EngineModel)
class EngineModelAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(TransmissionModel)
class TransmissionModelAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(DriveAxleModel)
class DriveAxleModelAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(SteeringAxleModel)
class SteeringAxleModelAdmin(admin.ModelAdmin):
    list_display = ('name',)
