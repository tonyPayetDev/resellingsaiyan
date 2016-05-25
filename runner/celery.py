# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import absolute_import

import os

from celery import Celery
#from celery.signals import after_setup_task_logger

from django.conf import settings
#from runner.utils.logger import logger

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'runner.settings')

app = Celery('runner')

#print "PAHPA %s" % __file__

# Using a string here means the worker will not have to
# pickle the object when using Windows.
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.RUNNER_APPS)

#def dashboard_tasks_setup_logging(**kw):
#    logger.info("PAHPA LOGIN Task %s"%kw)

#@app.task(bind=True)
#def debug_task(self):
#    ret='SITE {0!r} Request: {1!r}'.format(settings.SITE_ID, self.request)
#    print ret
#    return ret
    

#after_setup_task_logger.connect(dashboard_tasks_setup_logging)
