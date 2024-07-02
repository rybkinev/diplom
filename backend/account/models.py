from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class ServiceCompany(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=120, default='')
    description = models.TextField(default='')


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        groups = instance.groups.filter(name='Service')
        if groups:
            print('create user')
        # Employee.objects.create(system_user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    groups = instance.groups.filter(name='Service')
    if groups:
        # instance.employee.save()
        print('save user')
