# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

from optparse import make_option
import traceback
import json
import logging

from django.core.management.base import BaseCommand

from valo.models import CDR
from runner.utils.logger import logger as logger_runner, logdebug
from runner.utils.date import datenow, DATE_FORMAT
from dashboard.models import dashboard

class Command(BaseCommand):
    """
    TODO: Doc
    """

    help = 'CDR Setting customer, juridiction infos'
    
    option_list = BaseCommand.option_list + (
        make_option('--records', action='store', dest='records',default=10000, help='Records Number CDR (default 10000)'),
        make_option('--inerror', action='store_true', dest='inerror',default=False, help='Only CDR in error'),
        make_option('--force', action='store_true', dest='force',default=False, help='Force update CDR'),
        make_option('--debug', action='store_true', dest='debug',default=False, help='Debug log'),
        make_option('--logger', action='store', dest='logger',help='Logger name'),
        )

    @dashboard("SetCdr")
    def handle(self, **options):
        if options['logger']:
            logger = logging.getLogger(options['logger'])
        else:
            logger = logger_runner
       
        if options['debug'] == True:
            logdebug()
        logger.debug("options=%s"%options)
        
        if options['inerror']:
            q=CDR.extractinerror.all()[:options['records']]
        else:
            if options['force']:
                q=CDR.extractforce.all()[:options['records']]
            else:
                q=CDR.extract.all()[:options['records']]
            
        date=datenow().strftime(DATE_FORMAT)
        
        try:
            error=CDR.set_cdr(q, force=options['force'])
            ret={'info':'Successfully set CDRs %s %s'%(error['cdrs'], error['cdrserror']), 'error':error['error'], 'date':date}
        except:
            ret={'info':'Error set CDRs', 'error':traceback.format_exc(), 'date':date}    

        ret=json.dumps(ret)
        self.stdout.write(ret)
        return ret
