# -*- coding: utf-8 -*-
"""
Author: Philippe 'paHpa' Vivien <philippe.vivien@nerim.com>

Copyright: Nerim, 2014
"""
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Register your models here.
from .models import Work, RunnerUser

class RunnerUserInline(admin.StackedInline):
    model = RunnerUser

# Define a new User admin
class UserAdmin(UserAdmin):
    def user_site(self, u):
        try:
            r=RunnerUser.objects.get(user_id=u.id)
            return '({0}) {1}'.format(r.site.id, r.site)
        except:
            return ''
    user_site.short_description = 'Site'
    
    list_display = UserAdmin.list_display + ('is_superuser','is_active','user_site',)
    inlines = (RunnerUserInline, )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Work)
