from rest_framework.serializers import ModelSerializer

from vehicle.models import Vehicle


class VehicleSerializer(ModelSerializer):

    class Meta:
        model = Vehicle
        fields = [
            'serial_number',
            'vehicle_model',
            'engine_model',
            'sn_engine',
            'transmission_model',
            'sn_transmission',
            'drive_axle_model',
            'sn_drive_axle',
            'steering_axle_model',
            'sn_steering_axle',
            'contract',
            'shipping_date',
            'consignee',
            'delivery_address',
            'equipment',
            'client',
            'service_company'
        ]

        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }
