import os
from django.core.management.base import BaseCommand
from users.models import CustomUser


class Command(BaseCommand):
    """
    Create initial admin user for production.
    Reads credentials from environment variables.
    Safe to run multiple times - skips if admin exists.
    """
    help = 'Create initial admin user from environment variables'

    def handle(self, *args, **options):
        email = os.getenv('ADMIN_EMAIL', 'admin@test.com')
        password = os.getenv('ADMIN_PASSWORD', 'Admin123')
        full_name = os.getenv('ADMIN_NAME', 'Admin User')

        if CustomUser.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Admin user {email} already exists. Skipping.'))
            return

        CustomUser.objects.create_superuser(
            email=email,
            password=password,
            full_name=full_name
        )
        self.stdout.write(self.style.SUCCESS(f'Created admin user: {email}'))
