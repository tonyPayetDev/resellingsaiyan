# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import absolute_import

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.

from .celery import app as celery_app
#from .models import RunnerUser
#__all__ = ['celery_app', 'RunnerUser']
#__all__ = ['celery_app']

from django import VERSION as DJANGO_VERSION
if DJANGO_VERSION >= (1, 7):
    default_app_config = "runner.apps.AppConfig"
    

