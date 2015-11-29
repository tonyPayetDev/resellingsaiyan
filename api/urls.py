# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2015
"""
from __future__ import unicode_literals

from django.conf.urls import url, include

from rest_framework import routers

from .views import ClientViewSet, JuridictionViewSet, TelcoViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'clients', ClientViewSet)
router.register(r'juridt', JuridictionViewSet)
router.register(r'telcos', TelcoViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    #url(r'^docs/', include('rest_framework_swagger.urls')),
]
