import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
import pandas as pd

from accounts.models import ServiceCompany, create_service_company, generate_unique_username
from complaints.models import Complaint, FailureNode, RecoveryMethod
from maintenance.models import Maintenance, MaintenanceType, Organization
from vehicle.models import Vehicle, VehicleModel, EngineModel, TransmissionModel, DriveAxleModel, SteeringAxleModel


class Command(BaseCommand):
    help = 'Импорт данных из таблиц xlsx'

    def handle(self, *args, **kwargs):
        script_dir = os.path.dirname(__file__)
        file_path = os.path.join(script_dir, 'example.xlsx')

        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        # Загружаем Excel файл в DataFrame
        df = pd.read_excel(file_path, sheet_name='машины')

        # Проходим по строкам DataFrame и сохраняем данные в базу данных
        for _, row in df.iterrows():
            try:
                if not pd.to_numeric(row.iloc[0]):
                    continue
            except ValueError:
                continue

            serial_number = row.iloc[2]
            if Vehicle.objects.filter(serial_number=serial_number).exists():
                continue

            vehicle_model, created = VehicleModel.objects.get_or_create(name=row.iloc[1])
            engine_model, created = EngineModel.objects.get_or_create(name=row.iloc[3])
            transmission_model, created = TransmissionModel.objects.get_or_create(name=row.iloc[5])
            drive_axle_model, created = DriveAxleModel.objects.get_or_create(name=row.iloc[7])
            steering_axle_model, created = SteeringAxleModel.objects.get_or_create(name=row.iloc[9])
            service_company, created = create_service_company(row.iloc[16])

            Vehicle.objects.create(
                serial_number=serial_number,
                vehicle_model=vehicle_model,
                engine_model=engine_model,
                sn_engine=row.iloc[4],
                transmission_model=transmission_model,
                sn_transmission=row.iloc[6],
                drive_axle_model=drive_axle_model,
                sn_drive_axle=row.iloc[8],
                steering_axle_model=steering_axle_model,
                sn_steering_axle=row.iloc[10],
                # contract=row.iloc[11],
                shipping_date=row.iloc[11],
                client=self.get_or_create_user(row.iloc[12]),
                consignee=row.iloc[13],
                delivery_address=row.iloc[14],
                equipment=row.iloc[15],
                service_company=service_company,
            )
        print('create all vehicle models')

        df = pd.read_excel(file_path, sheet_name='ТО output', converters={0: str})

        # Проходим по строкам DataFrame и сохраняем данные в базу данных
        for _, row in df.iterrows():
            try:
                if not pd.to_numeric(row.iloc[0]):
                    continue
            except ValueError:
                continue

            work_order = row.iloc[4]
            if Maintenance.objects.filter(work_order=work_order).exists():
                continue

            vehicle = Vehicle.objects.get(serial_number=row.iloc[0])
            type_maintenance, created = MaintenanceType.objects.get_or_create(name=row.iloc[1])
            organization, created = Organization.objects.get_or_create(name=row.iloc[6])

            Maintenance.objects.create(
                vehicle=vehicle,
                type=type_maintenance,
                date_maintenance=row.iloc[2],
                operating_time=int(row.iloc[3]),
                work_order=work_order,
                date_ordered=row.iloc[5],
                organization=organization,
                service_company=vehicle.service_company,
            )
        print('create all maintenance models')

        df = pd.read_excel(file_path, sheet_name='рекламация output')

        # Проходим по строкам DataFrame и сохраняем данные в базу данных
        for _, row in df.iterrows():
            try:
                if not pd.to_numeric(row.iloc[0]):
                    continue
            except ValueError:
                continue

            # work_order = row.iloc[4]
            # if Complaint.objects.filter(work_order=work_order).exists():
            #     continue
            vehicle = Vehicle.objects.get(serial_number=row.iloc[0])
            node_failure, created = FailureNode.objects.get_or_create(name=row.iloc[3])
            recovery_method, created = RecoveryMethod.objects.get_or_create(name=row.iloc[5])

            Complaint.objects.create(
                date_failure=row.iloc[1],
                operating_time=row.iloc[2],
                node_failure=node_failure,
                description_failure=row.iloc[4],
                recovery_method=recovery_method,
                used_parts=row.iloc[6],
                date_recovery=row.iloc[7],
                vehicle=vehicle,
                service_company=vehicle.service_company,
            )
        print('create all recovery methods')

    def get_or_create_user(self, name):
        user_model = get_user_model()

        if user_model.objects.filter(first_name=name).exists():
            return user_model.objects.get(first_name=name)

        username = generate_unique_username('client')
        return user_model.objects.create_user(username=username, password='client', first_name=name)
