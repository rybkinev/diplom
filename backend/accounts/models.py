from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class ServiceCompany(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, default='')
    description = models.TextField(default='')

    def __str__(self):
        return self.name


def generate_unique_username(base="service"):
    user_model = get_user_model()
    counter = 1
    while True:
        username = f"{base}{counter}"
        if not user_model.objects.filter(username=username).exists():
            return username
        counter += 1


def create_service_company(name):

    if ServiceCompany.objects.filter(name=name).exists():
        return ServiceCompany.objects.get(name=name), False

    user_model = get_user_model()
    # Генерация уникального имени пользователя
    username = generate_unique_username()

    # Создание пользователя
    user = user_model.objects.create_user(username=username, password='service')

    # Создание объекта ServiceCompany и привязка пользователя к нему
    service_company = ServiceCompany.objects.create(
        user=user,
        name=name
    )

    return service_company, True


# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         groups = instance.groups.filter(name='Service')
#         if groups:
#             print('create user')
#             ServiceCompany.objects.create(user=instance)
#
#
# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def save_user_profile(sender, instance, **kwargs):
#     groups = instance.groups.filter(name='Service')
#     if groups:
#         print('save user')
#         instance.ServiceCompany.save()
