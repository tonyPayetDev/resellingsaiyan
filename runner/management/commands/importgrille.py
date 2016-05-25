# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2015
"""
from __future__ import unicode_literals

import os
from optparse import make_option
import glob

from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist

from customers.models import Reseller, Client
from ie.models import ConfigImport
from valo.models import GA_Telco
from runner.utils.logger import logger, logdebug
from runner.utils.date import datenow
from ie.utils import ie_Grille

class Command(BaseCommand):
    """
    TODO: Doc
    """

    help = _('Import Nom Grille pour un Reseller')
    
    option_list = BaseCommand.option_list + (
        make_option('--resellerid', action='store', dest='reseller', help=_(u'Reseller id')),
        make_option('--config', action='store', dest='infoconfig', help=_(u'Config id')),
        make_option('--gaid', action='store', dest='ga', help=_(u'GA_Telco id')),
        make_option('--filename', action='store', dest='filename', help='File name'),
        make_option('--force', action='store_true', dest='force',default=False, help='Force update'),
        make_option('--debug', action='store_true', dest='debug', default=False, help='Debug log'),
        make_option('--grillename', action='store_true', dest='grillename', default=True, help='Grille name import (default action)'),
        make_option('--grilleprice', action='store_true', dest='grilleprice', default=False, help='Grille price import'), 
        make_option('--grilleclient', action='store_true', dest='grilleclient', default=False, help='Grille client import'), 
        )
        
    workdate = None
    reseller = None
    infoconfig = None
    ga = None
    
    def handle(self, *args, **options):
    
        if options['debug'] == True:
            logdebug()
        logger.debug("options=%s"%options)
        
        if options['grilleprice']:
            options['grillename'] = options['grilleclient'] = False

        if options['grilleclient']:
            options['grillename'] = options['grilleprice'] = False

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

        if options['ga'] is None and options['grillename']:
            lst = GA_Telco.objects.all()
            self.stdout.write(40 * '-')
            for t in lst:
                self.stdout.write("Grille Achat %s"%t)
            self.stdout.write(40 * '-')
            raise CommandError("Please specifie option ga")
        else:
            if options['ga'] and options['grillename']:
                try:
                    self.ga=GA_Telco.objects.get(pk=options['ga'])
                except:
                    self.stdout.write(GA_Telco.info_gas())
                    raise CommandError("GA_Telco not found")

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

        try:
            if options['grillename']:
                ie_Grille().import_grillename(reseller=self.reseller, ga=self.ga, config=self.infoconfig,
                    filename=options['filename'], force=options['force'])
                    
            if options['grilleprice']:
                ie_Grille().import_grilleprice(reseller=self.reseller, config=self.infoconfig,
                    filename=options['filename'], force=options['force'])
                    
            if options['grilleclient']:
                ie_Grille().import_grilleclient(reseller=self.reseller, config=self.infoconfig,
                    filename=options['filename'], force=options['force'])
                
        except Exception, e:
            raise CommandError("%s"%e)
            
        self.stdout.write('Successfully import Grille')

