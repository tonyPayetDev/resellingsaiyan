# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from django.conf import settings
from django import forms

from runner.utils.logger import logger, logdebug
#logdebug()

class JSONEditor(forms.widgets.Widget):
    class Media:
        css = {
            'all': ('runner/css/jsoneditor.css',),
        }
        js = ('runner/js/jsoneditor.js',)

    def render(self, name, value, attrs=None, **kwargs):
        field_id = attrs['id']
        field = field_id.split('_', 1)[1]
                    
        context = {
            'field_id': field_id,
            'field': field,
            'value': value or '',
            'STATIC_URL': settings.STATIC_URL
        }

        logger.debug("self=%r"%self.__dict__)
        logger.debug("name=%s value=%s attrs=%r kwargs=%r"%(name, value, attrs, kwargs))
        
#        widget_html = mark_safe(render_to_string('jsoneditor/jsoneditor_widget.html', context))
#        post_html = mark_safe(render_to_string('jsoneditor/jsoneditor_post.html', context))
#        return widget_html + post_html
        return mark_safe(render_to_string('jsoneditor/jsoneditor.html', context))
