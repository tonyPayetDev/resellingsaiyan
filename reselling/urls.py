# -*- coding: utf-8 -*-
"""
Author: tony payet

Copyright: Nerim, 2015
"""
from __future__ import unicode_literals
from django.contrib.auth.decorators import login_required

from django.conf.urls import patterns, url

from reselling.views import reselling_list , reselling_listClient ,achats , dashboard , ventes , aide , travaux ,config ,clients 

#from reselling.config import  configlist

urlpatterns = patterns('',
    url(r'^jsonlistclient/$', login_required(reselling_listClient.as_view()), name='reselling_listClient'),
    url(r'^jsonlistjuri/$', login_required(reselling_list.as_view()), name='reselling_list'),
#    url(r'^jsonlistGv_telco/$', login_required(reselling_GV_Telco.as_view()), name='reselling_telco'),

    url(r'^dashboard/$', login_required(dashboard.as_view(template_name="reselling/dashboard.html")),name='dashboard'),  
    url(r'^achats/$', login_required(achats.as_view(template_name="reselling/achats.html")),name='achats'),
    url(r'^ventes/$', login_required(ventes.as_view(template_name="reselling/ventes.html")),name='ventes'),
    url(r'^travaux/$', login_required(travaux.as_view(template_name="reselling/travaux.html")),name='travaux'),
    url(r'^config/$', login_required(config.as_view(template_name="reselling/config.html")),name='config'),
    url(r'^aide/$', login_required(aide.as_view(template_name="reselling/aide.html")),name='aide'),
    url(r'^clients/$', login_required(clients.as_view(template_name="reselling/clients.html")),name='clients'),
    url(r'^test/$', login_required(clients.as_view(template_name="reselling/test.html")),name='test'),


)




