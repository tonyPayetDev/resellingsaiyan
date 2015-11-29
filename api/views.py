# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2015
"""
from __future__ import unicode_literals

from django.http import Http404

from rest_framework import viewsets, filters, mixins
from rest_framework.pagination import PageNumberPagination

from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

from customers.models import Client
from valo.models import Juridiction, Juridiction_Purchase
from lines.models import Telco

from .serializers import ClientSerializer, JuridictionSerializer, TelcoSerializer 
from .permissions import IsAdminOrReadOnly
from .mixins import PutUpdateModelMixin

from runner.utils.logger import logger
from runner.utils.jsonresponse import JSONResponse
from runner.utils.choices import BIZ_LIST, ZONE_LIST, PHONEKIND_LIST
from runner.utils.dataset import format_datatable , formatdataT



class CustomPagination(PageNumberPagination):
    """
    Default pagination class.
    Let large result sets be split into individual pages of data.
    """
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 100000

class BaseViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):

    filter_backends = (filters.SearchFilter,)
#    pagination_class = CustomPagination
#    paginate_by = 100
     
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)



class ClientViewSet(BaseViewSet):
    """
    For listing, retrieving, creating or updating client.
    ---
    list:
        parameters:
            - name: search
              type: string
              description: Search for client code,name,name2 that match the query
              paramType: query
            - name: page
              type: integer
              description: Page number
              paramType: query
    """
    queryset = Client.objects.all()
#    filter_backends = (filters.SearchFilter,)
    search_fields = ('code','name', 'name2')
    serializer_class = ClientSerializer

    
    def get(self, request, pk, format=None):
        
        logger.debug("request = %s pk = %s"%(request, pk))
        juri = self.get_object(pk) 
        serializer = JuridictionSerializer(juri)
        return Response(serializer.data)
    
    def put(self, request, *args, **kwargs):  
        print(request.data)

        client = self.get_object()

        serializer = ClientSerializer(client,data=dat['data'])
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
        
    def post(self, request, pk ,format=None):
        name =request.data['data[name]']
        code =request.data['data[code]']
        name2 =request.data['data[name2]']


        serializer = ClientSerializer(data={"name":name,"code":code,"name2":name2})
        
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
        
    def delete(self, request, pk, format=None):
        
        objetaSuppr=self.get_object()
        objetaSuppr.delete();
        return Response({"aaData": []})

        

class BaseViewSet2(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):

    filter_backends = (filters.SearchFilter,)
#    pagination_class = CustomPagination
#    paginate_by = 100
     
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)


class CustomPagination2(PageNumberPagination):
#    page_size = 10
#    page_size_query_param = 'page_size'
#    max_page_size = 1000
    paginate_by = None
    
class JuridictionViewSet(BaseViewSet2):

    queryset = Juridiction.objects.all()
    search_fields = ('zone','indicatif')
    serializer_class = JuridictionSerializer
    pagination_class = CustomPagination
    

    def get(self, request, pk, format=None):
        logger.debug("request = %s pk = %s"%(request, pk))
        juri = self.get_object(pk) 
        serializer = JuridictionSerializer(juri)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
		
	try:
	    data=formatdataT(request.data)
	except:
	    data=request.data

        juridiction = self.get_object()
        serializer = JuridictionSerializer(juridiction,data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
        
    def post(self, request, pk ,format=None):
        
        data=formatdataT(request.data) 
        serializer = JuridictionSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
        
    def delete(self, request, pk, format=None):
        
        objetaSuppr=self.get_object()
        objetaSuppr.delete();
        return Response({"aaData": []})



class TelcoViewSet(BaseViewSet):

    queryset = Telco.objects.all()
    search_fields = ('code','name')
    serializer_class = TelcoSerializer



