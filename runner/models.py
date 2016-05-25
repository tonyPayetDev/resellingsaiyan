# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User, UserManager
from django.dispatch import receiver
from django.contrib.sites.models import Site
from django.core.urlresolvers import reverse

# Create your models here.
from runner.utils.site import the_site
from runner.utils.choices import RUNNERWORK_CHOICES
from runner.utils.logger import logger

@python_2_unicode_compatible
class RunnerUser(models.Model):
    user = models.OneToOneField(User)
    site = models.ForeignKey(Site, null=True, blank=True)

    def __str__(self):
        return '({0}) {1} {2}'.format(self.id, self.user, self.site)
    
    objects = UserManager()
        
@receiver(post_save, sender=User)
def handle_user_save(sender, instance, created, **kwargs):
    logger.info("RECEIVE FROM User {0} {1} {2} {3}".format(sender, instance, created, kwargs))

@python_2_unicode_compatible
class RunnerSync(models.Model):
    syncdate = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _('Sync Info')
        verbose_name_plural = _('Syncs Info')

    def __str__(self):
        return '%s' % (self.syncdate)


@python_2_unicode_compatible
class RunnerModel(models.Model):
    """
    TODO: Doc
    """
    siteid = models.ForeignKey(Site, default=the_site())
    syncinfo = models.OneToOneField(RunnerSync, null=True,
                            blank=True, default=None,)
    
    class Meta:
        abstract = True

    def __str__(self):
        if self.siteid:
            return '(site %s)' % self.siteid.id
        return ''
    
    def get_siteid(self):
        if self.siteid:
            return '%s' % self.siteid.id
        return ''
    get_siteid.allow_tags = True
    get_siteid.short_description = "SiteId"
    
    def get_admin_url(self):
        return reverse('admin:{0}_{1}_change'.format(self._meta.app_label, self._meta.module_name), args=(self.pk,))
        
@python_2_unicode_compatible
class Work(RunnerModel):
    """
    TODO: Doc
    passage en python 3
    """
    kind = models.CharField(max_length=1, choices=RUNNERWORK_CHOICES)
    period = models.CharField(max_length=4)

    class Meta:
        verbose_name = _('Work Info')
        verbose_name_plural = _('Works Info')
        unique_together = ("kind", "period")

    def __str__(self):
        return '%s %s' % (self.get_kind_display(), self.period)

    def get_works(self):
        return Work.objects.all()

