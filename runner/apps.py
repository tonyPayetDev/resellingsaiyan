# -*- coding: utf-8 -*-

# Copyright (C) 2015 Nerim (Philippe 'paHpa' Vivien)

from django import VERSION as DJANGO_VERSION
if DJANGO_VERSION >= (1, 7):
    from django.apps import AppConfig as BaseAppConfig
    from django.utils.importlib import import_module


    class AppConfig(BaseAppConfig):

        name = "runner"

        def ready(self):
            import_module("runner.receivers")
