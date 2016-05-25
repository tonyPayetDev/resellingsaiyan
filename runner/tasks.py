# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import absolute_import

import json

from celery import shared_task


from runner.utils.logger import logger
from runner.utils.date import datenow, DATE_FORMAT
from runner.utils.site import the_site

@shared_task
def debugtest(*args, **kwargs):
    
    @dashboard("Debug")
    def doit():
        workdate = datenow()
        ret = {'info': '(site %s) Successfully Debug'%the_site(), 'error':'', 'date':workdate.strftime(DATE_FORMAT)}
        logger.info(ret)
        
        return ret

    return doit()
