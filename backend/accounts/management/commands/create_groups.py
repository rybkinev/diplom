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

        editors_group.permissions.add(Permission.objects.get(codename='change_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='view_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='view_vehicle'))
        editors_group.permissions.add(Permission.objects.get(codename='view_complaint'))

    @staticmethod
    def create_manager():
        # Создание группы "Manager"
        editors_group, created = Group.objects.get_or_create(name='Manager')

        if not created:
            editors_group.permissions.clear()

        # editors_group.permissions.add(Permission.objects.get(codename='change_account'))
        editors_group.permissions.add(Permission.objects.get(codename='change_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='change_vehicle'))
        editors_group.permissions.add(Permission.objects.get(codename='change_complaint'))

        editors_group.permissions.add(Permission.objects.get(codename='view_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='view_vehicle'))
        editors_group.permissions.add(Permission.objects.get(codename='view_complaint'))
        # editors_group.permissions.add(Permission.objects.get(codename='view_complaint'))
        # TODO Добавить permissions на все справочники

    @staticmethod
    def create_service():
        # Создание группы "Service"
        editors_group, created = Group.objects.get_or_create(name='Service')

        if not created:
            editors_group.permissions.clear()

        editors_group.permissions.add(Permission.objects.get(codename='change_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='change_complaint'))

        editors_group.permissions.add(Permission.objects.get(codename='view_maintenance'))
        editors_group.permissions.add(Permission.objects.get(codename='view_complaint'))
        editors_group.permissions.add(Permission.objects.get(codename='view_vehicle'))
