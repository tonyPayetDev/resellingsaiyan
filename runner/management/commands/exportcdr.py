# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

import os
from optparse import make_option

from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist

from runner.utils.logger import logger, logdebug
from customers.models import Reseller
from ie.utils import ie_Cdr

class Command(BaseCommand):
    """
    TODO: Doc
    """

    help = 'Export CDRs par Reseller'
    help += '\nuniquement au format CSV (virgule et entete)'
    
    option_list = BaseCommand.option_list + (
        make_option('--reseller', action='store', dest='reseller', help=_(u'Reseller id')),
        make_option('--datefrom', action='store', dest='datefrom', help=_(u'From Date (YYYYMMJJ)')),
        make_option('--dateto', action='store', dest='dateto', help=_(u'To Date (YYYYMMJJ)')),
        make_option('--directory', action='store', dest='directory', help=_(u'Destination directory')),
        make_option('--force', action='store_true', dest='force',default=False, help='Force export CDR'),
        make_option('--debug', action='store_true', dest='debug',default=False, help='Debug log'),
        )
    
    def handle(self, *args, **options):
        if options['debug'] == True:
            logdebug()
        logger.debug("options=%s"%options)

        if options['reseller'] is None:
            logger.error("reseller \n%s"%Reseller.info_resellers())
            raise CommandError("Please specifie option reseller")
        
        try:
            resel=Reseller.objects.get(id=options['reseller'])
        except ObjectDoesNotExist:
            logger.error("reseller \n%s"%Reseller.info_resellers())
            raise CommandError("Please specifie option reseller")
            
        ie_Cdr().export_cdr(reseller=resel, datefrom=options['datefrom'], dateto=options['dateto'])
        self.stdout.write('Successfully export CDRs')

