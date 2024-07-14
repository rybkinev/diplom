from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission


class Command(BaseCommand):
    help = 'Создание групп и назначение им прав'

    def handle(self, *args, **options):

        self.create_client()
        self.create_manager()
        self.create_service()

        self.stdout.write(self.style.SUCCESS('Группы и права успешно созданы'))

    @staticmethod
    def create_client():
        # Создание группы "Client"
        editors_group, created = Group.objects.get_or_create(name='Client')

        if not created:
            editors_group.permissions.clear()

        # ++ maintenance
        editors_group.permissions.add(Permission.objects.get(codename='add_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='change_maintenance'))
        # -- maintenance

        editors_group.permissions.add(Permission.objects.get(codename='view_vehicle'))
        editors_group.permissions.add(Permission.objects.get(codename='view_complaint'))

    @staticmethod
    def create_manager():
        # Создание группы "Manager"
        editors_group, created = Group.objects.get_or_create(name='Manager')

        if not created:
            editors_group.permissions.clear()

        editors_group.permissions.add(Permission.objects.get(codename='add_user'))
        editors_group.permissions.add(Permission.objects.get(codename='change_user'))
        # editors_group.permissions.add(Permission.objects.get(codename='delete_user'))

        # ++ vehicle
        editors_group.permissions.add(Permission.objects.get(codename='add_vehicle'))
        editors_group.permissions.add(Permission.objects.get(codename='change_vehicle'))

        editors_group.permissions.add(Permission.objects.get(codename='add_servicecompany'))
        editors_group.permissions.add(Permission.objects.get(codename='change_servicecompany'))

        editors_group.permissions.add(Permission.objects.get(codename='add_vehiclemodel'))
        editors_group.permissions.add(Permission.objects.get(codename='change_vehiclemodel'))

        editors_group.permissions.add(Permission.objects.get(codename='add_enginemodel'))
        editors_group.permissions.add(Permission.objects.get(codename='change_enginemodel'))

        editors_group.permissions.add(Permission.objects.get(codename='add_transmissionmodel'))
        editors_group.permissions.add(Permission.objects.get(codename='change_transmissionmodel'))

        editors_group.permissions.add(Permission.objects.get(codename='add_driveaxlemodel'))
        editors_group.permissions.add(Permission.objects.get(codename='change_driveaxlemodel'))

        editors_group.permissions.add(Permission.objects.get(codename='add_steeringaxlemodel'))
        editors_group.permissions.add(Permission.objects.get(codename='change_steeringaxlemodel'))
        # -- vehicle

        # ++ maintenance
        editors_group.permissions.add(Permission.objects.get(codename='add_maintenancetype'))
        editors_group.permissions.add(Permission.objects.get(codename='change_maintenancetype'))

        editors_group.permissions.add(Permission.objects.get(codename='add_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='change_maintenance'))

        editors_group.permissions.add(Permission.objects.get(codename='add_organization'))
        editors_group.permissions.add(Permission.objects.get(codename='change_organization'))
        # -- maintenance

        # ++ complaints
        editors_group.permissions.add(Permission.objects.get(codename='add_complaint'))
        editors_group.permissions.add(Permission.objects.get(codename='change_complaint'))

        editors_group.permissions.add(Permission.objects.get(codename='add_failurenode'))
        editors_group.permissions.add(Permission.objects.get(codename='change_failurenode'))

        editors_group.permissions.add(Permission.objects.get(codename='add_recoverymethod'))
        editors_group.permissions.add(Permission.objects.get(codename='change_recoverymethod'))
        # -- complaints

    @staticmethod
    def create_service():
        # Создание группы "Service"
        editors_group, created = Group.objects.get_or_create(name='Service')

        if not created:
            editors_group.permissions.clear()

        editors_group.permissions.add(Permission.objects.get(codename='view_vehicle'))

        # ++ maintenance
        editors_group.permissions.add(Permission.objects.get(codename='add_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='change_maintenance'))

        # editors_group.permissions.add(Permission.objects.get(codename='add_maintenancetype'))
        # editors_group.permissions.add(Permission.objects.get(codename='change_maintenancetype'))
        #
        # editors_group.permissions.add(Permission.objects.get(codename='add_organization'))
        # editors_group.permissions.add(Permission.objects.get(codename='change_organization'))
        # -- maintenance

        # ++ complaints
        editors_group.permissions.add(Permission.objects.get(codename='add_complaint'))
        editors_group.permissions.add(Permission.objects.get(codename='change_complaint'))

        # editors_group.permissions.add(Permission.objects.get(codename='add_failurenode'))
        # editors_group.permissions.add(Permission.objects.get(codename='change_failurenode'))

        # editors_group.permissions.add(Permission.objects.get(codename='add_recoverymethod'))
        # editors_group.permissions.add(Permission.objects.get(codename='change_recoverymethod'))
        # -- complaints
