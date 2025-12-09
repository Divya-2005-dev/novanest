from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(register_number='admin001').exists():
    User.objects.create_superuser(
        register_number='admin001',
        username='admin',
        email='admin@novanest.local',
        password='Admin@123',
        role='admin'
    )
    print("✓ Superuser created: register_number=admin001, password=Admin@123")
else:
    print("✓ Superuser already exists")
