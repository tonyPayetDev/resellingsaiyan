# -*- coding: utf-8 -*-

# Copyright (C) 2015 Nerim (payet tony)

from __future__ import unicode_literals

import json

from rest_framework import status
#from rest_framework.decorators import api_view, authentication_classes, permission_classes, renderer_classes
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from django.http import Http404

from valo.models import Juridiction, Juridiction_Purchase
from lines.models import Telco

from runner.utils.logger import logger
from runner.utils.jsonresponse import JSONResponse
from runner.utils.choices import BIZ_LIST, ZONE_LIST, PHONEKIND_LIST
#from reselling.models import myListFields , myfield ,myOption

from bunch import Bunch
from .models import  myfieldSaiyan ,configSaiyan


     
def saiyanGenerate(name):
    
    config=configSaiyan.objects.get(namepage=name)
    listField=config.field.all()
    fields=[  {
                              "name": s.name,
                              "label": s.label,
                              "type": s.typeSaiyan

                            }  for s in listField   ]
        
        
    data={
                  "idsaiyan": "example2",
                  "urldata": config.url,
                  "urlrest": config.urlrest,
                  "dom": config.dom,
                  "col": "12",
                  "fields": fields
        }
    
    return data
#    
#class myfieldSerializer(serializers.ModelSerializer):
#    name = serializers.CharField(max_length=30)
#    options = serializers.CharField(max_length=30)
#  
#
#    class Meta:
#        model = myfield
#        fields = ('name', 'options')
#       
#    def to_representation(self, value):
# 
#        return {"name":value.name,"options":value.options}
#        
#  
#class configlist(APIView):
#
#        authentication_classes = (SessionAuthentication, BasicAuthentication)
#        permission_classes = (IsAuthenticated,)
#        
#        def get(self, request, format=None):
#               
#     
#            
#            myfieldall = myfield.objects.all()
#            serializerMyfield = myfieldSerializer(myfieldall, many=True)
#            
#            config={
#                      
#                      "saiyan3": {
#                        "dom": "Tfrtip",
#                        "idsaiyan": "example4",
#                        "title": "Referentiel ventes",
#
#                        "urlpage": "/reselling/ventes/",
#                        "urldata": "/valo/jurilistjson2/",
#                        "urlrest": "/api/juridt",
#                        "col": "6",
#                        "field": {
#                          "indicatif": "",
#                          "zone": "",
#                          "name": "",
#                          "bizzone": ""
#                        }
#                      }
#                    }
#            
#            
#            listeOptions =  myOption.objects.all()
#            listetelco =  myfield.objects.all()
#            opt=[    {
#                              "id": s.idoptions,
#                              "label": s.labeloptions
#
#                            }  for s in listeOptions]
#            b=Bunch()
#            
#            a=[ b.update({ s.name:{ s.options:opt}  }) for s in listetelco]
#            listField=b
#            
#            return Response({"config":config })
#
#      
