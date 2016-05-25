# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

import os
from optparse import make_option
import glob
import json
from os.path import normpath

from django.core.management.base import BaseCommand, CommandError
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django import db

from lines.models import Telco, TelcoInjector
from dashboard.models import dashboard
from customers.models import Client

from ie.utils import ie_Exception, ie_Cdr
from runner.utils.choices import BIZ_CHOICES, info_bizzone
from runner.utils.logger import logger, logdebug
from runner.utils.date import datenow, yearofdate, monthofdate, prevmonthofdate, prevyearofdate, datefromstring, DATE_FORMAT

class Command(BaseCommand):
    """
    TODO: Doc
    """

    help = 'Import CDRs par Operateur et Zone de Produit (vgast, presel...)'
    help += '\nuniquement au format CSV'
    
    option_list = BaseCommand.option_list + (
        make_option('--auto', action='store_true', dest='auto', default=False, help=_(u'Auto use active telcoinjector')),
        make_option('--telco', action='store', dest='telco', help=_(u'Telco id')),
        make_option('--client', action='store', dest='client', help=_(u'Client Code List')),
        make_option('--injector', action='store', dest='injector', help=_(u'Injector id')),
        make_option('--bizzone', action='store', dest='bizzone', help='Bizzone Code'),
        make_option('--directory', action='store', dest='directory', help=_(u'Source directory')),
        make_option('--filename', action='store', dest='filename', help='File name'),
        make_option('--extention', action='store', dest='extention', help='Extention File name'),
        make_option('--yearmonth', action='store', dest='yearmonth', help='Year/Month working (format:YYYY/MM)'),
        make_option('--force', action='store_true', dest='force',default=False, help='Force update CDR info'),
        make_option('--debug', action='store_true', dest='debug', default=False, help='Debug log'),
        make_option('--fake', action='store_true', dest='fake', default=False, help='Fake mode, only file list'), 
        make_option('--check', action='store_true', dest='check', default=False, help='Check mode, only test parsing'), 
        )
    thelist = []
    telco = None
    telcoinjector = None
    directory = None
    extention = None
    cdrs=0
    workdate = None
    djangodebug = False
    
    def get_files(self, rep, filenameext=""):
        logger.debug("rep=%s filenameext=%s"%(rep, filenameext))
        
        for kind in filenameext.split(','):
            #logger.debug("kind=%s"%kind)
            
            for root, dirs, files in os.walk(rep):
                logger.debug("root=%s dirs=%s files=%s"%(root, dirs, files))
                  
                if 'save' in dirs:
                    dirs.remove('save')
                
                for f in files:
                    (shortname, extension) = os.path.splitext(f)
                    if kind:
                        if extension[1:] in kind:
                            self.thelist.append(os.path.join(root, f))
                    else:
                        self.thelist.append(os.path.join(root, f))
        return self.thelist

    def doit(self, options):
        if len(self.thelist):
            lstndis = []
            Fake = options['fake']
            
            if options['client']:
                for cl in options['client'].split(','):
                    try:
                        lstndiclient = Client.objects.get(code=cl).sipaccount_set.all().values_list('cli',flat=True)
                        logger.debug("NDIS CLIENT (%s) %s"%(cl, lstndiclient))
                        lstndis += lstndiclient
                    except:
                        logger.error("NO NDI FOR CLIENT %s"%cl)

            logger.debug("LIST NDIS %s"%lstndis)
            
            for filename in self.thelist:
                logger.info("FILENAME %s"%filename)
                if not Fake:
                    try:
                        self.cdrs+=ie_Cdr().import_cdr(workdate=self.workdate,
                            fromtelco=self.telco, injector=self.telcoinjector,
                            filename=filename, force=options['force'], 
                            clientndis=lstndis, check=options['check'])
                    except ie_Exception, e:
                        logger.error("%s %s"%(e, filename))
                
                if self.djangodebug:
                    logger.debug("Garbage Django Debug")
                    db.reset_queries()
    
    @dashboard("ImportCdr")
    def handle(self, *args, **options):
        if getattr(settings, 'DEBUG',False):
            self.djangodebug = True
            
        if options['debug'] == True:
            logdebug()
        logger.debug("options=%s"%options)
        
        self.workdate = datenow()
        logger.info("WORKDATE %s"%self.workdate)
        
        if options['auto'] is False: #automatic, TelcoInjectors par Telco
            logger.debug("NO AUTO")
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
                except ObjectDoesNotExist, e:
                    self.stdout.write(Telco.info_telcos())
                    raise CommandError("Telco not found")
    
            #if options['bizzone'] is None:
            #  logger.error("bizzone \n%s"%info_bizzone())
            #  raise CommandError("Please specifie option bizzone")
            
            if options['injector'] is None:
                lsttelco = Telco.objects.all()
                for t in lsttelco:
                    if t.injectors:
                        self.stdout.write(40 * '-')
                        self.stdout.write("Telco %s"%t)
                        for p in t.injectors.all():
                            self.stdout.write("Injectors : %s"%"(%s) %s [%s] [%s]" % 
                                              (int(p.id), p.name, p.get_bizzone_display(),
                                              p.get_typeconnexion_display()))
                        self.stdout.write(40 * '-')
                raise CommandError("Please specifie option injector")
        
            try:
                self.telcoinjector = TelcoInjector.objects.get(pk=options['injector'])
                logger.debug("injector=%s"%self.telcoinjector)
                if options['extention']:
                    self.extention = options['extention']   
                else:
                    self.extention = self.telcoinjector.get_typefile_display()
                
                if options['filename']:
                    self.thelist = glob.glob(options['filename'])
                else:    
                    if options['directory']:
                        self.directory = options['directory']
                    else:
                        self.directory = normpath(self.telcoinjector.path_dest)
                    
                    logger.debug("directory=%s extention=%s list=%s"%(self.directory, self.extention, 
                             self.get_files(self.directory, self.extention)))
                    
            except ObjectDoesNotExist, e:
                logger.error("Telco Injector Info %s %s"%(options['injector'], e))
                raise CommandError("Please specifie option injector")
            
            self.doit(options)
        else:
            logger.debug("AUTO")
            for i in TelcoInjector.injectorauto.values('id','name','telco','telco__name','name').order_by('telco', 'id'):
                self.thelist = []
                injector = None
                telco = None
                logger.debug("Telco (%s) %s Injector (%s) %s"%(i['telco'], i['telco__name'], i['id'], i['name']))
                injector=TelcoInjector.objects.get(id=i['id'])
                telco=Telco.objects.get(id=i['telco'])
                path_dest = normpath(injector.path_dest)
                logger.debug("--> Working (%s) path=%s"%(injector, path_dest))
                logger.debug("YEAR=%s MONTH=%s"%(yearofdate(self.workdate), monthofdate(self.workdate)))
                logger.debug("PYEAR=%s PMONTH=%s"%(prevyearofdate(self.workdate), prevmonthofdate(self.workdate)))
                #traitement m-1 et m
                self.telcoinjector=injector
                self.telco=telco
                
                if options['yearmonth']:
                    y,m = options['yearmonth'].split('/')
                    self.workdate = datefromstring('%s/%s/%s'%('01', m, y))
                    
                self.get_files(rep="%s%s%04d%s%02d"%(path_dest,
                                            os.sep, 
                                            yearofdate(self.workdate), 
                                            os.sep, 
                                            monthofdate(self.workdate)))
                                            
                self.doit(options)
            
        self.stdout.write('Successfully import CDRs %s'%self.cdrs)
        return {'info': 'Successfully import CDRs %s'%self.cdrs, 'error':'', 'date':self.workdate.strftime(DATE_FORMAT)}

