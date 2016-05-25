# -*- coding: utf-8 -*-

# Copyright (C) 2015 Nerim (Philippe 'paHpa' Vivien)

from __future__ import unicode_literals

from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.sites.models import Site
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from runner.utils.logger import logger

############### TEST REST (exemple avec Site)
class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)
        
class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ('id','name', 'domain')

#@login_required
@api_view(['GET', 'POST'])
def Site_list(request):
    logger.info("request :%s"%request)
    if request.method == 'GET':
        sites = Site.objects.all()
        serializer = SiteSerializer(sites, many=True)
        return JSONResponse("ok")
        #return JSONResponse(serializer.data)

    elif request.method == 'POST':
        sites = Site.objects.all()
        serializer = SiteSerializer(sites, many=True)
        return JSONResponse(serializer.data)
        
@api_view(['GET', 'PUT', 'DELETE'])
def Site_detail(request, pk):
    try:
        site = Site.objects.get(pk=pk)
    except Site.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SiteSerializer(site)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SiteSerializer(site, data=request.data)
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        return Response(status=status.HTTP_204_NO_CONTENT)

