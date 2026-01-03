#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import environ
# 

def main():
    # Load .env
    env = environ.Env()
    BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # manage.py directory
    env_path = os.path.join(BASE_DIR, '.env')

    if (os.path.exists(env_path)):
        environ.Env.read_env(env_path)
    env_type = env('ENV', default='local')
    

    if (env_type == 'production'):
        settings_module = 'api.settings.production'
    else:
        settings_module = 'api.settings.local'
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
    
    """Run administrative tasks."""
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
