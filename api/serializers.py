# -*- coding: utf-8 -*-
"""
Author: tony ' payet <tony.payet.professionnel@.com>

Copyright: Nerim, 2015
"""
from __future__ import unicode_literals

from rest_framework import serializers

from customers.models import Client , Reseller
from valo.models import Juridiction, Juridiction_Purchase
from lines.models import Telco

from runner.utils.logger import logger
from runner.utils.choices import BIZ_LIST, ZONE_LIST, PHONEKIND_LIST

from rest_framework.renderers import JSONRenderer
from django.core.exceptions import ValidationError

class TelcoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Telco
        fields = ('id', 'code', 'name')
class resellerSerializer(serializers.ModelSerializer):
    # telco = TelcoSerializer()

    class Meta:
        model = Reseller
        fields = ('id','name')
        
class ClientSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    reseller = resellerSerializer()

    def validate(self, data):
        """
        Check that the start is before the stop.
        """
     

        return data
    def update(self, instance, validated_data):
        """
        Update and return a new `juridiction` instance, given the validated data.
        """
        post = Client.objects.get(pk=instance.pk)
        post.code = validated_data.get('code')
        post.name = validated_data.get('name')
        resellerid= validated_data.get('reseller')
        print("iciiiiiiiii",resellerid)
        resel = Reseller.objects.get(name="tony")
        #post.reseller = resel

        post.save()
        
        return post
    
    def create(self, validated_data):
        """
        Create and return a new `juridiction` instance, given the validated data.
        """
        post = Client.objects.create()
        post.code = validated_data.get('code')
        post.name = validated_data.get('name')
        post.name2 = validated_data.get('name2')

        post.save()
        return post    
    
    class Meta:
        model = Client
        fields = ('id','name','code','name2','reseller')
        

class JuridictionPurchaseSerializer(serializers.ModelSerializer):
    # telco = TelcoSerializer()
    id = serializers.IntegerField(label='ID', read_only=False)

    class Meta:
        model = Juridiction_Purchase
        fields = ('id','price_p')

    def to_representation(self, value):
        return {"id":value.telco.id,
                "price_p":value.price_p}

class JuridictionSerializer(serializers.ModelSerializer):
    juripurchase = JuridictionPurchaseSerializer(many=True)
    kind = serializers.ChoiceField(choices=PHONEKIND_LIST, allow_blank=True,
                                   default=None)

    def validate(self, data):
        """
        Check that the start is before the stop.
        """
        if not data['name'] :
            raise serializers.ValidationError( {"fieldErrors": [
                    {
                        "name":   "name",
                        "status": "This field is required"
                    },
                  
                ]})            
        if not data['indicatif'] :
            raise serializers.ValidationError( {"fieldErrors": [
                    {
                        "name":   "indicatif",
                        "status": "This field is required"
                    },
                  
                ]})
            
        return data
    

    def create(self, validated_data):
        """
        Create and return a new `juridiction` instance, given the validated data.
        """
        juripurchase_data = validated_data.pop('juripurchase')
        post = Juridiction.objects.create()
        post.code = validated_data.get('code')
        post.name = validated_data.get('name')
        post.indicatif = validated_data.get('indicatif')
        
        for juri in juripurchase_data:
            oprice,created=Juridiction_Purchase.objects.get_or_create(telco_id=juri['id'],price_p=juri['price_p'])     
            post.juripurchase.add(oprice)
            
        post.save()
        
        return post
        
    
    def update(self, instance, validated_data):
        """
        Update and return a new `juridiction` instance, given the validated data.
        """
        juripurchase_data = validated_data.pop('juripurchase')
        post = Juridiction.objects.get(pk=instance.pk)
        price=post.juripurchase.all()
        price.delete()
        post.code = validated_data.get('code')
        post.name = validated_data.get('name')
        post.indicatif = validated_data.get('indicatif')
        post.zone = validated_data.get('zone')

        for juri in juripurchase_data:
                
            oprice,created=Juridiction_Purchase.objects.get_or_create(telco_id=juri['id'],price_p=juri['price_p'])     
            post.juripurchase.add(oprice)
        post.save()
        return post
        
    class Meta:
        model = Juridiction
        fields = (
                    'id',
                    'zone',
                    'kind',
                    'code',
                    'name',
                    'indicatif',
                    'juripurchase'
                )
        


