# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

import os
from optparse import make_option
import glob

from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist

from customers.models import Reseller, Client
from voice.models import SIPAccount
from runner.utils.logger import logger, logdebug
from runner.utils.date import datenow
from ie.models import ConfigImport
from ie.utils import ie_Customer

class Command(BaseCommand):
    """
    TODO: Doc
    """

    help = _('Import Customer par Reseller, création des SipAccount, création contrat...')
    
    option_list = BaseCommand.option_list + (
        make_option('--resellerid', action='store', dest='reseller', help=_(u'Reseller id')),
        make_option('--contrat', action='store_true', dest='contrat', default=True, help='Contrat import (default action)'),
        make_option('--config', action='store', dest='infoconfig', help=_(u'Config id')),
        make_option('--filename', action='store', dest='filename', help='File name'),
        make_option('--force', action='store_true', dest='force',default=False, help='Force update'),
        make_option('--debug', action='store_true', dest='debug', default=False, help='Debug log'),
        )
    workdate = None
    reseller = None
    infoconfig = None
    myfunc = None
    
    def handle(self, *args, **options):
          
        if options['debug'] == True:
            logdebug()
        logger.debug("options=%s"%options)
        
        self.workdate = datenow()
        logger.info("WORKDATE %s"%self.workdate)
        
        if options['reseller'] is None:
            lst = Reseller.objects.all()
            self.stdout.write(40 * '-')
            for t in lst:
                self.stdout.write("Reseller %s"%t)
            self.stdout.write(40 * '-')
            raise CommandError("Please specifie option reseller")
        else:
            try:
                self.reseller=Reseller.objects.get(pk=options['reseller'])
            except:
                self.stdout.write(Reseller.info_resellers())
                raise CommandError("Reseller not found")

        
        if options['infoconfig'] is None:
            self.stdout.write(ConfigImport.info_configimport())
            raise CommandError("InfoConfig not found")

        try:
            self.infoconfig = ConfigImport.objects.get(pk=options['infoconfig'])
            logger.debug("infoconfig=%s"%self.infoconfig)
        except (ObjectDoesNotExist, ValueError) as e:
            logger.error("ConfigImport Info %s %s"%(options['infoconfig'], e))
            self.stdout.write(ConfigImport.info_configimport())
            raise CommandError("Please specifie option config")

        if options['filename'] is None:
            raise CommandError("Filename not found")

        if options['contrat']:
            self.myfunc = ie_Customer().import_contrat
        else:
            self.myfunc = ie_Customer().import_customer
        
        try:
            self.myfunc(reseller=self.reseller, config=self.infoconfig,
                    filename=options['filename'], force=options['force'])
        except Exception, e:
            raise CommandError("%s"%e)
            
        self.stdout.write('Successfully import Info Customers')

