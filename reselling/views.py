# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>
Author: Tony Payet <tony@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

from django.contrib.auth.decorators import login_required , user_passes_test
from django.utils.decorators import method_decorator
from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect, StreamingHttpResponse,Http404
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.forms.formsets import formset_factory
from django.forms.models import inlineformset_factory
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils.encoding import python_2_unicode_compatible
from django.template import Context, loader
# Create your views here.
from valo.models import Juridiction ,Juridiction_Purchase 

#from valo.models import GV_Telco, GV_Ndi, GV_TelcoDetail, GV_SvaDetail
#from valo.models import GV_SIPAccountDetail
#from valo.models import GV_IndicatifDetail, GV_ClientDetail, GV_EntiteDetail

from lines.models import Telco
from runner.utils.logger import logger
from reselling.forms import juriForm ,juriPurchase 
from runner.utils.choices import TYPECDR_CHOICES, PHONEKIND_CHOICES, BIZ_CHOICES, ZONE_CHOICES, get_zone, ZONE_JSONLIST
from customers.models import Reseller, Client
import json
from bunch import Bunch
from .config import saiyanGenerate

#class reselling_GV_Telco(BaseDatatableView):
#    
#    model = GV_Telco
#    columns = ['id','name','context','type']
#    order_columns = ['id', 'name','context','type']

class reselling_list(BaseDatatableView):
    
    model = Juridiction

    columns = ['id','kind','code', 'name','indicatif','zone']
    order_columns = ['id','kind','code', 'name','indicatif','zone']

    def get_context_data(self, *args, **kwargs):
        context = super(reselling_list, self).get_context_data(**kwargs)
        data=context['data']
        # creer la tab option juripurchase 
        zone=ZONE_CHOICES
        ZONE_SELECT = sorted([{"value":v,"label":v} for (k, v) in ZONE_CHOICES])
        print(ZONE_SELECT)

        
        # creer la tab option juripurchase 
        listeT=Telco.objects.all()
        listeT=[{"label":s.name, "name":s.id,"value":"I"}  for s in listeT]
        
        # rajoute dtrowid et jurirpurchase a json deja formé 
        for a in data:
            idrecup=a['id']
            a['DT_RowId']=idrecup 
            
            juri=Juridiction.objects.get(pk=idrecup)
            
            listepurchase = juri.juripurchase.all()
            pricetelco=[{"id":s.telco.id,"label":s.telco.name,"value":s.price_p}  for s in listepurchase]
            a['juripurchase']=pricetelco 

            
            
        ret ={
                       'data':data,
                       'recordsTotal': context['recordsTotal'],
                       'recordsFiltered':  context['recordsFiltered'],
                       'draw':	context['draw'],
                       "options": {"juripurchase": listeT,"zone": ZONE_SELECT}
            }

        return ret

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(reselling_list, self).dispatch(*args, **kwargs)
    

class reselling_listClient(BaseDatatableView):
    
    model = Client

    columns = ['id','name','name2','code']
    order_columns = ['id','name','name2','code']

    def get_context_data(self, *args, **kwargs):
        context = super(reselling_listClient, self).get_context_data(**kwargs)
        data=context['data']
        # creer la tab option reseller 
        listeR=Reseller.objects.all()
        listeR=[{"label":str(s.name), "name":str(s.id),"value":str(s.name)}  for s in listeR]
        

        # rajoute dtrowid et jurirpurchase a json deja formé 
        for a in data:
            a['DT_RowId']=a['id']
            
            client=Client.objects.get(pk=1)
            print(client)
            a['reseller']=""

            if client.reseller_id:
                r=Reseller.objects.get(pk=client.reseller_id)
                print(client.reseller_id)
                a['reseller']=r.name 

                
            
        ret ={
                       'data':data,
                       'recordsTotal': context['recordsTotal'],
                       'recordsFiltered':  context['recordsFiltered'],
                       'draw':	context['draw'],
                        "options": {"reseller":listeR}

            }

        return ret
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(reselling_listClient, self).dispatch(*args, **kwargs)

class dashboard(TemplateView):
    """
    TODO:a faire doc 
    """
    template_name = 'reselling/dashboard.html'
    
    def get_context_data(self, **kwargs):
        """
            stats sur le nombre de prix par telco operateur  
        """
        context = super(dashboard, self).get_context_data(**kwargs)
        
        if self.request.user.groups.filter(name='rien').exists():
            raise Http404("vous ne pouvez pas accédez a cette page ")
            
        cptl=Juridiction_Purchase.objects.filter(telco_id="1")
        sfr=Juridiction_Purchase.objects.filter(telco_id="2")
        b3g=Juridiction_Purchase.objects.filter(telco_id="3")
        colt=Juridiction_Purchase.objects.filter(telco_id="4")
        trans=Juridiction_Purchase.objects.filter(telco_id="5")
        keyyo=Juridiction_Purchase.objects.filter(telco_id="7")

        dataHightChart={
                      "chart": {
                        "plotBorderWidth": "null",
                        "plotShadow": "false",
                        "type": "pie"
                      },
                      "title": {
                        "text": "Operator  January, 2015 to May, 2015"
                      },
                      "tooltip": {
                        "pointFormat": "{series.name}: <b>{point.percentage:.1f}%</b>"
                      },
                      "plotOptions": {
                        "pie": {
                          "allowPointSelect": "true",
                          "cursor": "pointer",
                          "dataLabels": {
                            "enabled": "true",
                            "format": "<b>{point.name}</b>: {point.percentage:.1f} %",
                         
                          }
                        }
                      },
                      "series": [
                        {
                          "name": "Brands",
                          "colorByPoint": "true",
                          "data": [
                            {
                              "name": "SFR",
                              "y": sfr.count()

                            },
                            {
                              "name": "cptl",
                              "y": cptl.count(),
                              "sliced": "true",
                              "selected": "true"
                            },
                            {
                              "name": "trans",
                              "y": trans.count()
                            },
                            {
                              "name": "b3g",
                              "y": b3g.count()
                            },
                            {
                              "name": "keyyo",
                              "y":keyyo.count()
                            },
                            {
                              "name": "colt",
                              "y": colt.count()
                            }
                          ]
                        }
                      ]
                    }
        
        dataHightChart2={
            
                "chart": {
                    "type": 'bar'
                },
                "title": {
                    "text": 'Operator'
                },
                "xAxis": {
                    "categories": ['Nerim', 'sfr', 'Orange']
                },
                "yAxis": {
                    "title": {
                        "text": 'Fruit eaten'
                    }
                },
                "series": [{
                    "name": 'Jane',
                    "data": [1, 0, 4]
                }, {
                    "name": 'John',
                    "data": [5, 7, 3]
                }]
        }
        
        context['jsondataHightChart2'] = json.dumps(dataHightChart2)
        context['jsondataHightChart'] = json.dumps(dataHightChart)
        

        return context    
     
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(dashboard, self).dispatch(*args, **kwargs)   


    
"""

cette class va correspondre au contoleur  a la page achats qui renvoie un json au template achats 

"""
class achats(TemplateView):
    template_name = 'reselling/achats.html'
    def get_context_data(self, **kwargs):
        """
               renvoie la liste des champs pour generer datatatable et editor
        """
        context = super(achats, self).get_context_data(**kwargs)
        #data=saiyanGenerate("achats")

        data={
                  "idsaiyan": "example2",
                  "urldata": "/reselling/jsonlistjuri/",
                  "urlrest": "/api/juridt",
                  "dom": "Tfrtip",
                  "col": "12",
                  "fields": [
                    {
                      "label": "indicatif:",
                      "name": "indicatif"
                    },
                    {
                      "label": "zone:",
                      "name": "zone",
                      "type": "select"
                    },
                    {
                      "label": "Name:",
                      "name": "name"
                    },
                    {
                      "label": "Code:",
                      "name": "code"
                    },
                    {
                      "label": "tarifs:",
                      "name": "juripurchase",
                      "type": "list"
                    }
                  ]
        }
      
        context['jsonfields'] = json.dumps(data) 
        return context
    
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(achats, self).dispatch(*args, **kwargs)

    
class ventes(TemplateView):
    template_name = 'reselling/ventes.html'
    def get_context_data(self, **kwargs):
        """
               renvoie la liste des champs pour generer datatatable et editor
        """
        context = super(ventes, self).get_context_data(**kwargs)
     
        data={

                        
                        "idsaiyan": "example2",
            
                        "urldata": "/reselling/jsonlistGv_telco/",
                        "urlrest": "/api/juridt",
            
                    "dom": "Tfrtip",
            
                           "fields": [

                    {
                      "label": "type:",
                      "name": "type",
                    },
                    {
                      "label": "Name:",
                      "name": "name"
                    },

                    {
                      "label": "context:",
                      "name": "context",
                    }
                  ]
        }

        context['jsonfields'] = json.dumps(data)
        return context
    
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(ventes, self).dispatch(*args, **kwargs)       
    
class clients(TemplateView):
    template_name = 'reselling/clients.html'
    def get_context_data(self, **kwargs):
        """
               renvoie la liste des champs pour generer datatatable et editor
        """
        context = super(clients, self).get_context_data(**kwargs)
        # data=saiyanGenerate("clients")

        data={

                        
                        "idsaiyan": "example2",
            
                        "urldata": "/reselling/jsonlistclient/",
                        "urlrest": "/api/clients",
                        "dom": "Tfrtip",

            
                           "fields": [
                  
                    {
                      "label": "Name:",
                      "name": "name"
                    },
                      {
                      "label": "revendeur:",
                      "name": "reseller",
                      "type": "select"

                    },             
                    {
                      "label": "Code:",
                      "name": "code"
                    },
                                  
                    {
                      "label": "name2:",
                      "name": "name2"
                    },
                     {
                      "label": "termination_date:",
                      "name": "termination_date",
                      "type": "date"

                    }
                  ]
            }
      
        context['jsonfields'] = json.dumps(data)
        return context
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(clients, self).dispatch(*args, **kwargs)       
        
class travaux(TemplateView):
    template_name = 'reselling/travaux.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(travaux, self).dispatch(*args, **kwargs)       
    
class config(TemplateView):
    template_name = 'reselling/config.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(config, self).dispatch(*args, **kwargs)   

class aide(TemplateView):
    template_name = 'reselling/aide.html'
    def get_context_data(self, **kwargs):
        if not self.request.user.is_staff:
            raise Http404("vous ne pouvez pas accédez a cette page ")

        
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(aide, self).dispatch(*args, **kwargs)       


