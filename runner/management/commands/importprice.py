# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014/2015
"""
from __future__ import unicode_literals

from optparse import make_option

from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist

from lines.models import Telco
from runner.utils.choices import info_typezone, list_typezone
from runner.utils.logger import logger, logdebug
from runner.utils.date import datenow
from ie.models import ConfigImport
from ie.utils import ie_Price

class Command(BaseCommand):
    """
    TODO: Doc
    """

    help = 'Import fichier tarif achat opérateur'
    
    option_list = BaseCommand.option_list + (
        make_option('--telco', action='store', dest='telco', help=_(u'Telco id')),
        make_option('--config', action='store', dest='infoconfig', help=_(u'InfoConfig id')),
        make_option('--bizzone', action='store', dest='bizzone', help='Bizzone Code'),
        make_option('--typezone', action='store', dest='typezone', help='TypeZone id'),
        make_option('--filename', action='store', dest='filename', help='File name'),
        make_option('--force', action='store_true', dest='force',default=False, help='Force update price info'),
        make_option('--debug', action='store_true', dest='debug',default=False, help='Debug log'),
        )
    telco = None
    infoconfig = None
    workdate = datenow()
   
    def handle(self, *args, **options):
        if options['debug'] == True:
            logdebug()

        logger.debug("options=%s"%options)

        if options['telco'] is None:
            lsttelco = Telco.objects.all()
            self.stdout.write(40 * '-')
            for t in lsttelco:
                self.stdout.write("Telco %s"%t)
            self.stdout.write(40 * '-')
            raise CommandError("Please specifie option telco")
        else:
            try:
                self.telco=Telco.objects.get(pk=options['telco'])
            except:
                self.stdout.write(Telco.info_telcos())
                raise CommandError("Telco not found")

        if options['typezone'] is None or not options['typezone'] in list_typezone():
            logger.error("typezone \n%s"%info_typezone())
            raise CommandError("Please specifie option typezone")

#        if options['bizzone'] is None:
#            logger.error("bizzone \n%s"%info_bizzone())
#            raise CommandError("Please specifie option bizzone")
 
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
            ie_Price().import_price(type=options['typezone'],
                    fromtelco=self.telco, config=self.infoconfig,
                    filename=options['filename'], force=options['force'])
        except Exception, e:
            raise CommandError("%s"%e)
                    
        self.stdout.write('Successfully import price file %s'%options['filename'])

