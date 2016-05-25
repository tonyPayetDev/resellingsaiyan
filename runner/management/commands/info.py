# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

import logging
from optparse import make_option

from django.core.management.base import BaseCommand
from django.core.exceptions import ObjectDoesNotExist

from valo.models import CDR, Juridiction
from voice.models import SIPAccount


from lines.models import Telco
from runner.models import Work

logger = logging.getLogger('runner')

class Command(BaseCommand):
    """
    TODO: Doc
    """

    help = 'Runner infos diverses'

    #"reseller=","client=","datefrom=","dateto=", "force"
    option_list = BaseCommand.option_list + (
        make_option('--works', action='store_true', dest='works',default=False, help='Info Works'),
        make_option('--telco', action='store', dest='telco',default=False, help='Info All Telco all ou id'),
        make_option('--reseller', action='store', dest='reseller',default=False, help='Info Reseller all ou id'),
        make_option('--client', action='store', dest='client',default=False, help='Info Client all ou id'),
        make_option('--grille', action='store', dest='datefrom',default=False, help='Info Grille all ou id'),
        make_option('--debug', action='store_true', dest='debug',default=False, help='Debug log'),
        )
        
    def handle(self, *args, **options):
        #self.stdout.write("options=%s"%options)
        if options['debug'] == True:
            logger.setLevel(logging.DEBUG)
        else:
            logger.setLevel(logging.INFO)
            
        logger.debug("options=%s"%options)
        
        if options['works'] :
            print Work().get_works()
            exit(0)
                
        if options['telco'] == "all":
            q=Telco.objects.all()
            for telco in q:
                print telco.__dict__
        else:
            try:
                q=Telco.objects.get(id=int(options['telco']))
                print q.__dict__
            except ObjectDoesNotExist:
                pass
            
