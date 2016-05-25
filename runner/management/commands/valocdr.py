# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

import traceback
import json
from optparse import make_option
import logging

from django.core.management.base import BaseCommand
from django.db.models import Sum
from django.db.models import Q

from valo.utils.cdr import valo_CDR
from valo.models import CDR

from customers.models import Reseller, Client
from dashboard.models import dashboard
from runner.utils.date import datenow, DATE_FORMAT, datefromstring
from runner.utils.logger import logger as logger_runner, logdebug

class Command(BaseCommand):
    """
    TODO: Doc
    """
    help = 'Valo CDR'

    option_list = BaseCommand.option_list + (
        make_option('--reseller', action='store', dest='reseller', help='Reseller Code'),
        make_option('--client', action='store', dest='client', help='Client Code'),
        make_option('--datefrom', action='store', dest='datefrom',help='Begin Date (format YYYY-MM-DD)'),
        make_option('--dateto', action='store', dest='dateto',help='End Date (format YYYY-MM-DD)'),
        make_option('--records', action='store', dest='records',default=10000, help='Records Number CDR (default 10000)'),
        make_option('--cdr', action='store', dest='cdr', help='Cdr id'),
        make_option('--force', action='store_true', dest='force',default=False, help='Force Valo (insert+update)'),
        make_option('--debug', action='store_true', dest='debug',default=False, help='Debug log'),
        make_option('--logger', action='store', dest='logger',help='Logger name'),
        make_option('--context', action='store', dest='context',default='Telco', help='Context (Telco, Resel)'),
        )
    
    @dashboard("ValoCdr")
    def handle(self, *args, **options):
        ret = {}     
        datefrom = dateto = cdrmanager = None
        reseller = client = context = None
        
        if options['logger']:
            logger = logging.getLogger(options['logger'])
        else:
            logger = logger_runner
            
        if options['debug'] == True:
            logdebug()

        logger.debug("options=%s"%options)
        q=None

        if options["datefrom"]:
            datefrom = datefromstring(options["datefrom"]+" 00:00:00", short=False)

        if options["dateto"]:
            dateto = datefromstring(options["dateto"]+" 23:59:59", short=False)
        
        if options["reseller"]:
            reseller = options["reseller"]
        
        if options["client"]:
            client = options["client"]
        
        if options['cdr']:
            q = CDR.objects.filter(id=options['cdr'])
        else:
            if options['context'] == 'Telco':
                if options['force']==False:
                    cdrmanager = CDR.valo
                    
                else:
                    cdrmanager = CDR.valoforce
            else:
                cdrmanager = CDR.valoresel
                
            if datefrom and dateto:
                q=cdrmanager.filter(sessiondate__range=(datefrom, dateto))
            elif datefrom and dateto == None:
                q=cdrmanager.filter(sessiondate__gte=datefrom)
            elif datefrom == None and dateto:
                q=cdrmanager.filter(sessiondate__lte=dateto)
            else:
                q=cdrmanager.all()
            
            if client or reseller:
                if client:
                    client = Client.objects.get(code=client)
                    q = q.filter(client=client)
                if reseller:
                    reseller = Reseller.objects.get(code=reseller)
                    q = q.filter(reseller=reseller)
                    options['context'] = 'Resel'
        
        q = q[:options["records"]]
        cdrcount = q.count()
        date=datenow()
        
        try:
            error=valo_CDR(context=options['context']).set_valo(q, date=date, logger=logger)
            ret={'info':'Successfully Valo Resel (nb=%s)'%cdrcount, 'error':error, 'date':date.strftime(DATE_FORMAT)}
        except:
            ret={'info':'Error Valo Resel (nb=%s)'%cdrcount, 'error':traceback.format_exc(), 'date':date.strftime(DATE_FORMAT)}

        ret = json.dumps(ret)
        self.stdout.write(ret)
        return ret
        
        
